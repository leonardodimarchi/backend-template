import { DomainError } from '@shared/domain/errors/domain.error';

export class DuplicatedEmailError extends Error implements DomainError {
  constructor(email: string) {
    super(`Duplicated e-mail: ${email}`);

    this.name = 'DuplicatedEmailError';
  }
}
