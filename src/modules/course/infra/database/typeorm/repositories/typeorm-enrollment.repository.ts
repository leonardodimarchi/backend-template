import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { EnrollmentRepository } from '@modules/course/domain/repositories/enrollment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { TypeOrmEnrollmentMapper } from '../mappers/typeorm-enrollment.mapper';
import { EnrollmentSchema } from '../schemas/enrollment.schema';

export class TypeOrmEnrollmentRepository implements EnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentSchema)
    private typeOrmRepository: Repository<EnrollmentSchema>,
  ) {}

  async save(enrollment: EnrollmentEntity): Promise<void> {
    await this.typeOrmRepository.save(
      TypeOrmEnrollmentMapper.toSchema(enrollment),
    );
  }

  async getByStudentAndCourse(
    studentId: UUID,
    courseId: UUID,
  ): Promise<EnrollmentEntity | null> {
    const enrollment = await this.typeOrmRepository.findOne({
      where: {
        studentId,
        courseId,
      },
    });

    if (!enrollment) {
      return null;
    }

    return TypeOrmEnrollmentMapper.toEntity(enrollment);
  }
}
