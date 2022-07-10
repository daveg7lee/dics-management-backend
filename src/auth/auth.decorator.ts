import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AllowedRoles, Role } from './role.decorator';

export function Auth(roles: AllowedRoles[]) {
  return applyDecorators(Role(roles), UseGuards(AuthGuard));
}
