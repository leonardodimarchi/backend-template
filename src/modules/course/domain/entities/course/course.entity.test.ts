import { faker } from '@faker-js/faker';
import { Right } from '@shared/helpers/either';
import { UUID } from 'crypto';
import { MockUser } from 'test/factories/mock-user';
import { CourseEntity } from './course.entity';

describe('CourseEntity', () => {
  it('should be able to instantiate', () => {
    const title = 'Course title';
    const description = 'Course description';
    const instructorId = faker.string.uuid() as UUID;
    const instructor = MockUser.createEntity();
    const price = 50;

    const entity = CourseEntity.create({
      title,
      description,
      price,
      instructorId,
      instructor,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as CourseEntity).title).toEqual(title);
    expect((entity.value as CourseEntity).description).toEqual(description);
    expect((entity.value as CourseEntity).instructorId).toEqual(instructorId);
    expect((entity.value as CourseEntity).instructor).toEqual(instructor);
    expect((entity.value as CourseEntity).price.amount).toEqual(price);
  });
});
