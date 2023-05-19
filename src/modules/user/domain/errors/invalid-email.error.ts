import { DomainError } from "@shared/domain/domain.error";

export class InvalidEmailError extends Error implements DomainError {
  constructor(email: string) {
    super(`Invalid email: ${email}`);

    this.name = 'InvalidEmailError';
  }
}
