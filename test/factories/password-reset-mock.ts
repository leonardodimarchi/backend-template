import { faker } from '@faker-js/faker';
import {
  PasswordResetEntity,
  PasswordResetEntityCreateProps,
} from '@modules/password-reset/domain/entities/password-reset.entity';
import { BaseEntityProps } from '@shared/domain/base.entity';
import { UUID } from 'crypto';

interface CreateMockPasswordResetOverrideProps {
  override?: Partial<PasswordResetEntityCreateProps>;
  basePropsOverride?: Partial<BaseEntityProps>;
}

export class MockPasswordReset {
  static createEntity({
    override,
    basePropsOverride,
  }: CreateMockPasswordResetOverrideProps = {}): PasswordResetEntity {
    const overrideProps = override ?? {};
    const entityPropsOverride = basePropsOverride ?? {};

    const entity = PasswordResetEntity.create(
      {
        userId: faker.string.uuid() as UUID,
        ...overrideProps,
      },
      {
        id: faker.string.uuid() as UUID,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        ...entityPropsOverride,
      },
    );

    if (entity.isLeft()) {
      throw new Error(`Mock PasswordReset error: ${entity.value}`);
    }

    return entity.value;
  }
}
