import { Right } from '@shared/helpers/either';
import { CourseEntity } from './course.entity';
import { MockUser } from 'test/factories/mock-user';

describe('CourseEntity', () => {
  it('should be able to instantiate', () => {
    const title = 'Course title';
    const description = 'Course description';
    const instructor = MockUser.createEntity();
    const price = 50;

    const entity = CourseEntity.create({
      title,
      description,
      price,
      instructor,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as CourseEntity).title).toEqual(title);
    expect((entity.value as CourseEntity).description).toEqual(description);
    expect((entity.value as CourseEntity).instructor).toEqual(instructor);
    expect((entity.value as CourseEntity).price).toEqual(price);
  });
});
