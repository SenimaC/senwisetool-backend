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
import { CompanyService } from 'src/company/company.service';
import { MailService } from 'src/mail/mail.service';
import {
  LoginDto,
  RegisterDto,
  resendEmailVerificationDto,
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
            'Rôle non trouvé. Veuillez spécifier un rôle valide.',
          );
        }
        roleId = defaultRole.id;
      }

      const hashedPassword = await this.sendUserCredential(dto.email);

      await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
          roleId,
        },
      });

      return successResponse(
        'Compte créé avec succès. Les informations de connexion ont été envoyées à votre adresse email.',
        201,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async login(dto: LoginDto): Promise<ApiResponse<any>> {
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
        ...tokens.data,
        user: userData.data,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

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

  async resendEmailVerification(dto: resendEmailVerificationDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

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
      errorResponse(error);
    }
  }

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

  async changePassword(dto: ChangePasswordDto, id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id, email: dto.email },
      });
      if (!user) throw new NotFoundException('User not found');

      if (await bcrypt.compare(dto.currentPassword, user.password))
        throw new ForbiddenException('Current password is not correct');

      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
      if (!user.isEmailVerified) {
        const userVerified = await this.prisma.user.update({
          where: { email: user.email },
          data: { password: hashedPassword, isEmailVerified: true },
        });

        if (!userVerified)
          throw new Error(
            "Erreur lors de la vérification de l'email de l'utilisateur",
          );

        const tokens = await this.generateTokens(user.id);

        const userData = await this.userService.getUser(user.id);

        return successResponse('🟢 Votre compte est opérationnel', 200, {
          ...tokens,
          user: userData.data,
        });
      }
    } catch (error) {
      return errorResponse(error);
    }
  }

  async generateTokens(userId: string) {
    try {
      const payload = { sub: userId };
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        }),
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '1d',
        }),
      ]);

      const hash = await bcrypt.hash(refresh_token, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hash },
      });

      return successResponse('Tokens générés avec succes', 201, {
        access_token,
        refresh_token,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

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

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
