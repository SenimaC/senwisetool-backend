import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ReflectorKey } from '../constants/reflector-key';
import { AuthGuard } from '../guards/jwt-auth.guard';

type SecureLevel = 'CONNECTED' | 'ACTIVE_USER' | 'ACTIVE_COMPANY';

export function Secure(
  level: SecureLevel = 'CONNECTED',
  ...permissions: string[]
) {
  return applyDecorators(
    UseGuards(AuthGuard),
    SetMetadata(ReflectorKey.SECURE_LEVEL, level), // 👈 on passe le niveau
    SetMetadata(ReflectorKey.PERMISSIONS, permissions), // 👈 on passe les permissions
  );
}
