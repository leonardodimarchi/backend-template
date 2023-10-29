import { AuthJwtGuard } from '@modules/auth/infra/guards/auth-jwt.guard';
import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';
import { CourseNotFoundError } from '@modules/course/domain/errors/course-not-found.error';
import { InstructorNotFoundError } from '@modules/course/domain/errors/instructor-not-found.error';
import { InvalidMoneyError } from '@modules/course/domain/errors/invalid-money.error';
import { StudentAlreadyEnrolledError } from '@modules/course/domain/errors/student-already-enrolled.error';
import { StudentNotFoundError } from '@modules/course/domain/errors/student-not-found.error';
import { CreateCourseUseCase } from '@modules/course/domain/usecases/create-course.usecase';
import { EnrollStudentInCourseUseCase } from '@modules/course/domain/usecases/enroll-student-in-course.usecase';
import { GetAllCoursesUseCase } from '@modules/course/domain/usecases/get-all-courses.usecase';
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProtectedTo } from '@shared/presenter/decorators/protected-to.decorator';
import { PaginatedQueryParams } from '@shared/presenter/models/paginated-query-params';
import { PaginatedViewModel } from '@shared/presenter/models/paginated.view-model.';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateCoursePayload } from '../models/payloads/create-course.payload';
import { EnrollStudentPayload } from '../models/payloads/enroll-student.payload';
import { CourseViewModel } from '../models/view-models/course.view-model';
import { EnrollmentViewModel } from '../models/view-models/enrollment.view-model';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly enrollStudentInCourseUseCase: EnrollStudentInCourseUseCase,
    private readonly getAllCoursesUseCase: GetAllCoursesUseCase,
  ) {}

  @Get()
  @ProtectedTo(UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Get all courses (paginated)' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  @ApiQuery({
    type: PaginatedQueryParams,
    required: true,
    description: 'Pagination options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedViewModel<CourseEntity, CourseViewModel>,
  })
  async getAll(
    @Query() queryParams: PaginatedQueryParams,
  ): Promise<PaginatedViewModel<CourseEntity, CourseViewModel>> {
    const result = await this.getAllCoursesUseCase.exec({
      paginationOptions: {
        page: queryParams.page,
        pageLimit: queryParams.pageLimit,
      },
    });

    if (result.isRight()) {
      return new PaginatedViewModel(
        result.value.paginatedCourses,
        CourseViewModel,
      );
    }

    throw new InternalServerErrorException();
  }

  @Post()
  @ProtectedTo(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
  @ApiOperation({ summary: 'Creates a new course' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  @ApiBody({
    required: true,
    type: CreateCoursePayload,
    description: 'Course information',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CourseViewModel })
  async create(
    @Body() payload: CreateCoursePayload,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<CourseViewModel> {
    const { title, description, price, instructorId } = payload;

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

    if (result.value instanceof InstructorNotFoundError) {
      throw new NotFoundException(
        i18n.t('course.errors.instructor-not-found', {
          args: { instructorId: result.value.instructorId },
        }),
        {
          cause: result.value,
        },
      );
    }

    throw new InternalServerErrorException();
  }

  @Post('enroll')
  @UseGuards(AuthJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll a student at a course' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  @ApiResponse({ status: HttpStatus.CREATED, type: EnrollmentViewModel })
  async enrollStudent(
    @Body() payload: EnrollStudentPayload,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<EnrollmentViewModel> {
    const { studentId, courseId } = payload;

    const result = await this.enrollStudentInCourseUseCase.exec({
      courseId,
      studentId,
    });

    if (result.isRight()) {
      return new EnrollmentViewModel(result.value.createdEnrollment);
    }

    if (result.value instanceof CourseNotFoundError) {
      throw new NotFoundException(
        i18n.t('course.errors.course-not-found', {
          args: { courseId: result.value.courseId },
        }),
        {
          cause: result.value,
        },
      );
    }

    if (result.value instanceof StudentNotFoundError) {
      throw new NotFoundException(
        i18n.t('course.errors.student-not-found', {
          args: { studentId: result.value.studentId },
        }),
        {
          cause: result.value,
        },
      );
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
      );
    }

    throw new InternalServerErrorException();
  }
}
