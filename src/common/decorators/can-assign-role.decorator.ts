// decorators/can-assign-role.decorator.ts
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CanAssignRoleInterceptor } from '../interceptors/can-assign-role.interceptor';

export function CanAssignRole() {
  return applyDecorators(UseInterceptors(CanAssignRoleInterceptor));
}
