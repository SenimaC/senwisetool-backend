// guards/auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard extends JwtAuthGuard('jwt') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (info instanceof TokenExpiredError) {
      Logger.warn('Token expiré', info);
      throw new UnauthorizedException('Token expiré');
    }

    if (err || !user) {
      Logger.warn('Token invalide', err || info);
      throw new UnauthorizedException('Token invalide');
    }

    return user;
  }
}
