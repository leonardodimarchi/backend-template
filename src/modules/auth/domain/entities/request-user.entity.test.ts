import { faker } from '@faker-js/faker';
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import { Right } from '@shared/helpers/either';
import { RequestUserEntity } from './request-user.entity';

describe('RequestUserEntity', () => {
  it('should be able to instantiate', () => {
    const id = faker.string.uuid();
    const email = faker.internet.email();
    const roles = [UserRole.ADMIN];

    const entity = RequestUserEntity.create({
      id,
      email,
      roles,
    });

    expect(entity).toBeInstanceOf(Right);

    expect((entity.value as RequestUserEntity).id).toBe(id);
    expect((entity.value as RequestUserEntity).email).toBe(email);
    expect((entity.value as RequestUserEntity).roles).toEqual(roles);
  });
});
