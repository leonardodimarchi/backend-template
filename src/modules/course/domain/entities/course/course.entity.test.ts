import { Right } from '@shared/helpers/either';
import { CourseEntity } from './course.entity';

describe('CourseEntity', () => {
  it('should be able to instantiate', () => {
    const title = 'Course title';
    const description = 'Course description';

    const entity = CourseEntity.create({
      title,
      description,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as CourseEntity).title).toBe(title);
    expect((entity.value as CourseEntity).description).toBe(description);
  });
});
