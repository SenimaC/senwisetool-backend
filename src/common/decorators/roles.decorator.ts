// roles.decorator.ts

import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ReflectorKey } from '../constants/reflector-key';
import { AuthGuard } from '../guards/jwt-auth.guard';

export const Roles = (...roles: string[]) => {
  return applyDecorators(
    UseGuards(AuthGuard),
    SetMetadata(ReflectorKey.ROLES, roles), // 👈 on passe les permissions
  );
};
