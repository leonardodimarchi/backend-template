import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { LoginUseCase } from '@modules/auth/domain/usecases/login.usecase';
import { UserNotFoundError } from '@modules/auth/domain/errors/user-not-found.error';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { IncorrectPasswordError } from '@modules/auth/domain/errors/incorrect-password.error';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const result = await this.loginUseCase.exec({
      email,
      password,
    });

    if (result.isRight()) {
      return result.value.user;
    }

    const i18n = I18nContext.current<I18nTranslations>();

    if (result.value instanceof UserNotFoundError) {
      throw new NotFoundException(i18n?.t('auth.errors.user-not-found'));
    }

    if (result.value instanceof IncorrectPasswordError) {
      throw new UnauthorizedException(
        i18n?.t('auth.errors.incorrect-password'),
      );
    }

    throw new InternalServerErrorException();
  }
}
