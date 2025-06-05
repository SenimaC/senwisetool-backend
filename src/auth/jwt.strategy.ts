import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

// src/auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          Company: { select: { id: true } },
          Role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!user) throw new UnauthorizedException('Utilisateur introuvable');

      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expiré');
      }

      throw new UnauthorizedException('Token invalide');
    }
  }
}
