import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
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
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUserEntity;

    if (!user || !user.roles) {
      throw new ForbiddenException(
        'Você não possui autorização para acessar esse recurso.',
      );
    }

    if (!roles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException(
        'Você não possui autorização para acessar esse recurso.',
      );
    }

    return true;
  }
}
