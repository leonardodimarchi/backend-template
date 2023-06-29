import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/generated/i18n.generated";

export class EnrollStudentPayload {
  @ApiProperty({ example: '<UUID>' })
  @IsDefined({ message: i18nValidationMessage<I18nTranslations>('course.validations.STUDENT_IS_DEFINED') })
  @IsUUID(4, { message: i18nValidationMessage<I18nTranslations>('course.validations.STUDENT_IS_UUID') })
  studentId: UUID;

  @ApiProperty({ example: '<UUID>' })
  @IsDefined({ message: i18nValidationMessage<I18nTranslations>('course.validations.STUDENT_IS_DEFINED') })
  @IsUUID(4, { message: i18nValidationMessage<I18nTranslations>('course.validations.STUDENT_IS_UUID') })
  courseId: UUID;
}
