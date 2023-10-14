import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';
import { CourseRepository } from '@modules/course/domain/repositories/course.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedEntitiesOptions } from '@shared/infra/database/interfaces/paginated-entities-options.interface.';
import { PaginatedEntities } from '@shared/infra/database/interfaces/paginated-entities.interface';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { TypeOrmCourseMapper } from '../mappers/typeorm-course.mapper';
import { CourseSchema } from '../schemas/course.schema';

export class TypeOrmCourseRepository implements CourseRepository {
  constructor(
    @InjectRepository(CourseSchema)
    private typeOrmRepository: Repository<CourseSchema>,
  ) {}
  async save(course: CourseEntity): Promise<void> {
    await this.typeOrmRepository.save(TypeOrmCourseMapper.toSchema(course));
  }

  async getById(id: UUID): Promise<CourseEntity | null> {
    const course = await this.typeOrmRepository.findOne({
      where: {
        id,
      },
    });

    if (!course) {
      return null;
    }

    return TypeOrmCourseMapper.toEntity(course);
  }

  async getAllPaginated(
    options: PaginatedEntitiesOptions,
  ): Promise<PaginatedEntities<CourseEntity>> {
    const page = options.page || 1;
    const take = options.pageLimit || 10;
    const skip = (page - 1) * take;

    const [entities, totalCount] = await this.typeOrmRepository.findAndCount({
      skip,
      take,
    });

    return {
      page,
      pageLimit: take,
      totalPageCount: Math.ceil(totalCount / take),
      entities: entities.map(TypeOrmCourseMapper.toEntity),
    };
  }
}
