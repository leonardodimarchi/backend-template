import { DomainError } from '@shared/domain/errors/domain.error';

export class InstructorNotFoundError extends Error implements DomainError {
  public instructorId: string;

  constructor(instructorId: string) {
    super(`Instructor not found: ${instructorId}`);

    this.instructorId = instructorId;
    this.name = 'InstructorNotFoundError';
  }
}
