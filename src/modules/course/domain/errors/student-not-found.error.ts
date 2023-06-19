import { DomainError } from '@shared/domain/domain.error';

export class StudentNotFoundError extends Error implements DomainError {
  constructor(studentId: string) {
    super(`Student not found: ${studentId}`);

    this.name = 'StudentNotFoundError';
  }
}
