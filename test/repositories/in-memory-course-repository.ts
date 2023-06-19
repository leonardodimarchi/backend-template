import { InMemoryRepository } from './in-memory-repository';
import { CourseRepository } from '@modules/course/domain/repositories/course.repository';
import { CourseEntity } from '@modules/course/domain/entities/course/course.entity';
import { UUID } from 'crypto';

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
}
