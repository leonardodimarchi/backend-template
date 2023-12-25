import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class LoginPayload {
  @ApiProperty({ example: 'john.doe@email.com' })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'auth.validations.EMAIL_IS_DEFINED',
    ),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'auth.validations.EMAIL_IS_EMAIL',
      ),
    },
  )
  email: string;

  @ApiProperty({ example: 'J0hn.Doe@123' })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'auth.validations.PASSWORD_IS_DEFINED',
    ),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'auth.validations.PASSWORD_IS_STRING',
    ),
  })
  password: string;
}
