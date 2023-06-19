import { faker } from "@faker-js/faker";
import { CourseEntity, CourseEntityCreateProps } from "@modules/course/domain/entities/course/course.entity";
import { BaseEntityProps } from "@shared/domain/base.entity";
import { MockUser } from "./mock-user";
import { UUID } from "crypto";

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
      }
    );

    if (course.isLeft()) {
      throw new Error(`Mock Course error: ${ course.value }`)
    }

    return course.value;
  }
}
