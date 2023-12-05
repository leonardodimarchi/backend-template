import { DomainError } from '@shared/domain/domain.error';

export class PasswordResetNotFoundError extends Error implements DomainError {
  constructor() {
    super(`PasswordReset not found`);

    this.name = 'PasswordResetNotFoundError';
  }
}
