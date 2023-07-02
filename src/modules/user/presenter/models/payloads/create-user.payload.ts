import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'

export class CreateUserPayload {
  constructor() {}
  @ApiProperty({ example: 'john.doe@email.com' })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'user.validations.EMAIL_IS_EMAIL',
      ),
    },
  )
  email: string

  @ApiProperty({ example: 'John Doe' })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.NAME_IS_DEFINED',
    ),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.NAME_IS_STRING',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'user.validations.NAME_IS_NOT_EMPTY',
    ),
  })
  name: string

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
  password: string
}
