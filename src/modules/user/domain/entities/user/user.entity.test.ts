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

    expect(entity.name).toBe(name);
    expect(entity.email).toBe(email);
    expect(entity.password).toBe(password);
  });
});
