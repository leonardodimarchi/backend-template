import { DomainError } from '@shared/domain/errors/domain.error';
import { UUID } from 'crypto';

export class UserNotFoundError extends Error implements DomainError {
  constructor(id?: UUID) {
    super(`User not found${id ? ': ' + id : ''}`);

    this.name = 'UserNotFoundError';
  }
}
