import { MockRequestUser } from 'test/factories/mock-request-user';
import { InMemoryPasswordResetRepository } from 'test/repositories/in-memory-password-reset-repository';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
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

  beforeEach(() => {
    repository = new InMemoryPasswordResetRepository();
    usecase = new RequestPasswordResetUseCase(repository);
  });

  it('should return a PasswordReset', async () => {
    const result = await usecase.exec({
      requestUser: MockRequestUser.createEntity(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(
      (result.value as RequestPasswordResetUseCaseOutput).createdPasswordReset,
    ).toBeInstanceOf(PasswordResetEntity);
  });

  it('should persist the PasswordReset', async () => {
    await usecase.exec({
      requestUser: MockRequestUser.createEntity(),
    });

    expect(repository.items).toHaveLength(1);
  });
});
