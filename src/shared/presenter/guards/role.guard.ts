import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUserEntity;

    const i18n = I18nContext.current<I18nTranslations>();

    if (!user || !user.roles) {
      throw new ForbiddenException(i18n?.t('auth.errors.no-authorization'));
    }

    if (!roles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException(i18n?.t('auth.errors.no-authorization'));
    }

    return true;
  }
}
