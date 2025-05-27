import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { LoginDto, RegisterDto } from 'src/user/user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // const verificationCode = generate6DigitCode();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    await this.resendEmailVerificationCode(user.email);

    const tokens = await this.generateTokens(user.id, user.email);

    const apiResponse = {
      message:
        'Compte créé avec succès. Un code de verification à été envoyé à votre email',
      statusCode: 201,
      data: {
        tokens,
        email: user.email,
      },
    };

    Logger.log(apiResponse);
    return apiResponse;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new ForbiddenException('Identifiants invalides');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const apiResponse = {
      message: 'Connexion réussie',
      ...tokens,
    };

    return apiResponse;
  }

  async resendEmailVerificationCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.mailService.sendVerificationCode(email, code); // À faire
    await this.prisma.user.update({
      where: { email },
      data: {
        emailVerificationCode: code,
        emailVerificationExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) throw new ForbiddenException('Utilisateur non trouvé');

    if (user.isEmailVerified) return { message: 'Email déjà vérifié' };

    if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
      throw new ForbiddenException('Code de vérification invalide');
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      throw new ForbiddenException('Code expiré');
    }

    await this.prisma.user.update({
      where: { email: email },
      data: {
        isEmailVerified: true,
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
    });

    const apiResponse = {
      message: 'Email vérifié avec succès.',
      statusCode: 201,
    };

    Logger.log(apiResponse);
    return apiResponse;
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
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

    return { access_token, refresh_token };
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

      const tokens = await this.generateTokens(user.id, user.email);

      return tokens;
    } catch (error) {
      throw new ForbiddenException(`Token invalide ou expiré : ${error}`);
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
        expiresIn: '5m',
      },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: token },
    });

    const resetLink = `https://tonfrontend/reset-password?token=${token}`;

    await this.mailService.sendResetPasswordEmail(user.email, resetLink);
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
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
