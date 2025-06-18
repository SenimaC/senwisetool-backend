import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AllPermissions } from 'src/common/constants/permissions.constant';
import { AllRoles } from 'src/common/constants/roles.constant';
import { CanAssignRole } from 'src/common/decorators/can-assign-role.decorator';
import { Secure } from 'src/common/decorators/secure.decorator';
import { ApiResponse } from 'src/common/types/api-response.type';
import { CurrentUser } from 'src/common/types/user.type';
import {
  AuthRegisterDto,
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  resendEmailVerificationDto,
  ValidateAccountDto,
  VerifyEmailDto,
} from 'src/user/user.dto';
import { AuthUser } from '../common/decorators/auth-user.decorator';
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

  @Post('auth-register')
  @Secure('ACTIVE_USER', AllPermissions.CREATE_USER)
  @CanAssignRole()
  @ApiBody({
    description: 'Création de compte avec assignation de rôle contrôlée',
    type: AuthRegisterDto,
  })
  async authRegister(
    @Body() dto: AuthRegisterDto,
    @AuthUser() user: CurrentUser,
  ): Promise<ApiResponse<any>> {
    const { role, ...rest } = dto;

    const roleToAssign = role ?? AllRoles.DG;

    return this.authService.register(
      { firstName: 'user', lastName: 'user', email: rest.email },
      roleToAssign,
      user.companyId,
    );
  }

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

  @Secure('CONNECTED')
  @Patch('validate-account')
  @ApiBody({
    description: 'Validation du compte utilisateur',
    type: ValidateAccountDto,
  })
  validateAccount(@Body() dto: ValidateAccountDto, @AuthUser() user) {
    return this.authService.validateAccount(dto, user.email);
  }

  @Secure('ACTIVE_USER')
  @Patch('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @AuthUser() user) {
    return this.authService.changePassword(dto, user.id);
  }

  @Post('refresh')
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @Secure('CONNECTED')
  logout(@AuthUser() user) {
    return this.authService.logout(user.id);
  }
}
