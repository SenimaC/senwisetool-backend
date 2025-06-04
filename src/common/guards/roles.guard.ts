import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { Role: true },
    });

    if (!dbUser || dbUser.Role.name !== requiredRole) {
      throw new UnauthorizedException(
        "Vous n'avez pas le droit d'accéder à cette ressource.",
      );
    }

    return true;
  }
}
