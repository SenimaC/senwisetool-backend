import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import {
  JwtUser,
  UserRegisterSource,
  UserRole,
} from 'src/common/types/user.type';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  resendEmailVerificationDto,
  VerifyEmailDto,
} from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    description: 'Creation of user account',
    type: RegisterDto,
  })
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { source, role, ...rest } = dto;
    switch (dto.source) {
      case UserRegisterSource.SCRIPT:
        // Authentifier via un header secret
        const secret = req.headers['x-internal-secret'];
        if (secret !== process.env.JWT_SECRET)
          throw new UnauthorizedException('Accès refusé.');

        return this.authService.register({ ...rest, role });

      case UserRegisterSource.DEVELOPER:
        const user = req['user'];
        if (!user || user.role !== 'DEVELOPER')
          throw new ForbiddenException(
            'Seuls les développeurs peuvent effectuer cette action.',
          );

        return this.authService.register({ ...rest, role });
      default:
        return this.authService.register({ ...rest, role: UserRole.DG });
    }
  }

  @Post('login')
  @ApiBody({
    description: 'Connexion at an account',
    type: LoginDto,
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('resend-email-verification')
  resendEmailVerification(@Body() dto: resendEmailVerificationDto) {
    return this.authService.resendEmailVerification(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @AuthUser() user: JwtUser) {
    return this.authService.changePassword(dto, user.id);
  }

  @Post('refresh')
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@AuthUser() user: JwtUser) {
    return this.authService.logout(user.id);
  }
}
