import { faker } from "@faker-js/faker";
import { EnrollmentEntity, EnrollmentEntityCreateProps } from "@modules/course/domain/entities/enrollment/enrollment.entity";
import { EnrollStudentPayload } from "@modules/course/presenter/models/payloads/enroll-student.payload";
import { EnrollmentViewModel } from "@modules/course/presenter/models/view-models/enrollment.view-model";
import { BaseEntityProps } from "@shared/domain/base.entity";
import { UUID } from "crypto";
import { MockCourse } from "./mock-course";
import { MockUser } from "./mock-user";

interface CreateMockEnrollmentOverrideProps {
  override?: Partial<EnrollmentEntityCreateProps>;
  basePropsOverride?: Partial<BaseEntityProps>;
}

export class MockEnrollment {
  static createEntity({
    override,
    basePropsOverride,
  }: CreateMockEnrollmentOverrideProps = {}): EnrollmentEntity {
    const overrideProps = override ?? {};
    const entityPropsOverride = basePropsOverride ?? {};

    const enrollment = EnrollmentEntity.create(
      {
        course: MockCourse.createEntity(),
        student: MockUser.createEntity(),
        ...overrideProps,
      },
      {
        id: faker.string.uuid() as UUID,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        ...entityPropsOverride,
      }
    );

    if (enrollment.isLeft()) {
      throw new Error(`Mock Enrollment error: ${ enrollment.value }`)
    }

    return enrollment.value;
  }


  static createViewModel(override: CreateMockEnrollmentOverrideProps = {}): EnrollmentViewModel {
    const entity = MockEnrollment.createEntity(override);

    return new EnrollmentViewModel(entity);
  }

  static createPayload(): EnrollStudentPayload {
    return {
      courseId: faker.string.uuid() as UUID,
      studentId: faker.string.uuid() as UUID,
    }
  }
}
