import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { EnrollmentRepository } from '@modules/course/domain/repositories/enrollment.repository';
import { InMemoryRepository } from './in-memory-repository';
import { UUID } from 'crypto';

export class InMemoryEnrollmentRepository
  implements InMemoryRepository<EnrollmentRepository, EnrollmentEntity>
{
  public items: EnrollmentEntity[] = [];

  async save(enrollment: EnrollmentEntity): Promise<void> {
    this.items.push(enrollment);
  }

  async getByStudentAndCourse(studentId: UUID, courseId: UUID): Promise<EnrollmentEntity | null> {
      const enrollment = this.items.find(i => i.course.id === courseId && i.student.id === studentId);

      if (!enrollment) {
        return null;
      }

      return enrollment;
  }
}
