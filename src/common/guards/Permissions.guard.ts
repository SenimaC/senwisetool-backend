import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        Role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const userPermissions =
      userWithPermissions?.Role?.permissions.map((p) => p.name) || [];

    const hasAccess = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );
    if (!hasAccess) {
      throw new ForbiddenException('Accès refusé : permission manquante.');
    }

    return true;
  }
}
