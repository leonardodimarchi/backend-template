import { DomainError } from '@shared/domain/domain.error';

export class IncorrectPasswordError extends Error implements DomainError {
  constructor() {
    super('Incorrect password.');

    this.name = 'IncorrectPasswordError';
  }
}
