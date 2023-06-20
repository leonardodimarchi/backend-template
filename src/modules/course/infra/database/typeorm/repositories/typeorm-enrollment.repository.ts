import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentSchema } from '../schemas/enrollment.schema';
import { EnrollmentRepository } from '@modules/course/domain/repositories/enrollment.repository';
import { EnrollmentEntity } from '@modules/course/domain/entities/enrollment/enrollment.entity';
import { TypeOrmEnrollmentMapper } from '../mappers/typeorm-enrollment.mapper';

export class TypeOrmEnrollmentRepository implements EnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentSchema)
    private typeOrmRepository: Repository<EnrollmentSchema>
  ) {}
  async save(enrollment: EnrollmentEntity): Promise<void> {
    await this.typeOrmRepository.save(TypeOrmEnrollmentMapper.toSchema(enrollment));
  }
}
