import { UseCase } from '@shared/domain/usecase'
import { Either, Left, Right } from '@shared/helpers/either'
import { UUID } from 'crypto'
import { EnrollmentRepository } from '../repositories/enrollment.repository'
import { EnrollmentEntity } from '../entities/enrollment/enrollment.entity'
import { UserRepository } from '@modules/user/domain/repositories/user.repository'
import { StudentNotFoundError } from '../errors/student-not-found.error'
import { CourseRepository } from '../repositories/course.repository'
import { CourseNotFoundError } from '../errors/course-not-found.error'
import { StudentAlreadyEnrolledError } from '../errors/student-already-enrolled.error'

export interface EnrollStudentInCourseUseCaseInput {
  studentId: UUID
  courseId: UUID
}

export interface EnrollStudentInCourseUseCaseOutput {
  createdEnrollment: EnrollmentEntity
}

export type EnrollStudentInCourseUseCaseErrors =
  | CourseNotFoundError
  | StudentNotFoundError
  | StudentAlreadyEnrolledError
  | Error

export class EnrollStudentInCourseUseCase
  implements
    UseCase<
      EnrollStudentInCourseUseCaseInput,
      EnrollStudentInCourseUseCaseOutput,
      EnrollStudentInCourseUseCaseErrors
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
  }: EnrollStudentInCourseUseCaseInput): Promise<
    Either<
      EnrollStudentInCourseUseCaseErrors,
      EnrollStudentInCourseUseCaseOutput
    >
  > {
    const course = await this.courseRepository.getById(courseId)

    if (!course) {
      return new Left(new CourseNotFoundError(courseId))
    }

    const student = await this.userRepository.getById(studentId)

    if (!student) {
      return new Left(new StudentNotFoundError(studentId))
    }

    const enrollmentAlreadyExists = await this.enrollmentRepository
      .getByStudentAndCourse(studentId, courseId)
      .then((r) => !!r)

    if (enrollmentAlreadyExists) {
      return new Left(new StudentAlreadyEnrolledError(studentId, courseId))
    }

    const enrollment = EnrollmentEntity.create({
      course,
      student,
    })

    if (enrollment.isLeft()) {
      return new Left(enrollment.value)
    }

    this.enrollmentRepository.save(enrollment.value)

    return new Right({ createdEnrollment: enrollment.value })
  }
}
