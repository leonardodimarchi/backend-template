import { faker } from '@faker-js/faker';
import {
  CourseEntity,
  CourseEntityCreateProps,
} from '@modules/course/domain/entities/course/course.entity';
import { CreateCoursePayload } from '@modules/course/presenter/models/payloads/create-course.payload';
import { CourseViewModel } from '@modules/course/presenter/models/view-models/course.view-model';
import { BaseEntityProps } from '@shared/domain/entities/base.entity';
import { UUID } from 'crypto';
import { MockUser } from './mock-user';

interface CreateMockCourseOverrideProps {
  override?: Partial<CourseEntityCreateProps>;
  basePropsOverride?: Partial<BaseEntityProps>;
}

export class MockCourse {
  static createEntity({
    override,
    basePropsOverride,
  }: CreateMockCourseOverrideProps = {}): CourseEntity {
    const overrideProps = override ?? {};
    const entityPropsOverride = basePropsOverride ?? {};

    const course = CourseEntity.create(
      {
        title: faker.lorem.text(),
        description: faker.lorem.paragraph(),
        price: +faker.commerce.price(),
        instructor: MockUser.createEntity(),
        ...overrideProps,
      },
      {
        id: faker.string.uuid() as UUID,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        ...entityPropsOverride,
      },
    );

    if (course.isLeft()) {
      throw new Error(`Mock Course error: ${course.value}`);
    }

    return course.value;
  }

  static createViewModel(
    override: CreateMockCourseOverrideProps = {},
  ): CourseViewModel {
    const entity = MockCourse.createEntity(override);

    return new CourseViewModel(entity);
  }

  static createPayload(): CreateCoursePayload {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      price: +faker.commerce.price(),
      instructorId: faker.string.uuid() as UUID,
    };
  }
}
