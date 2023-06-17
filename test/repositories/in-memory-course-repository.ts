import { InMemoryRepository } from './in-memory-repository';
import { CourseRepository } from '@modules/course/domain/repositories/course.repository';
import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';

export class InMemoryCourseRepository
  implements InMemoryRepository<CourseRepository, CourseEntity>
{
  public items: CourseEntity[] = [];

  async save(course: CourseEntity): Promise<void> {
    this.items.push(course);
  }
}
