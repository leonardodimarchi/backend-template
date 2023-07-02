import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'
import { CreateCourseUseCase } from '@modules/course/domain/usecases/create-course.usecase'
import { CourseViewModel } from '../models/view-models/course.view-model'
import { CreateCoursePayload } from '../models/payloads/create-course.payload'
import { InvalidMoneyError } from '@modules/course/domain/errors/invalid-money.error'
import { InstructorNotFoundError } from '@modules/course/domain/errors/instructor-not-found.error'
import { EnrollmentViewModel } from '../models/view-models/enrollment.view-model'
import { EnrollStudentPayload } from '../models/payloads/enroll-student.payload'
import { EnrollStudentInCourseUseCase } from '@modules/course/domain/usecases/enroll-student-in-course.usecase'
import { CourseNotFoundError } from '@modules/course/domain/errors/course-not-found.error'
import { StudentNotFoundError } from '@modules/course/domain/errors/student-not-found.error'
import { StudentAlreadyEnrolledError } from '@modules/course/domain/errors/student-already-enrolled.error'

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly enrollStudentInCourseUseCase: EnrollStudentInCourseUseCase,
  ) {}

  @ApiOperation({ summary: 'Creates a new course' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: true })
  @ApiResponse({ status: HttpStatus.CREATED, type: CourseViewModel })
  @Post()
  async create(
    @Body() payload: CreateCoursePayload,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<CourseViewModel> {
    const { title, description, price, instructorId } = payload

    const result = await this.createCourseUseCase.exec({
      title,
      description,
      price,
      instructorId,
    })

    if (result.isRight()) {
      return new CourseViewModel(result.value.createdCourse)
    }

    if (result.value instanceof InvalidMoneyError) {
      throw new BadRequestException(i18n.t('course.errors.invalid-money'), {
        cause: result.value,
      })
    }

    if (result.value instanceof InstructorNotFoundError) {
      throw new NotFoundException(
        i18n.t('course.errors.instructor-not-found', {
          args: { instructorId: result.value.instructorId },
        }),
        {
          cause: result.value,
        },
      )
    }

    throw new InternalServerErrorException()
  }

  @ApiOperation({ summary: 'Enroll the student at a course' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: true })
  @ApiResponse({ status: HttpStatus.CREATED, type: EnrollmentViewModel })
  @Post()
  async enrollStudent(
    @Body() payload: EnrollStudentPayload,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<EnrollmentViewModel> {
    const { studentId, courseId } = payload

    const result = await this.enrollStudentInCourseUseCase.exec({
      courseId,
      studentId,
    })

    if (result.isRight()) {
      return new EnrollmentViewModel(result.value.createdEnrollment)
    }

    if (result.value instanceof CourseNotFoundError) {
      throw new NotFoundException(
        i18n.t('course.errors.course-not-found', {
          args: { courseId: result.value.courseId },
        }),
        {
          cause: result.value,
        },
      )
    }

    if (result.value instanceof StudentNotFoundError) {
      throw new NotFoundException(
        i18n.t('course.errors.student-not-found', {
          args: { studentId: result.value.studentId },
        }),
        {
          cause: result.value,
        },
      )
    }

    if (result.value instanceof StudentAlreadyEnrolledError) {
      throw new ConflictException(
        i18n.t('course.errors.student-already-enrolled', {
          args: {
            studentId: result.value.studentId,
            courseId: result.value.courseId,
          },
        }),
        {
          cause: result.value,
        },
      )
    }

    throw new InternalServerErrorException()
  }
}
