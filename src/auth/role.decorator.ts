import { SetMetadata } from '@nestjs/common';
import { UserType } from '@prisma/client';

export type AllowedRoles = keyof typeof UserType | 'Any';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
