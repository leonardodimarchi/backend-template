import { DomainError } from '@shared/domain/errors/domain.error';

export class IncorrectPasswordError extends Error implements DomainError {
  constructor() {
    super('Incorrect password.');

    this.name = 'IncorrectPasswordError';
  }
}
