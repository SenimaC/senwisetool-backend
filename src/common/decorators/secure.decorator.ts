// decorators/secure.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ReflectorKey } from '../constants/reflector-key';
import { ActiveCompanyGuard } from '../guards/active-user-and-company.guard';
import { ActiveUserGuard } from '../guards/active-user.guard';
import { AuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/Permissions.guard';

type SecureLevel = 'CONNECTED' | 'ACTIVE_USER' | 'ACTIVE_COMPANY';

export function Secure(
  level: SecureLevel = 'CONNECTED',
  ...permissions: string[]
) {
  let guard: any = AuthGuard;

  if (level === 'ACTIVE_USER') {
    guard = ActiveUserGuard;
  }

  if (level === 'ACTIVE_COMPANY') {
    guard = ActiveCompanyGuard;
  }

  if (permissions.length > 0) {
    guard = PermissionsGuard;
  }

  return applyDecorators(
    SetMetadata(ReflectorKey.PERMISSIONS, permissions),
    UseGuards(guard),
  );
}
