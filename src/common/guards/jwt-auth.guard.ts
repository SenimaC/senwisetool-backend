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
  handleRequest(err, user, info, context: ExecutionContext) {
    if (info instanceof TokenExpiredError) {
      Logger.log(info);
      throw new UnauthorizedException('Token expiré');
    }

    if (err || !user) {
      throw new UnauthorizedException('Token invalide');
    }

    return user;
  }
}
