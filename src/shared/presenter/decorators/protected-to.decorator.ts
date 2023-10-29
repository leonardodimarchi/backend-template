import { AuthJwtGuard } from '@modules/auth/infra/guards/auth-jwt.guard';
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import {
  applyDecorators,
  ForbiddenException,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guards/role.guard';

export const ProtectedTo = (...roles: UserRole[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthJwtGuard, RolesGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({
      type: ForbiddenException,
      status: 403,
      description: 'You are not authorized to access this resource.',
    }),
  );
