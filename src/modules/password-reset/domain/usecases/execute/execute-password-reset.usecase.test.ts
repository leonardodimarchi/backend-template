import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { MockRequestUser } from 'test/factories/mock-request-user';
import { MockPasswordReset } from 'test/factories/password-reset-mock';
import { InMemoryPasswordResetRepository } from 'test/repositories/in-memory-password-reset-repository';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { PasswordResetEntity } from '../../entities/password-reset.entity';
import { IncorrectPasswordResetCodeError } from '../../errors/incorrect-password-reset-code.error';
import { PasswordResetNotFoundError } from '../../errors/password-reset-not-found.error';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';
import { ExecutePasswordResetUseCase } from './execute-password-reset.usecase';

describe('ExecutePasswordResetUseCase', () => {
  let usecase: ExecutePasswordResetUseCase;
  let repository: InMemoryRepository<
    PasswordResetRepository,
    PasswordResetEntity
  >;
  let userRepository: InMemoryRepository<UserRepository, UserEntity>;
  let passwordEncryptionService: DeepMocked<PasswordEncryptionService>;

  beforeEach(() => {
    repository = new InMemoryPasswordResetRepository();
    userRepository = new InMemoryUserRepository();
    passwordEncryptionService = createMock<PasswordEncryptionService>();

    usecase = new ExecutePasswordResetUseCase(
      repository,
      userRepository,
      passwordEncryptionService,
    );
  });

  it('should return a PasswordResetNotFoundError if a valid reset was not found', async () => {
    const requestUser = MockRequestUser.createEntity();

    const result = await usecase.exec({
      requestUser,
      code: 'AbC4dEf1',
      oldPassword: '',
      newPassword: '',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(PasswordResetNotFoundError);
  });

  it('should return an IncorrectPasswordResetCodeError if the provided code does not match', async () => {
    const requestUser = MockRequestUser.createEntity();
    const passwordReset = MockPasswordReset.createEntity({
      override: {
        userId: requestUser.id,
      },
    });

    repository.save(passwordReset);

    const result = await usecase.exec({
      requestUser,
      code: passwordReset.code,
      oldPassword: '',
      newPassword: '',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(IncorrectPasswordResetCodeError);
  });
});
