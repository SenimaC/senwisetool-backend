import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/types/api-response.type';
import { UserRole } from 'src/common/types/user.type';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  RegisterWithScriptDto,
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
    description: 'Creation of default user account',
    type: RegisterDto,
  })
  register(@Body() dto: RegisterDto): Promise<ApiResponse<any>> {
    return this.authService.register(dto);
  }

  @Post('register-with-script')
  @ApiBody({
    description: 'Creation of user account from script',
    type: RegisterDto,
  })
  registerWithScript(
    @Body() dto: RegisterWithScriptDto,
    @Req() req: Request,
  ): Promise<ApiResponse<any>> {
    // Authentifier via un header secret
    const secret = req.headers['x-internal-secret'];
    if (secret !== process.env.JWT_SECRET)
      throw new UnauthorizedException('Accès refusé.');

    const { role, ...rest } = dto;
    const userRole = role ?? UserRole.DG;
    return this.authService.register(rest, userRole);
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
  changePassword(@Body() dto: ChangePasswordDto, @AuthUser() user) {
    return this.authService.changePassword(dto, user.id);
  }

  @Post('refresh')
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@AuthUser() user) {
    return this.authService.logout(user.id);
  }
}
