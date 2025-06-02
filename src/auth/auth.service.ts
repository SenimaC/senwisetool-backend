import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
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
import { UserResponse } from 'src/common/types/user.type';
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

  async register(dto: RegisterDto): Promise<ApiResponse<any>> {
    const { companyId, ...safeDto } = dto;

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email déjà utilisé');
      }

      const hashedPassword = await this.sendUserCredential(dto.email);

      const existCompany = await this.prisma.company.findUnique({
        where: { id: companyId },
      });

      const newUser = existCompany
        ? await this.prisma.user.create({
            data: {
              ...safeDto,
              password: hashedPassword,
              Company: {
                connect: { id: existCompany.id },
              },
            },
          })
        : await this.prisma.user.create({
            data: {
              ...dto,
              password: hashedPassword,
            },
          });

      return successResponse(
        'Compte créé avec succès. Les informations de connexion ont été envoyées à votre adresse email.',
        201,
        newUser as UserResponse,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user || !(await bcrypt.compare(dto.password, user.password)))
        throw new ForbiddenException('Identifiants invalides');

      const tokens = await this.generateTokens(user.id);

      const userData = await this.userService.getUser(user.id);

      const companyId = await this.companyService.hasCompany(user.id);

      const company = companyId
        ? await this.companyService.getCompany(companyId)
        : null;

      return successResponse('Connexion réussie', 201, {
        ...tokens.data,
        user: userData.data,
        company,
      });
    } catch (error) {
      errorResponse(error);
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
    const payload = { sub: userId };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '5m',
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

    const apiResponse = {
      message: 'Tokens générés avec succes',
      statusCode: 201,
      data: { access_token, refresh_token },
    };

    Logger.log(`tokens générés : ${apiResponse}`);
    return apiResponse;
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

      const apiResponse = await this.generateTokens(user.id);

      return apiResponse;
    } catch (error) {
      const errorMessage = `Token invalide ou expiré : ${error}`;
      Logger.error(errorMessage);
      throw new ForbiddenException(errorMessage);
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

    const apiResponse = {
      message: 'Lien de reinitialisation envoyé à votre adresse email',
      statusCode: 201,
      data: { resetLink },
    };

    Logger.log(apiResponse);
    return apiResponse;
  }

  async resetPassword(token: string, newPassword: string) {
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

    const apiResponse = {
      message: 'Mot de passe reinitialisé avec succès',
      statusCode: 201,
    };

    Logger.log(apiResponse);
    return apiResponse;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
