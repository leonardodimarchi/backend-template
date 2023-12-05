import { PasswordResetEntity } from '@modules/password-reset/domain/entities/password-reset.entity';
import { PasswordResetRepository } from '@modules/password-reset/domain/repositories/password-reset.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'node:crypto';
import { MoreThan, Repository } from 'typeorm';
import { TypeOrmPasswordResetMapper } from '../mappers/password-reset-typeorm.mapper';
import { PasswordResetSchema } from '../schemas/password-reset.schema';

export class TypeOrmPasswordResetRepository implements PasswordResetRepository {
  constructor(
    @InjectRepository(PasswordResetSchema)
    private typeOrmRepository: Repository<PasswordResetSchema>,
  ) {}

  async save(entity: PasswordResetEntity): Promise<void> {
    await this.typeOrmRepository.save(
      TypeOrmPasswordResetMapper.toSchema(entity),
    );
  }

  async getById(id: UUID): Promise<PasswordResetEntity | null> {
    const schema = await this.typeOrmRepository.findOne({
      where: {
        id,
      },
    });

    if (!schema) {
      return null;
    }

    return TypeOrmPasswordResetMapper.toEntity(schema);
  }

  async getValidByUserId(userId: UUID): Promise<PasswordResetEntity | null> {
    const schema = await this.typeOrmRepository.findOne({
      where: {
        userId,
        validUntil: MoreThan(new Date()),
        used: false,
      },
    });

    if (!schema) {
      return null;
    }

    return TypeOrmPasswordResetMapper.toEntity(schema);
  }
}
