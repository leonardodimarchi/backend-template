import { Right } from '@shared/helpers/either';
import { EnrollmentEntity } from './enrollment.entity';
import { MockUser } from 'test/factories/mock-user';
import { MockCourse } from 'test/factories/mock-course';

describe('EnrollmentEntity', () => {
  it('should be able to instantiate', () => {
    const student = MockUser.createEntity();
    const course = MockCourse.createEntity();

    const entity = EnrollmentEntity.create({
      student,
      course,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as EnrollmentEntity).student).toEqual(student);
    expect((entity.value as EnrollmentEntity).course).toEqual(course);
  });
});
