import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { UserEntity } from '../entities/user/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserUseCase } from './create-user.usecase';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { MockUser } from 'test/factories/mock-user';
import { faker } from '@faker-js/faker';
import { DuplicatedEmailError } from '../errors/duplicated-email.error';
import { PasswordEncryptionService } from '../services/password-encryption.service';
import { DeepMocked, createMock } from 'test/utils/create-mock';

describe('CreateUserUseCase', () => {
  let usecase: CreateUserUseCase;
  let repository: InMemoryRepository<UserRepository, UserEntity>;
  let passwordEncryptionService: DeepMocked<PasswordEncryptionService>;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    passwordEncryptionService = createMock<PasswordEncryptionService>();
    usecase = new CreateUserUseCase(repository, passwordEncryptionService);
  });

  it('should return a new user', async () => {
    const encryptedPassword = 'example.encrypted.password';
    passwordEncryptionService.hash.mockResolvedValueOnce(encryptedPassword);

    const { createdUser } = await usecase.exec({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'johnpassword',
    });

    expect(createdUser).toBeInstanceOf(UserEntity);
    expect(createdUser.name).toBe('John Doe');
    expect(createdUser.email).toBe('john.doe@email.com');
    expect(createdUser.password).toBe(encryptedPassword);
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

  it('should persist with encrypted password', async () => {
    const encryptedPassword = 'example.encrypted.password';
    passwordEncryptionService.hash.mockResolvedValueOnce(encryptedPassword);

    await usecase.exec({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    });

    expect(repository.items[0].password).toEqual(encryptedPassword);
  });
});
