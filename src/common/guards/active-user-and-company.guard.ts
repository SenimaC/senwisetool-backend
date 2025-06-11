// guards/active-company.guard.ts
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ActiveUserGuard } from './active-user.guard';

@Injectable()
export class ActiveCompanyGuard extends ActiveUserGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.company || user.company.status !== 'ACTIVE') {
      throw new ForbiddenException('Compagnie inactive');
    }

    return true;
  }
}
