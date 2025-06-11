// guards/active-user.guard.ts

import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from './jwt-auth.guard';

@Injectable()
export class ActiveUserGuard extends AuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Utilisateur inactif');
    }

    return true;
  }
}
