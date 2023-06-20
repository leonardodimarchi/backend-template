import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSchema } from './typeorm/schemas/course.schema';
import { CourseRepository } from '@modules/course/domain/repositories/course.repository';
import { TypeOrmCourseRepository } from './typeorm/repositories/typeorm-course.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSchema])],
  providers: [{ provide: CourseRepository, useClass: TypeOrmCourseRepository }],
  exports: [CourseRepository],
})
export class CourseDatabaseModule {}
