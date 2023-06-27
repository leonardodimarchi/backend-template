import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSchema } from './typeorm/schemas/course.schema';
import { CourseRepository } from '@modules/course/domain/repositories/course.repository';
import { TypeOrmCourseRepository } from './typeorm/repositories/typeorm-course.repository';
import { EnrollmentRepository } from '@modules/course/domain/repositories/enrollment.repository';
import { TypeOrmEnrollmentRepository } from './typeorm/repositories/typeorm-enrollment.repository';
import { EnrollmentSchema } from './typeorm/schemas/enrollment.schema';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSchema, EnrollmentSchema])],
  providers: [
    { provide: CourseRepository, useClass: TypeOrmCourseRepository },
    { provide: EnrollmentRepository, useClass: TypeOrmEnrollmentRepository }
  ],
  exports: [CourseRepository, EnrollmentRepository],
})
export class CourseDatabaseModule { }
