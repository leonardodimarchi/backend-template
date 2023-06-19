import { UseCase } from '@shared/domain/usecase';
import { Either, Left, Right } from '@shared/helpers/either';
import { UUID } from 'crypto';
import { EnrollmentRepository } from '../repositories/enrollment.repository';
import { EnrollmentEntity } from '../entities/enrollment/enrollment.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { StudentNotFoundError } from '../errors/student-not-found.error';
import { CourseRepository } from '../repositories/course.repository';
import { CourseNotFoundError } from '../errors/course-not-found.error';

export interface EnrollUserInCourseUseCaseInput {
  studentId: UUID;
  courseId: UUID;
}

export interface EnrollUserInCourseUseCaseOutput {
  createdEnrollment: EnrollmentEntity;
}

export type EnrollUserInCourseUseCaseErrors = Error;

export class EnrollUserInCourseUseCase
  implements
    UseCase<
      EnrollUserInCourseUseCaseInput,
      EnrollUserInCourseUseCaseOutput,
      EnrollUserInCourseUseCaseErrors
    >
{
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async exec({
    studentId,
    courseId,
  }: EnrollUserInCourseUseCaseInput): Promise<
    Either<EnrollUserInCourseUseCaseErrors, EnrollUserInCourseUseCaseOutput>
  > {
    const course = await this.courseRepository.getById(courseId);

    if (!course) {
      return new Left(new CourseNotFoundError(courseId));
    }

    const student = await this.userRepository.getById(studentId);

    if (!student) {
      return new Left(new StudentNotFoundError(studentId));
    }

    const enrollment = EnrollmentEntity.create({
      course,
      student,
    });

    if (enrollment.isLeft()) {
      return new Left(new Error());
    }

    this.enrollmentRepository.save(enrollment.value);

    return new Right({ createdEnrollment: enrollment.value });
  }
}
