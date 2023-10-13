import { faker } from '@faker-js/faker';
import { Right } from '@shared/helpers/either';
import { UUID } from 'crypto';
import { MockCourse } from 'test/factories/mock-course';
import { MockUser } from 'test/factories/mock-user';
import { EnrollmentEntity } from './enrollment.entity';

describe('EnrollmentEntity', () => {
  it('should be able to instantiate', () => {
    const studentId = faker.string.uuid() as UUID;
    const courseId = faker.string.uuid() as UUID;
    const student = MockUser.createEntity();
    const course = MockCourse.createEntity();

    const entity = EnrollmentEntity.create({
      studentId,
      courseId,
      student,
      course,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as EnrollmentEntity).studentId).toEqual(studentId);
    expect((entity.value as EnrollmentEntity).courseId).toEqual(courseId);
    expect((entity.value as EnrollmentEntity).student).toEqual(student);
    expect((entity.value as EnrollmentEntity).course).toEqual(course);
  });
});
