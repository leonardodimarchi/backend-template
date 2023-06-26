import {
    BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateCourseUseCase } from '@modules/course/domain/usecases/create-course.usecase';
import { CourseViewModel } from '../models/view-models/course.view-model';
import { CreateCoursePayload } from '../models/payloads/create-course.payload';
import { InvalidMoneyError } from '@modules/course/domain/errors/invalid-money.error';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly createCourseUseCase: CreateCourseUseCase) {}

  @ApiOperation({ summary: 'Creates a new course' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: true })
  @ApiResponse({ status: HttpStatus.CREATED, type: CourseViewModel })
  @Post()
  async create(@Body() payload: CreateCoursePayload, @I18n() i18n: I18nContext<I18nTranslations>): Promise<CourseViewModel> {
    const {
      title,
      description,
      price,
      instructorId,
     } = payload;

    const result = await this.createCourseUseCase.exec({
      title,
      description,
      price,
      instructorId,
    });

    if (result.isRight()) {
      return new CourseViewModel(result.value.createdCourse);
    }

    if (result.value instanceof InvalidMoneyError) {
      throw new BadRequestException(i18n.t('course.errors.invalid-money'), {
        cause: result.value,
      });
    }

    throw new InternalServerErrorException();
  }
}
