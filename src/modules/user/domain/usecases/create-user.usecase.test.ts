import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { UserEntity } from '../entities/user/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserUseCase } from './create-user.usecase';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { MockUser } from 'test/factories/mock-user';
import { faker } from '@faker-js/faker';
import { DuplicatedEmailError } from '../errors/duplicated-email.error';

describe('CreateUserUseCase', () => {
  let usecase: CreateUserUseCase;
  let repository: InMemoryRepository<UserRepository, UserEntity>;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    usecase = new CreateUserUseCase(repository);
  });

  it('should return a new user', async () => {
    const { createdUser } = await usecase.exec({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'johnpassword',
    });

    expect(createdUser).toBeInstanceOf(UserEntity);
    expect(createdUser.name).toBe('John Doe');
    expect(createdUser.email).toBe('john.doe@email.com');
    expect(createdUser.password).toBe('johnpassword');
  });

  it('should persist the new user', async () => {
    await usecase.exec({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'johnpassword',
    });

    expect(repository.items).toHaveLength(1);
  });

  it('should not be able to create if has a duplicated e-mail', async () => {
    const entity = MockUser.createEntity({
      override: { email: faker.internet.email() },
    });
    repository.save(entity);

    const call = async () => await usecase.exec(entity);

    expect(call).rejects.toThrow(DuplicatedEmailError);
  });
});
