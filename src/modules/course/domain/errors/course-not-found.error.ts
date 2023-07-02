import { DomainError } from '@shared/domain/domain.error'

export class CourseNotFoundError extends Error implements DomainError {
  public courseId: string

  constructor(courseId: string) {
    super(`Course not found: ${courseId}`)

    this.courseId = courseId
    this.name = 'CourseNotFoundError'
  }
}
