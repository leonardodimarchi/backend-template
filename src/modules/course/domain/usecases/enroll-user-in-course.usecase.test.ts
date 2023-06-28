import { faker } from '@faker-js/faker';
import { EnrollStudentInCourseUseCase } from './enroll-user-in-course.usecase';
import { UUID } from 'crypto';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { EnrollmentEntity } from '../entities/enrollment/enrollment.entity';
import { EnrollmentRepository } from '../repositories/enrollment.repository';
import { InMemoryEnrollmentRepository } from 'test/repositories/in-memory-enrollment-repository';
import { StudentNotFoundError } from '../errors/student-not-found.error';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { MockUser } from 'test/factories/mock-user';
import { CourseRepository } from '../repositories/course.repository';
import { CourseEntity } from '../entities/course/course.entity';
import { InMemoryCourseRepository } from 'test/repositories/in-memory-course-repository';
import { MockCourse } from 'test/factories/mock-course';
import { CourseNotFoundError } from '../errors/course-not-found.error';
import { StudentAlreadyEnrolledError } from '../errors/student-already-enrolled.error';

describe('EnrollStudentInCourseUseCase', () => {
  let usecase: EnrollStudentInCourseUseCase;
  let enrollmentRespository: InMemoryRepository<
    EnrollmentRepository,
    EnrollmentEntity
  >;
  let userRepository: InMemoryRepository<UserRepository, UserEntity>;
  let courseRepository: InMemoryRepository<CourseRepository, CourseEntity>;

  beforeEach(() => {
    enrollmentRespository = new InMemoryEnrollmentRepository();
    userRepository = new InMemoryUserRepository();
    courseRepository = new InMemoryCourseRepository();
    usecase = new EnrollStudentInCourseUseCase(
      enrollmentRespository,
      userRepository,
      courseRepository
    );
  });

  const createStudentWithId = (id: UUID) => {
    userRepository.save(MockUser.createEntity({ basePropsOverride: { id } }));
  };

  const createCourseWithId = (id: UUID) => {
    courseRepository.save(
      MockCourse.createEntity({ basePropsOverride: { id } })
    );
  };

  it('should persist the enrollment with the correct student and course', async () => {
    const studentId = faker.string.uuid() as UUID;
    const courseId = faker.string.uuid() as UUID;

    createStudentWithId(studentId);
    createCourseWithId(courseId);

    await usecase.exec({
      studentId,
      courseId,
    });

    expect(enrollmentRespository.items).toHaveLength(1);
    expect(enrollmentRespository.items[0].student.id).toEqual(studentId);
    expect(enrollmentRespository.items[0].course.id).toEqual(courseId);
  });

  it('should return an error if the student does not exists', async () => {
    const studentId = faker.string.uuid() as UUID;
    const courseId = faker.string.uuid() as UUID;

    createCourseWithId(courseId);

    const result = await usecase.exec({
      studentId,
      courseId,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(StudentNotFoundError);
  });

  it('should return an error if the course does not exists', async () => {
    const studentId = faker.string.uuid() as UUID;
    const courseId = faker.string.uuid() as UUID;

    createStudentWithId(studentId);

    const result = await usecase.exec({
      studentId,
      courseId,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(CourseNotFoundError);
  });

  it('should return an error if the the user is already enrolled at the course', async () => {
    const studentId = faker.string.uuid() as UUID;
    const courseId = faker.string.uuid() as UUID;

    createStudentWithId(studentId);
    createCourseWithId(courseId);

    await usecase.exec({
      studentId,
      courseId,
    });

    const result = await usecase.exec({
      studentId,
      courseId,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(StudentAlreadyEnrolledError);
  });
});
