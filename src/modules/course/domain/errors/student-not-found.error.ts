import { DomainError } from '@shared/domain/errors/domain.error';

export class StudentNotFoundError extends Error implements DomainError {
  public studentId: string;

  constructor(studentId: string) {
    super(`Student not found: ${studentId}`);

    this.studentId = studentId;
    this.name = 'StudentNotFoundError';
  }
}
