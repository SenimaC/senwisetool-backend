import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AllRoles } from 'src/common/constants/roles.constant';
import {
  errorResponse,
  successResponse,
} from 'src/common/helpers/api-response.helper';
import {
  generate6DigitCode,
  generateSecurePassword,
} from 'src/common/helpers/string-generator';
import { ApiResponse } from 'src/common/types/api-response.type';
import { EmailVerificationContext } from 'src/common/types/mail';
import { LoginResponse } from 'src/common/types/user.type';
import { CompanyService } from 'src/company/company.service';
import { MailService } from 'src/mail/mail.service';
import {
  LoginDto,
  RegisterDto,
  resendEmailVerificationDto,
  ValidateAccountDto,
  VerifyEmailDto,
} from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => CompanyService)) // ✅ Important
    private readonly companyService: CompanyService,
  ) {}
  /**
   * Register a new user
   * @param dto - Registration data
   * @param role - Optional role ID to assign to the user
   * @returns ApiResponse with success message and status code
   */
  async register(dto: RegisterDto, role?: string): Promise<ApiResponse<any>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email déjà utilisé');
      }

      let roleId: string = null;
      if (role) {
        // verifier s'il existe un lead developer
        const leaDevRole = await this.prisma.role.findUnique({
          where: { name: AllRoles.LEAD_DEVELOPER },
        });

        if (leaDevRole) {
          // Si le rôle est LEAD_DEVELOPER, vérifier s'il y a déjà un lead developer
          if (role === leaDevRole.id) {
            const exist_lead_developer = await this.prisma.user.findFirst({
              where: { roleId: leaDevRole.id },
            });

            if (exist_lead_developer) {
              throw new BadRequestException(
                'Un lead developer existe déjà. Veuillez choisir un autre rôle.',
              );
            }
          }
        }

        const existingRole = await this.prisma.role.findUnique({
          where: { id: role },
        });

        if (existingRole) roleId = existingRole.id;
      }

      if (!role || !roleId) {
        const defaultRole = await this.prisma.role.findUnique({
          where: { name: process.env.DEFAULT_USER_ROLE },
        });
        if (!defaultRole) {
          throw new BadRequestException(
            'Rôle non trouvé. Veuillez spécifier un rôle valide ou veuillez contacter le service technique.',
          );
        }
        roleId = defaultRole.id;
      }

      const hashedPassword = await this.sendUserCredential(dto.email);

      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
          roleId,
        },
      });

      const userData = await this.userService.getUser(user.id);
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      return successResponse(
        'Compte créé avec succès. Les informations de connexion ont été envoyées à votre adresse email.',
        201,
        userData,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Login a user
   * @param dto - Login data containing email and password
   * @returns ApiResponse with access token, refresh token, and user data
   */
  async login(dto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user || !(await bcrypt.compare(dto.password, user.password)))
        throw new ForbiddenException('Identifiants invalides');

      const tokens = await this.generateTokens(user.id);

      const userData = await this.userService.getUser(user.id);
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      return successResponse('Connexion réussie', 201, {
        accessToken: tokens.data.accessToken,
        refreshToken: tokens.data.refreshToken,
        user: userData.data,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Send user credentials via email
   * @param email - User's email address
   * @returns Hashed password for the user
   */
  async sendUserCredential(email: string) {
    try {
      const password = generateSecurePassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.mailService.sendAuthCredential(email, email, password);

      return hashedPassword;
    } catch (error) {
      errorResponse(error);
    }
  }

  /**
   * Resend email verification code to the user
   * @param dto - Data transfer object containing user's email
   * @returns ApiResponse with success message and status code
   */
  async resendEmailVerification(dto: resendEmailVerificationDto) {
    try {
      const code = generate6DigitCode;
      await this.mailService.sendEmailVerificationCode(
        dto.email,
        code,
        EmailVerificationContext.USER,
      );

      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          codeVerificationProcess: true,
          codeVerification: code,
          codeVerificationExpires: new Date(Date.now() + 2 * 60 * 1000), // 2 min
        },
      });

      return successResponse(
        'Un code de vérification à été envoyé à votre adresse email',
        201,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Verify user's email using the provided code
   * @param dto - Data transfer object containing email and verification code
   * @returns ApiResponse with success message and status code
   */
  async verifyEmail(dto: VerifyEmailDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) throw new ForbiddenException('Utilisateur non trouvé');

      if (!user.codeVerificationProcess)
        throw new ForbiddenException(
          "Aucun proccessus de verification d'email enclanché sur ce compte",
        );

      if (!user.codeVerification || user.codeVerification !== dto.code) {
        throw new ForbiddenException('Code de vérification invalide');
      }

      if (
        user.codeVerificationExpires &&
        user.codeVerificationExpires < new Date()
      ) {
        throw new ForbiddenException('Code expiré');
      }

      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          codeVerificationProcess: false,
          codeVerification: null,
          codeVerificationExpires: null,
        },
      });

      const hashedPassword = await this.sendUserCredential(dto.email);

      await this.prisma.user.update({
        where: { email: dto.email },
        data: {
          password: hashedPassword,
        },
      });
      return successResponse(
        `vos informations de connexions ont été envoyées sur ${dto.email}`,
        201,
      );
    } catch (error) {
      errorResponse(error);
    }
  }

  /**
   * Change user's password
   * @param dto - Data transfer object containing current and new passwords
   * @param id - User's ID
   * @returns ApiResponse with success message and status code
   */
  async validateAccount(dto: ValidateAccountDto, email: string, id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, email },
      });
      if (!user) throw new NotFoundException('User not found');

      const tokens = await this.generateTokens(user.id);

      const userData = await this.userService.getUser(user.id);

      if (!user.isEmailVerified) {
        const userVerified = await this.prisma.user.update({
          where: { email: user.email },
          data: { isEmailVerified: true },
        });

        if (!userVerified)
          throw new Error(
            "Erreur lors de la vérification de l'email de l'utilisateur",
          );
      }

      const pwdChanged = await this.changeCurrentPassword(
        dto.currentPassword,
        dto.newPassword,
        email,
      );

      if (pwdChanged.error) {
        throw new BadRequestException(pwdChanged.message);
      }

      return successResponse('🟢 Votre compte est opérationnel', 200, {
        ...tokens,
        user: userData.data,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Change user's password
   * @param dto - Data transfer object containing current and new passwords
   * @param id - User's ID
   * @returns ApiResponse with success message and status code
   */
  async changePassword(dto: ChangePasswordDto, id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, email: dto.email },
      });
      if (!user) throw new NotFoundException('User not found');

      if (!(await bcrypt.compare(dto.currentPassword, user.password)))
        throw new ForbiddenException('Current password is not correct');

      const pwdChanged = await this.changeCurrentPassword(
        dto.currentPassword,
        dto.newPassword,
        dto.email,
      );

      if (pwdChanged.error) {
        throw new BadRequestException(pwdChanged.message);
      }

      const tokens = await this.generateTokens(user.id);

      const userData = await this.userService.getUser(user.id);

      return successResponse('Mot de passe modifié avec succès', 201, {
        ...tokens,
        user: userData.data,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Generate access and refresh tokens for the user
   * @param userId - User's ID
   * @returns ApiResponse with access and refresh tokens
   */
  async generateTokens(userId: string) {
    try {
      const payload = { sub: userId };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        }),
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '1d',
        }),
      ]);

      const hash = await bcrypt.hash(refreshToken, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hash },
      });

      return successResponse('Tokens générés avec succes', 201, {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Refresh access and refresh tokens using the provided refresh token
   * @param refreshToken - The refresh token to validate and use for generating new tokens
   * @returns ApiResponse with new access and refresh tokens
   */
  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Accès refusé');

      const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!rtMatches) throw new ForbiddenException('Token invalide');

      const { message, statusCode, data } = await this.generateTokens(user.id);

      return successResponse(message, statusCode, data);
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * Handle forgot password functionality
   * @param email - User's email address
   * @returns ApiResponse with success message and reset link
   */
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return;

    const token = await this.jwtService.signAsync(
      { sub: user.id, email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '2m',
      },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: token },
    });

    const resetLink = `https://tonfrontend/reset-password?token=${token}`;

    await this.mailService.sendResetPasswordEmail(user.email, resetLink);

    return successResponse(
      'Lien de reinitialisation envoyé à votre adresse email',
      201,
      { resetLink },
    );
  }

  /**
   * Reset user's password using the provided token and new password
   * @param token - The reset token sent to the user's email
   * @param newPassword - The new password to set for the user
   * @returns ApiResponse with success message
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { refreshToken: token },
      });

      if (!user) {
        throw new ForbiddenException('Token invalide');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          refreshToken: null, // Invalider le token après usage
        },
      });

      return successResponse('Mot de passe reinitialisé avec succès', 201);
    } catch (error) {
      return errorResponse(error);
    }
  }

  private changeCurrentPassword = async (
    currentPassword: string,
    newPassword: string,
    email: string,
  ) => {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      if (!(await bcrypt.compare(currentPassword, user.password)))
        throw new ForbiddenException(
          'Votre mot de passe courant is not correct',
        );

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      if (!user.isEmailVerified) {
        const userVerified = await this.prisma.user.update({
          where: { email: user.email },
          data: { password: hashedPassword, isEmailVerified: true },
        });

        if (!userVerified)
          throw new Error(
            "Erreur lors de la vérification de l'email de l'utilisateur",
          );
      }

      return successResponse('Mot de passe changé avec succès', 200);
    } catch (error) {
      return errorResponse(error);
    }
  };

  /**
   * Logout user by clearing the refresh token
   * @param userId - User's ID
   */
  async logout(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      return successResponse('Déconnexion réussie', 200);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
