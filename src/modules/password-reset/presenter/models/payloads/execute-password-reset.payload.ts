import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class ExecutePasswordResetPayload {
  @ApiProperty({ example: 'J0hn.Doe@123' })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.PASSWORD_IS_DEFINED',
    ),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.PASSWORD_IS_STRING',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.PASSWORD_IS_NOT_EMPTY',
    ),
  })
  oldPassword: string;

  @ApiProperty({ example: 'J0hn.Doe@123' })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.PASSWORD_IS_DEFINED',
    ),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.PASSWORD_IS_STRING',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.PASSWORD_IS_NOT_EMPTY',
    ),
  })
  newPassword: string;
}
