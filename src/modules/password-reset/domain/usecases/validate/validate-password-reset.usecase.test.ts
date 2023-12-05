import { MockRequestUser } from 'test/factories/mock-request-user';
import { MockPasswordReset } from 'test/factories/password-reset-mock';
import { InMemoryPasswordResetRepository } from 'test/repositories/in-memory-password-reset-repository';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { PasswordResetEntity } from '../../entities/password-reset.entity';
import { PasswordResetNotFoundError } from '../../errors/password-reset-not-found.error';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';
import {
  ValidatePasswordResetUseCase,
  ValidatePasswordResetUseCaseOutput,
} from './validate-password-reset.usecase';

describe('ValidatePasswordResetUseCase', () => {
  let usecase: ValidatePasswordResetUseCase;
  let repository: InMemoryRepository<
    PasswordResetRepository,
    PasswordResetEntity
  >;

  beforeEach(() => {
    repository = new InMemoryPasswordResetRepository();
    usecase = new ValidatePasswordResetUseCase(repository);
  });

  it('should return true if the code is matching', async () => {
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
    });

    expect(result.isRight()).toBeTruthy();
    expect(
      (result.value as ValidatePasswordResetUseCaseOutput).matches,
    ).toBeTruthy();
  });

  it('should return false if the code is not matching', async () => {
    const requestUser = MockRequestUser.createEntity();
    const passwordReset = MockPasswordReset.createEntity({
      override: {
        userId: requestUser.id,
      },
    });

    repository.save(passwordReset);

    const result = await usecase.exec({
      requestUser,
      code: 'RANDOM_CODE',
    });

    expect(result.isRight()).toBeTruthy();
    expect(
      (result.value as ValidatePasswordResetUseCaseOutput).matches,
    ).toBeFalsy();
  });

  it('should consider the code as case insensitive', async () => {
    const requestUser = MockRequestUser.createEntity();
    const passwordReset = MockPasswordReset.createEntity({
      override: {
        userId: requestUser.id,
        code: 'ABC4DEF1',
      },
    });

    repository.save(passwordReset);

    const result = await usecase.exec({
      requestUser,
      code: 'AbC4dEf1',
    });

    expect(result.isRight()).toBeTruthy();
    expect(
      (result.value as ValidatePasswordResetUseCaseOutput).matches,
    ).toBeTruthy();
  });

  it('should return a PasswordResetNotFoundError if a valid reset was not found', async () => {
    const requestUser = MockRequestUser.createEntity();

    const result = await usecase.exec({
      requestUser,
      code: 'AbC4dEf1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(PasswordResetNotFoundError);
  });
});
