import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from '../schemas/user.schema';
import { Repository } from 'typeorm';
import { TypeOrmUserMapper } from '../mappers/typeorm-user.mapper';
import { UUID } from 'crypto';

export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private typeOrmRepository: Repository<UserSchema>
  ) {}
  async save(user: UserEntity): Promise<void> {
    await this.typeOrmRepository.save(TypeOrmUserMapper.toSchema(user));
  }

  async isDuplicatedEmail(email: string): Promise<boolean> {
    const user = await this.typeOrmRepository.findOneBy({ email });

    return !!user;
  }

  async getById(userId: UUID): Promise<UserEntity | null> {
    const user = await this.typeOrmRepository.findOne({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return null;
    }

    return TypeOrmUserMapper.toEntity(user);
  }
}
