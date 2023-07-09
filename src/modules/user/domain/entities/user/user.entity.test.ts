import { Right } from '@shared/helpers/either';
import { UserRole } from './user-role.enum';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('should be able to instantiate', () => {
    const name = 'User name';
    const email = 'user@email.com';
    const password = 'password';
    const role = [UserRole.STUDENT];

    const entity = UserEntity.create({
      name,
      email,
      password,
      roles: role,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as UserEntity).name.value).toBe(name);
    expect((entity.value as UserEntity).email.value).toBe(email);
    expect((entity.value as UserEntity).password).toBe(password);
    expect((entity.value as UserEntity).roles).toBe(role);
  });
});
