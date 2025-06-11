import { Injectable } from '@nestjs/common';
import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuards extends JwtAuthGuard('jwt') {}
