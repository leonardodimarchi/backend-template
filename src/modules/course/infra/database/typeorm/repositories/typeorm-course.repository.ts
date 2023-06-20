import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { CourseRepository } from '@modules/course/domain/repositories/course.repository';
import { CourseSchema } from '../schemas/course.schema';
import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';
import { TypeOrmCourseMapper } from '../mappers/typeorm-course.mapper';

export class TypeOrmCourseRepository implements CourseRepository {
  constructor(
    @InjectRepository(CourseSchema)
    private typeOrmRepository: Repository<CourseSchema>
  ) {}
  async save(course: CourseEntity): Promise<void> {
    await this.typeOrmRepository.save(TypeOrmCourseMapper.toSchema(course));
  }

  async getById(id: UUID): Promise<CourseEntity | null> {
    const course = await this.typeOrmRepository.findOne({
      where: {
        id,
      }
    });

    if (!course) {
      return null;
    }

    return TypeOrmCourseMapper.toEntity(course);
  }
}
