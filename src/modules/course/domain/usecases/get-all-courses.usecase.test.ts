import { MockCourse } from 'test/factories/mock-course';
import { InMemoryCourseRepository } from 'test/repositories/in-memory-course-repository';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { CourseEntity } from '../entities/course/course.entity';
import { CourseRepository } from '../repositories/course.repository';
import {
  GetAllCoursesUseCase,
  GetAllCoursesUseCaseOutput,
} from './get-all-courses.usecase';

describe('GetAllCoursesUseCase', () => {
  let usecase: GetAllCoursesUseCase;
  let repository: InMemoryRepository<CourseRepository, CourseEntity>;

  beforeEach(() => {
    repository = new InMemoryCourseRepository();
    usecase = new GetAllCoursesUseCase(repository);
  });

  it('should return paginated courses', async () => {
    repository.save(MockCourse.createEntity());
    repository.save(MockCourse.createEntity());

    const result = await usecase.exec({
      paginationOptions: {
        page: 1,
        pageLimit: 2,
      },
    });

    expect(result.isRight()).toBeTruthy();
    expect(
      (result.value as GetAllCoursesUseCaseOutput).paginatedCourses.entities,
    ).toHaveLength(2);
  });
});
