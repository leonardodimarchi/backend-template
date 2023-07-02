import { ApiProperty } from '@nestjs/swagger'
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'
import { UUID } from 'crypto'
import { i18nValidationMessage } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'

export class CreateCoursePayload {
  @ApiProperty({ example: 'Flutter with Clean Architecture and TDD' })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.TITLE_IS_DEFINED',
    ),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.TITLE_IS_STRING',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.TITLE_IS_NOT_EMPTY',
    ),
  })
  title: string

  @ApiProperty({
    example:
      'Within this course, we will learn how to build good flutter applications',
  })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.DESCRIPTION_IS_DEFINED',
    ),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.DESCRIPTION_IS_STRING',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.DESCRIPTION_IS_NOT_EMPTY',
    ),
  })
  description: string

  @ApiProperty({ example: 49.99 })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.PRICE_IS_DEFINED',
    ),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'course.validations.PRICE_IS_NUMBER',
      ),
    },
  )
  @Min(0, {
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.PRICE_MIN',
    ),
  })
  price: number

  @ApiProperty({ example: '<UUID>' })
  @IsDefined({
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.INSTRUCTOR_IS_DEFINED',
    ),
  })
  @IsUUID(4, {
    message: i18nValidationMessage<I18nTranslations>(
      'course.validations.INSTRUCTOR_IS_UUID',
    ),
  })
  instructorId: UUID
}
