// roles.guard.ts
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!roles) {
      return true; // No specific roles required, so access is granted.
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming you have user information in your request object.

    if (!user || !user.role) {
      throw new ForbiddenException(
        'Você não possui autorização para acessar esse recurso.',
      ); // Access is denied if user or role is not defined.
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        'Você não possui autorização para acessar esse recurso.',
      ); // Access is denied if the user's role doesn't match the allowed roles.
    }

    return true; // Access is granted if the user's role matches the allowed roles.
  }
}
