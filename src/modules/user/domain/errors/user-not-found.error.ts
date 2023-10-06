import { DomainError } from '@shared/domain/domain.error';
import { UUID } from 'crypto';

export class UserNotFoundError extends Error implements DomainError {
  constructor(id: UUID) {
    super(`User not found: ${id}`);

    this.name = 'UserNotFoundError';
  }
}
