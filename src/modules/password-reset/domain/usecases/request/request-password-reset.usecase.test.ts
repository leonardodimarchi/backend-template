import { faker } from '@faker-js/faker';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { MockUser } from 'test/factories/mock-user';
import { InMemoryPasswordResetRepository } from 'test/repositories/in-memory-password-reset-repository';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { PasswordResetEntity } from '../../entities/password-reset.entity';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';
import {
  RequestPasswordResetUseCase,
  RequestPasswordResetUseCaseOutput,
} from './request-password-reset.usecase';

describe('RequestPasswordResetUseCase', () => {
  let usecase: RequestPasswordResetUseCase;

  let repository: InMemoryRepository<
    PasswordResetRepository,
    PasswordResetEntity
  >;
  let userRepository: InMemoryRepository<UserRepository, UserEntity>;

  beforeEach(() => {
    repository = new InMemoryPasswordResetRepository();
    userRepository = new InMemoryUserRepository();
    usecase = new RequestPasswordResetUseCase(repository, userRepository);
  });

  it('should persist and return a PasswordReset', async () => {
    const email = faker.internet.email();
    const user = MockUser.createEntity({
      override: {
        email,
      },
    });

    userRepository.save(user);

    const result = await usecase.exec({
      email,
    });

    expect(repository.items).toHaveLength(1);
    expect(result.isRight()).toBeTruthy();
    expect(
      (result.value as RequestPasswordResetUseCaseOutput).createdPasswordReset,
    ).toBeInstanceOf(PasswordResetEntity);
  });

  it('should throw a UserNotFoundError if the user was not found', async () => {
    const email = faker.internet.email();

    const result = await usecase.exec({
      email,
    });

    expect(repository.items).toHaveLength(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
