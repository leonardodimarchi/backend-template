import { faker } from '@faker-js/faker';
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import { EnvService } from '@shared/infra/env/interfaces/env.service';
import { UUID } from 'crypto';
import { createMock } from 'test/utils/create-mock';
import { JwtStrategy } from './auth-jwt.strategy';

describe('AuthJwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy(createMock<EnvService>());
  });

  it('should return a request user entity', () => {
    const id = faker.string.uuid() as UUID;
    const email = faker.internet.email();
    const roles = [UserRole.ADMIN];

    const result = strategy.validate({
      sub: id,
      roles,
      email,
    });

    expect(result.id).toBe(id);
    expect(result.email).toBe(email);
  });
});
