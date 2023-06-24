import { DomainError } from '@shared/domain/domain.error';

export class StudentAlreadyEnrolledError extends Error implements DomainError {
  constructor(studentId: string, courseId: string) {
    super(`Enrollment already exists: ${studentId} at ${courseId}`);

    this.name = 'StudentAlreadyEnrolledError';
  }
}
