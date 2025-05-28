import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtUser } from 'src/types/user.type';
import {
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  VerifyEmailDto,
} from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-email-verification')
  resendEmailVerification(@AuthUser() user: JwtUser) {
    return this.authService.resendEmailVerification(user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  verifyEmail(@AuthUser() user: JwtUser, @Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(user.email, dto.code);
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

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // getProfile(@Req() req) {
  //   return req.user;
  // }
}
