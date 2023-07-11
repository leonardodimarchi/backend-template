import { UUID } from 'crypto';
import { UserEntity } from '../entities/user/user.entity';

export abstract class UserRepository {
  abstract save(user: UserEntity): Promise<void>;
  abstract getById(userId: UUID): Promise<UserEntity | null>;
  abstract getByEmail(email: string): Promise<UserEntity | null>;
  abstract isDuplicatedEmail(email: string): Promise<boolean>;
}
