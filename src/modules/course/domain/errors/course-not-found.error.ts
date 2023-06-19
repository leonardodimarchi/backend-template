import { DomainError } from '@shared/domain/domain.error';

export class CourseNotFoundError extends Error implements DomainError {
  constructor(courseId: string) {
    super(`Course not found: ${courseId}`);

    this.name = 'CourseNotFoundError';
  }
}
