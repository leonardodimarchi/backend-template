import { PasswordResetEntity } from '@modules/password-reset/domain/entities/password-reset.entity';
import { PasswordResetRepository } from '@modules/password-reset/domain/repositories/password-reset.repository';
import { UUID } from 'crypto';
import { InMemoryRepository } from './in-memory-repository';

export class InMemoryPasswordResetRepository
  implements InMemoryRepository<PasswordResetRepository, PasswordResetEntity>
{
  public items: PasswordResetEntity[] = [];

  async save(course: PasswordResetEntity): Promise<void> {
    this.items.push(course);
  }

  async getById(id: UUID): Promise<PasswordResetEntity | null> {
    const entity = this.items.find((c) => c.id === id);

    if (!entity) {
      return null;
    }

    return entity;
  }

  async getValidByUserId(userId: UUID): Promise<PasswordResetEntity | null> {
    const entity = this.items.find((i) => {
      return i.userId === userId && !i.used && i.validUntil > new Date();
    });

    if (!entity) {
      return null;
    }

    return entity;
  }

  async getValidByCode(code: string): Promise<PasswordResetEntity | null> {
    const entity = this.items.find((i) => {
      return (
        i.code.toLowerCase() === code.toLowerCase() &&
        !i.used &&
        i.validUntil > new Date()
      );
    });

    if (!entity) {
      return null;
    }

    return entity;
  }
}
