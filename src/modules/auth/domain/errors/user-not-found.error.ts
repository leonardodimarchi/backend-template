import { DomainError } from '@shared/domain/errors/domain.error';

export class UserNotFoundError extends Error implements DomainError {
  constructor(email: string) {
    super(`User not found with e-mail: ${email}`);

    this.name = 'UserNotFoundError';
  }
}
