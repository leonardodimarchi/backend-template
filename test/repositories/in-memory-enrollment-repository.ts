import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { EnrollmentRepository } from '@modules/course/domain/repositories/enrollment.repository';
import { InMemoryRepository } from './in-memory-repository';

export class InMemoryEnrollmentRepository
  implements InMemoryRepository<EnrollmentRepository, EnrollmentEntity>
{
  public items: EnrollmentEntity[] = [];

  async save(enrollment: EnrollmentEntity): Promise<void> {
    this.items.push(enrollment);
  }
}
