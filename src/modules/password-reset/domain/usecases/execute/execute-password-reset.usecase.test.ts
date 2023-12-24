import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { MockPasswordReset } from 'test/factories/password-reset-mock';
import { InMemoryPasswordResetRepository } from 'test/repositories/in-memory-password-reset-repository';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { PasswordResetEntity } from '../../entities/password-reset.entity';
import { PasswordResetNotFoundError } from '../../errors/password-reset-not-found.error';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';
import { ExecutePasswordResetUseCase } from './execute-password-reset.usecase';
import { MockUser } from 'test/factories/mock-user';
import { IncorrectOldPasswordError } from '../../errors/incorrect-old-password.error';
import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';

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
    const result = await usecase.exec({
      code: 'AbC4dEf1',
      oldPassword: '',
      newPassword: '',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(PasswordResetNotFoundError);
  });

  it('should return an UserNotFoundError if the user does not exists', async () => {
    const passwordReset = MockPasswordReset.createEntity();

    repository.save(passwordReset);

    const result = await usecase.exec({
      code: passwordReset.code,
      oldPassword: '',
      newPassword: '',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should return an IncorrectOldPasswordError if the old password is incorrect', async () => {
    const user = MockUser.createEntity();

    const passwordReset = MockPasswordReset.createEntity({
      override: {
        userId: user.id,
      },
    });

    userRepository.save(user);
    repository.save(passwordReset);

    passwordEncryptionService.compare.mockResolvedValueOnce(false);

    const result = await usecase.exec({
      code: passwordReset.code,
      oldPassword: 'user-wrong-password',
      newPassword: 'user-new-password',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(IncorrectOldPasswordError);
  });

  it('should invalidate password reset', async () => {
    const user = MockUser.createEntity();

    const passwordReset = MockPasswordReset.createEntity({
      override: {
        userId: user.id,
      },
    });

    userRepository.save(user);
    repository.save(passwordReset);

    passwordEncryptionService.compare.mockResolvedValueOnce(true);

    const result = await usecase.exec({
      code: passwordReset.code,
      oldPassword: 'user-password',
      newPassword: 'user-new-password',
    });

    expect(result.isRight()).toBeTruthy();
    expect(repository.items[0].used).toBeTruthy();
  });

  it('should update user password', async () => {
    const user = MockUser.createEntity();

    const passwordReset = MockPasswordReset.createEntity({
      override: {
        userId: user.id,
      },
    });

    userRepository.save(user);
    repository.save(passwordReset);

    passwordEncryptionService.compare.mockResolvedValueOnce(true);
    passwordEncryptionService.hash.mockResolvedValue(
      'user-hashed-new-password',
    );

    const result = await usecase.exec({
      code: passwordReset.code,
      oldPassword: 'user-password',
      newPassword: 'user-new-password',
    });

    expect(result.isRight()).toBeTruthy();
    expect(userRepository.items[0].password).toEqual(
      'user-hashed-new-password',
    );
  });
});
