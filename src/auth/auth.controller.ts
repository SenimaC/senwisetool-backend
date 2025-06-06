import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/types/api-response.type';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  resendEmailVerificationDto,
  VerifyEmailDto,
} from 'src/user/user.dto';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    description: 'Creation de compte via un utilisateur',
    type: RegisterDto,
  })
  register(@Body() dto: RegisterDto): Promise<ApiResponse<any>> {
    return this.authService.register(dto);
  }

  // @UseGuards(AuthGuard) // @TODO  Refactoriser pour utiliser un guard spécifique
  // @Post('auth-register')
  // @ApiBody({
  //   description: 'Creation de compte via un owner ou le lead developer',
  //   type: AuthRegisterDto,
  // })
  // registerWithScript(
  //   @Body() dto: AuthRegisterDto,
  //   @AuthUser() user,
  // ): Promise<ApiResponse<any>> {
  //   const allowedRoles = [UserRole.Owner, UserRole.LeadDeveloper];
  //   if (!allowedRoles.includes(user.role)) {
  //     throw new UnauthorizedException(
  //     'Seul un owner ou un lead developer peut créer un compte via ce script',
  //     );
  //   }

  //   const { role, ...rest } = dto;
  //   const userRole = role ?? UserRole.DG;

  //   if (role && !allowedRoles.includes(user.role)) {
  //     throw new UnauthorizedException(
  //     `Vous n'avez pas la permission d'attribuer le rôle spécifié: ${role}`,
  //     );
  //   }

  //   return this.authService.register(rest, userRole);
  // }

  @Post('login')
  @ApiBody({
    description: 'Connexion at an account',
    type: LoginDto,
  })
  login(@Body() dto: LoginDto): Promise<ApiResponse<any>> {
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

  @UseGuards(AuthGuard)
  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @AuthUser() user) {
    return this.authService.changePassword(dto, user.id);
  }

  @Post('refresh')
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@AuthUser() user) {
    return this.authService.logout(user.id);
  }
}
