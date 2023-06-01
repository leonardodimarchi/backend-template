import { en, faker } from '@faker-js/faker';
import {
  UserEntity,
  UserEntityCreateProps,
} from '@modules/user/domain/entities/user/user.entity';
import { Email } from '@modules/user/domain/entities/user/value-objects/email';
import { CreateUserPayload } from '@modules/user/presenter/models/payloads/create-user.payload';
import { UserViewModel } from '@modules/user/presenter/models/view-models/user.view-model';
import { BaseEntityProps } from '@shared/domain/base.entity';
import { UUID } from 'crypto';

interface CreateMockUserOverrideProps {
  override?: Partial<UserEntityCreateProps>;
  basePropsOverride?: Partial<BaseEntityProps>;
}

export class MockUser {
  static createEntity({
    override,
    basePropsOverride,
  }: CreateMockUserOverrideProps = {}): UserEntity {
    const overrideProps = override ?? {};
    const entityPropsOverride = basePropsOverride ?? {};

    const email = Email.create(faker.internet.email());

    if (email.isLeft()) {
      throw new Error(`Mock user email error: ${ email.value }`)
    }

    const user = UserEntity.create(
      {
        email: email.value.value,
        name: faker.person.fullName(),
        password: faker.internet.password(),
        ...overrideProps,
      },
      {
        id: faker.string.uuid() as UUID,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        ...entityPropsOverride,
      }
    );

    if (user.isLeft()) {
      throw new Error(`Mock user error: ${ user.value }`)
    }

    return user.value;
  }

  static createViewModel(override: CreateMockUserOverrideProps = {}): UserViewModel {
    const entity = MockUser.createEntity(override);

    return new UserViewModel(entity);
  }

  static createPayload(): CreateUserPayload {
    return {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    }
  } 
}
