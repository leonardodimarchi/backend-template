import { DomainError } from "@shared/domain/domain.error";

export class InvalidNameError extends Error implements DomainError {
  constructor(name: string) {
    super(`Invalid name: ${name}`);

    this.name = 'InvalidNameError';
  }
}
