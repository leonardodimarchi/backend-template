import { DomainError } from '@shared/domain/domain.error';

export class IncorrectPasswordResetCodeError
  extends Error
  implements DomainError
{
  constructor() {
    super(`Password reset code confirmation failed`);

    this.name = 'IncorrectPasswordResetCodeError';
  }
}
