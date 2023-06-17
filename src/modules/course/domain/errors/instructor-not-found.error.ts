import { DomainError } from '@shared/domain/domain.error';

export class InstructorNotFoundError extends Error implements DomainError {
  constructor(instructorId: string) {
    super(`Instructor not found: ${instructorId}`);

    this.name = 'InstructorNotFoundError';
  }
}
