import { Right } from '@shared/helpers/either';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('should be able to instantiate', () => {
    const name = 'User name';
    const email = 'user@email.com';
    const password = 'password';

    const entity = UserEntity.create({
      name,
      email,
      password,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as UserEntity).name).toBe(name);
    expect((entity.value as UserEntity).email).toBe(email);
    expect((entity.value as UserEntity).password).toBe(password);
  });
});
