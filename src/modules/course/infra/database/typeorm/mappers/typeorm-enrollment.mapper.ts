import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { TypeOrmUserMapper } from '@modules/user/infra/database/typeorm/mappers/typeorm-user.mapper';
import { EnrollmentSchema } from '../schemas/enrollment.schema';
import { TypeOrmCourseMapper } from './typeorm-course.mapper';

export class TypeOrmEnrollmentMapper {
  static toEntity(schema: EnrollmentSchema): EnrollmentEntity {
    const enrollment = EnrollmentEntity.create(
      {
        courseId: schema.courseId,
        studentId: schema.studentId,
        ...(schema.student && {
          student: TypeOrmUserMapper.toEntity(schema.student),
        }),
        ...(schema.course && {
          course: TypeOrmCourseMapper.toEntity(schema.course),
        }),
      },
      {
        id: schema.id,
        createdAt: schema.createdAt,
        updatedAt: schema.updatedAt,
      },
    );

    if (enrollment.isLeft()) {
      throw new Error(
        `Could not map enrollment schema to entity: ${enrollment.value}`,
      );
    }

    return enrollment.value;
  }

  static toSchema(entity: EnrollmentEntity): EnrollmentSchema {
    return EnrollmentSchema.create({
      id: entity.id,
      studentId: entity.studentId,
      courseId: entity.courseId,
    });
  }
}
