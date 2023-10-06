import { faker } from '@faker-js/faker';
import { Right } from '@shared/helpers/either';
import { RequestUserEntity } from './request-user.entity';

describe('RequestUserEntity', () => {
  it('should be able to instantiate', () => {
    const id = faker.string.uuid();
    const email = faker.internet.email();

    const entity = RequestUserEntity.create({
      id,
      email,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as RequestUserEntity).id).toBe(id);
    expect((entity.value as RequestUserEntity).email).toBe(email);
  });
});
