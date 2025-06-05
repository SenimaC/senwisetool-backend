// src/common/guards/permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Pas de permission requise
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.Role?.permissions) {
      console.log(user);

      throw new UnauthorizedException(
        'Accès refusé : pas de permissions trouvées',
      );
    }

    const userPermissions = user.Role.permissions.map((p) => p.name);

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new UnauthorizedException('Accès refusé : permission manquante');
    }

    return true;
  }
}
