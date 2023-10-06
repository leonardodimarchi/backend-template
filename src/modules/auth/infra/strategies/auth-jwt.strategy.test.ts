import { faker } from '@faker-js/faker';
import { JwtStrategy } from './auth-jwt.strategy';

describe('AuthJwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should return a request user entity', () => {
    const id = faker.number.int();
    const email = faker.internet.email();

    const result = strategy.validate({
      sub: id,
      email,
    });

    expect(result.id).toBe(id);
    expect(result.email).toBe(email);
  });
});
