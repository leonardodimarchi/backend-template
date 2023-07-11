import { faker } from '@faker-js/faker';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { MockUser } from 'test/factories/mock-user';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { IncorrectPasswordError } from '../errors/incorrect-password.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { LoginUseCase, LoginUseCaseOutput } from './login.usecase';

describe('LoginUseCase', () => {
  let usecase: LoginUseCase;
  let repository: InMemoryRepository<UserRepository, UserEntity>;
  let passwordEncryptionService: DeepMocked<PasswordEncryptionService>;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    passwordEncryptionService = createMock<PasswordEncryptionService>();
    usecase = new LoginUseCase(repository, passwordEncryptionService);
  });

  it('should return the user if the repository returns and the password is correct', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const createdUser = MockUser.createEntity({
      override: {
        email,
        password,
      },
    });

    repository.save(createdUser);
    passwordEncryptionService.compare.mockResolvedValueOnce(true);

    const result = await usecase.exec({ email, password });

    expect(result.isRight()).toBeTruthy();
    expect((result.value as LoginUseCaseOutput).user).toEqual(createdUser);
  });

  it("should return user not found if the repository don't find a user with the given email", async () => {
    const result = await usecase.exec({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should return incorrect password error if the given password is incorrect', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const createdUser = MockUser.createEntity({
      override: {
        email,
        password,
      },
    });

    repository.save(createdUser);
    passwordEncryptionService.compare.mockResolvedValueOnce(false);

    const result = await usecase.exec({ email, password });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(IncorrectPasswordError);
  });
});
