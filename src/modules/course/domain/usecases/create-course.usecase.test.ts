import { faker } from '@faker-js/faker';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UUID } from 'crypto';
import { MockUser } from 'test/factories/mock-user';
import { InMemoryCourseRepository } from 'test/repositories/in-memory-course-repository';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { CourseEntity } from '../entities/course/course.entity';
import { InstructorNotFoundError } from '../errors/instructor-not-found.error';
import { CourseRepository } from '../repositories/course.repository';
import {
  CreateCourseUseCase,
  CreateCourseUseCaseOutput,
} from './create-course.usecase';

describe('CreateCourseUseCase', () => {
  let usecase: CreateCourseUseCase;
  let repository: InMemoryRepository<CourseRepository, CourseEntity>;
  let userRepository: InMemoryRepository<UserRepository, UserEntity>;

  beforeEach(() => {
    repository = new InMemoryCourseRepository();
    userRepository = new InMemoryUserRepository();
    usecase = new CreateCourseUseCase(repository, userRepository);
  });

  const createInstructorWithId = (instructorId: UUID) => {
    userRepository.save(
      MockUser.createEntity({ basePropsOverride: { id: instructorId } }),
    );
  };

  it('should return a course', async () => {
    const instructorId = faker.string.uuid() as UUID;
    createInstructorWithId(instructorId);

    const result = await usecase.exec({
      title: 'My course',
      description: 'My course description',
      instructorId,
      price: 49.99,
    });

    expect(result.isRight()).toBeTruthy();
    expect(
      (result.value as CreateCourseUseCaseOutput).createdCourse,
    ).toBeInstanceOf(CourseEntity);
  });

  it('should setup the instructor at the course', async () => {
    const instructorId = faker.string.uuid() as UUID;
    createInstructorWithId(instructorId);

    const result = await usecase.exec({
      title: 'My course',
      description: 'My course description',
      instructorId,
      price: 49.99,
    });

    expect(
      (result.value as CreateCourseUseCaseOutput).createdCourse.instructorId,
    ).toEqual(instructorId);
  });

  it('should persist the course', async () => {
    const instructorId = faker.string.uuid() as UUID;
    createInstructorWithId(instructorId);

    await usecase.exec({
      title: 'My course',
      description: 'My course description',
      instructorId,
      price: 49.99,
    });

    expect(repository.items).toHaveLength(1);
  });

  it('should return an error if the instructor is not found', async () => {
    const result = await usecase.exec({
      title: 'My course',
      description: 'My course description',
      instructorId: faker.string.uuid() as UUID,
      price: 49.99,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InstructorNotFoundError);
  });
});
