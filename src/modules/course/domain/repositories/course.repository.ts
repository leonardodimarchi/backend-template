import { PaginatedEntitiesOptions } from '@shared/infra/database/interfaces/paginated-entities-options.interface.';
import { PaginatedEntities } from '@shared/infra/database/interfaces/paginated-entities.interface';
import { UUID } from 'crypto';
import { CourseEntity } from '../entities/course/course.entity';

export abstract class CourseRepository {
  abstract save(user: CourseEntity): Promise<void>;
  abstract getById(id: UUID): Promise<CourseEntity | null>;
  abstract getAllPaginated(
    options: PaginatedEntitiesOptions,
  ): Promise<PaginatedEntities<CourseEntity>>;
}
