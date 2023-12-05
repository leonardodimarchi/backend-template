import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';
import { CourseRepository } from '@modules/course/domain/repositories/course.repository';
import { PaginatedEntitiesOptions } from '@shared/infra/database/interfaces/paginated-entities-options.interface.';
import { PaginatedEntities } from '@shared/infra/database/interfaces/paginated-entities.interface';
import { UUID } from 'crypto';
import { InMemoryRepository } from './in-memory-repository';

export class InMemoryCourseRepository
  implements InMemoryRepository<CourseRepository, CourseEntity>
{
  public items: CourseEntity[] = [];

  async save(course: CourseEntity): Promise<void> {
    this.items.push(course);
  }

  async getById(id: UUID): Promise<CourseEntity | null> {
    const course = this.items.find((c) => c.id === id);

    if (!course) {
      return null;
    }

    return course;
  }

  async getAllPaginated(
    options: PaginatedEntitiesOptions,
  ): Promise<PaginatedEntities<CourseEntity>> {
    const take = options.pageLimit || 10;
    const skip = ((options.page || 1) - 1) * take;

    const entities = this.items.slice(skip, skip + take);
    const totalPageCount = Math.ceil(this.items.length / take);

    return {
      page: options.page || 1,
      pageLimit: take,
      totalPageCount: totalPageCount,
      entities,
    };
  }
}
