import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
  handleRequest<T = RequestUserEntity>(err: Error, user: T | false): T {
    const i18n = I18nContext.current<I18nTranslations>();

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(i18n?.t('auth.errors.no-authorization'))
      );
    }

    return user;
  }
}
