import { UUID } from 'node:crypto';
import { PasswordResetEntity } from '../entities/password-reset.entity';

export abstract class PasswordResetRepository {
  abstract save(entity: PasswordResetEntity): Promise<void>;
  abstract getById(id: UUID): Promise<PasswordResetEntity | null>;
  abstract getValidByUserId(userId: UUID): Promise<PasswordResetEntity | null>;
}
