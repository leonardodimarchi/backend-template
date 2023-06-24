import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentSchema } from '../schemas/enrollment.schema';
import { EnrollmentRepository } from '@modules/course/domain/repositories/enrollment.repository';
import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { TypeOrmEnrollmentMapper } from '../mappers/typeorm-enrollment.mapper';
import { UUID } from 'crypto';

export class TypeOrmEnrollmentRepository implements EnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentSchema)
    private typeOrmRepository: Repository<EnrollmentSchema>
  ) {}

  async save(enrollment: EnrollmentEntity): Promise<void> {
    await this.typeOrmRepository.save(
      TypeOrmEnrollmentMapper.toSchema(enrollment)
    );
  }

  async getByStudentAndCourse(studentId: UUID, courseId: UUID): Promise<EnrollmentEntity | null> {
    const enrollment = await this.typeOrmRepository.findOne({
      where: {
        course: {
          id: courseId,
        },
        student: {
          id: studentId,
        }
      }
    });

    if (!enrollment) {
      return null;
    }

    return TypeOrmEnrollmentMapper.toEntity(enrollment);
  }
}
