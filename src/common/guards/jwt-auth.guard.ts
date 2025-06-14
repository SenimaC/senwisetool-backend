import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';
import { SourceSecure } from '@prisma/client';
import { TokenExpiredError } from 'jsonwebtoken';
import { ReflectorKey } from '../constants/reflector-key';

@Injectable()
export class AuthGuard extends JwtAuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (info instanceof TokenExpiredError) {
      Logger.warn('Token expiré', info);
      throw new UnauthorizedException('Token expiré');
    }

    if (err || !user) {
      Logger.warn('Token invalide', err || info);
      throw new UnauthorizedException('Token invalide');
    }

    const secureLevel = this.reflector.getAllAndOverride<string>(
      ReflectorKey.SECURE_LEVEL,
      [context.getHandler(), context.getClass()],
    );

    // 👇 Vérifications liées au niveau de sécurité
    if (secureLevel === 'ACTIVE_USER' && user.status !== 'ACTIVE') {
      throw new ForbiddenException('Utilisateur inactif');
    }

    if (secureLevel === 'ACTIVE_COMPANY') {
      if (user.status !== 'ACTIVE') {
        throw new ForbiddenException('Utilisateur inactif');
      }
      if (!user.company || user.company.status !== 'ACTIVE') {
        throw new ForbiddenException('Compagnie inactive');
      }
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      ReflectorKey.PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions?.length) {
      const userPermissions = (user.Role.permissions || []).filter(
        (perm) => perm.from === SourceSecure.SYSTEM,
      );

      const hasAll = requiredPermissions.every((perm) =>
        userPermissions.some((userPerm) => userPerm.name === perm),
      );

      if (!hasAll) {
        throw new ForbiddenException('Permissions insuffisantes');
      }
    }

    return user;
  }
}
