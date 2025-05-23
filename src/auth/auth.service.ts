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
import { generate6DigitCode } from './auth.utils';

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
    const verificationCode = generate6DigitCode();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        verificationCode,
      },
    });

    await this.mailService.sendVerificationCode(dto.email, verificationCode);

    const token = this.jwtService.sign({ sub: user.id });

    const apiResponse = {
      message: 'Compte créé avec succès.',
      token,
      email: user.email,
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
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    const apiResponse = {
      message: 'Connexion réussie',
      ...tokens,
    };

    return apiResponse;
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);
    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: hash },
    });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Accès refusé');

    const matches = await bcrypt.compare(rt, user.refresh_token);
    if (!matches) throw new ForbiddenException('Refresh token invalide');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
  }
}
