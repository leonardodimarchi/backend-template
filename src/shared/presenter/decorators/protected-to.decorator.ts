// protected-to.decorator.ts
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import {
  applyDecorators,
  ForbiddenException,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../guards/role.guard';

export const ProtectedTo = (...roles: UserRole[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiForbiddenResponse({ type: ForbiddenException }),
  );
