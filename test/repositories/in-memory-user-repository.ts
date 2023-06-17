import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { InMemoryRepository } from './in-memory-repository';
import { UUID } from 'crypto';

export class InMemoryUserRepository
  implements InMemoryRepository<UserRepository, UserEntity>
{
  public items: UserEntity[] = [];

  async save(user: UserEntity): Promise<void> {
    this.items.push(user);
  }

  async isDuplicatedEmail(email: string): Promise<boolean> {
    return !!this.items.find((u) => u.email.value === email);
  }

  async getById(userId: UUID): Promise<UserEntity | null> {
    const user = this.items.find((u) => u.id === userId);

    if (!user) {
      return null;
    }

    return user;
  }
}
