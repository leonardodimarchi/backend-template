import { DomainError } from '@shared/domain/domain.error';

export class IncorrectOldPasswordError extends Error implements DomainError {
  constructor() {
    super(`Old password confirmation failed`);

    this.name = 'IncorrectOldPasswordError';
  }
}
