import { TypeOrmUserMapper } from '@modules/user/infra/database/typeorm/mappers/typeorm-user.mapper';
import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { EnrollmentSchema } from '../schemas/enrollment.schema';
import { TypeOrmCourseMapper } from './typeorm-course.mapper';

export class TypeOrmEnrollmentMapper {
  static toEntity(schema: EnrollmentSchema): EnrollmentEntity {
    const enrollment = EnrollmentEntity.create(
      {
       course: TypeOrmCourseMapper.toEntity(schema.course),
       student: TypeOrmUserMapper.toEntity(schema.student),
      },
      {
        id: schema.id,
        createdAt: schema.createdAt,
        updatedAt: schema.updatedAt,
      }
    );

    if (enrollment.isLeft()) {
      throw new Error(`Could not map enrollment schema to entity: ${ enrollment.value }`);
    }

    return enrollment.value;
  }

  static toSchema(entity: EnrollmentEntity): EnrollmentSchema {
    return EnrollmentSchema.create({
      id: entity.id,
      student: TypeOrmUserMapper.toSchema(entity.student),
      course: TypeOrmCourseMapper.toSchema(entity.course),
    });
  }
}
