import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { InMemoryRepository } from './in-memory-repository';

export class InMemoryUserRepository
  implements InMemoryRepository<UserRepository, UserEntity>
{
  public items: UserEntity[] = [];

  async save(user: UserEntity): Promise<void> {
    this.items.push(user);
  }
}
