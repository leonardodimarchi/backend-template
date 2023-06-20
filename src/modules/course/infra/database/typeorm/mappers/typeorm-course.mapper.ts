import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';
import { CourseSchema } from '../schemas/course.schema';
import { TypeOrmUserMapper } from '@modules/user/infra/database/typeorm/mappers/typeorm-user.mapper';

export class TypeOrmCourseMapper {
  static toEntity(schema: CourseSchema): CourseEntity {
    const course = CourseEntity.create(
      {
       title: schema.title,
       description: schema.description,
       price: schema.price,
       instructor: TypeOrmUserMapper.toEntity(schema.instructor),
      },
      {
        id: schema.id,
        createdAt: schema.createdAt,
        updatedAt: schema.updatedAt,
      }
    );

    if (course.isLeft()) {
      throw new Error(`Could not map course schema to entity: ${ course.value }`);
    }

    return course.value;
  }

  static toSchema(entity: CourseEntity): CourseSchema {
    return CourseSchema.create({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      price: entity.price.amount,
      instructor: TypeOrmUserMapper.toSchema(entity.instructor),
    });
  }
}
