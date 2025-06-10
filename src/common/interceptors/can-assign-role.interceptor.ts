// interceptors/can-assign-role.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignableRolesMap } from '../constants/roles.constant';

@Injectable()
export class CanAssignRoleInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const roleIdToAssign = request.body?.role;

    if (!user) throw new UnauthorizedException('Utilisateur non connecté');

    if (!roleIdToAssign) return next.handle(); // aucun rôle à vérifier

    return from(
      this.prisma.role.findUnique({ where: { id: roleIdToAssign } }),
    ).pipe(
      switchMap((role) => {
        if (!role) {
          throw new ForbiddenException('Rôle à assigner introuvable');
        }

        const allowedRoleNames = AssignableRolesMap[user.role] || [];

        if (!allowedRoleNames.includes(role.name)) {
          throw new ForbiddenException(
            `Le rôle ${user.role} ne peut pas assigner le rôle ${role.name}`,
          );
        }

        return next.handle();
      }),
    );
  }
}
