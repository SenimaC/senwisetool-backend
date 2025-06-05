// roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Pas de rôle requis → accès libre
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.Role?.name) {
      throw new UnauthorizedException(
        'Utilisateur non authentifié ou rôle non trouvé',
      );
    }

    const userRole = user.Role.name;

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Accès interdit : rôle "${userRole}" requis`,
      );
    }

    return true;
  }
}
