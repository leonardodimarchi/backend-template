import { Module } from '@nestjs/common'
import { CourseDatabaseModule } from './infra/database/course-database.module'
import { CourseController } from './presenter/controllers/course.controller'
import { CreateCourseUseCase } from './domain/usecases/create-course.usecase'
import { CourseRepository } from './domain/repositories/course.repository'
import { UserRepository } from '@modules/user/domain/repositories/user.repository'
import { EnrollStudentInCourseUseCase } from './domain/usecases/enroll-student-in-course.usecase'
import { EnrollmentRepository } from './domain/repositories/enrollment.repository'
import { UserDatabaseModule } from '@modules/user/infra/database/user-database.module'

@Module({
  imports: [UserDatabaseModule, CourseDatabaseModule],
  controllers: [CourseController],
  providers: [
    {
      provide: CreateCourseUseCase,
      useFactory: (
        repository: CourseRepository,
        userRepository: UserRepository,
      ) => {
        return new CreateCourseUseCase(repository, userRepository)
      },
      inject: [CourseRepository, UserRepository],
    },
    {
      provide: EnrollStudentInCourseUseCase,
      useFactory: (
        repository: CourseRepository,
        enrollmentRepository: EnrollmentRepository,
        userRepository: UserRepository,
      ) => {
        return new EnrollStudentInCourseUseCase(
          enrollmentRepository,
          userRepository,
          repository,
        )
      },
      inject: [CourseRepository, EnrollmentRepository, UserRepository],
    },
  ],
})
export class CourseModule {}
