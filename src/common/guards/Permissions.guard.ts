// guards/permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReflectorKey } from '../constants/reflector-key';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.get<string[]>(
        ReflectorKey.PERMISSIONS,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const userPermissions: string[] = user?.permissions || [];

    const hasPermission = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        "Vous n'avez pas les permissions nécessaires",
      );
    }

    return true;
  }
}
