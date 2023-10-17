import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserDatabaseModule } from '@modules/user/infra/database/user-database.module';
import { Module } from '@nestjs/common';
import { CourseRepository } from './domain/repositories/course.repository';
import { EnrollmentRepository } from './domain/repositories/enrollment.repository';
import { CreateCourseUseCase } from './domain/usecases/create-course.usecase';
import { EnrollStudentInCourseUseCase } from './domain/usecases/enroll-student-in-course.usecase';
import { GetAllCoursesUseCase } from './domain/usecases/get-all-courses.usecase';
import { CourseDatabaseModule } from './infra/database/course-database.module';
import { CourseController } from './presenter/controllers/course.controller';

@Module({
  imports: [UserDatabaseModule, CourseDatabaseModule],
  controllers: [CourseController],
  providers: [
    {
      provide: GetAllCoursesUseCase,
      useFactory: (repository: CourseRepository) => {
        return new GetAllCoursesUseCase(repository);
      },
      inject: [CourseRepository],
    },
    {
      provide: CreateCourseUseCase,
      useFactory: (
        repository: CourseRepository,
        userRepository: UserRepository,
      ) => {
        return new CreateCourseUseCase(repository, userRepository);
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
        );
      },
      inject: [CourseRepository, EnrollmentRepository, UserRepository],
    },
  ],
})
export class CourseModule {}
