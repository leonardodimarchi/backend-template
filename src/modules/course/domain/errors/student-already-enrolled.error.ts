import { DomainError } from '@shared/domain/errors/domain.error';

export class StudentAlreadyEnrolledError extends Error implements DomainError {
  public studentId: string;
  public courseId: string;

  constructor(studentId: string, courseId: string) {
    super(`Enrollment already exists: ${studentId} at ${courseId}`);

    this.studentId = studentId;
    this.courseId = courseId;
    this.name = 'StudentAlreadyEnrolledError';
  }
}
