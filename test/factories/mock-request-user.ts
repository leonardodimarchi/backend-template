import { faker } from '@faker-js/faker';
import {
  RequestUserEntity,
  RequestUserEntityCreateProps,
} from '@modules/auth/domain/entities/request-user.entity';
import { UUID } from 'crypto';

interface CreateMockRequestUserOverrideProps {
  override?: Partial<RequestUserEntityCreateProps>;
}

export class MockRequestUser {
  static createEntity({
    override,
  }: CreateMockRequestUserOverrideProps = {}): RequestUserEntity {
    const overrideProps = override ?? {};

    const user = RequestUserEntity.create({
      id: faker.string.uuid() as UUID,
      email: faker.internet.email(),
      ...overrideProps,
    });

    if (user.isLeft()) {
      throw new Error(`Mock request user error: ${user.value}`);
    }

    return user.value;
  }
}
