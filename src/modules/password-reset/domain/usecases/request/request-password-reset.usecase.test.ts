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
import { DeepMocked, createMock } from 'test/utils/create-mock';
import {
  MailService,
  SendMailOptions,
} from '@shared/domain/services/mail.service';

describe('RequestPasswordResetUseCase', () => {
  let usecase: RequestPasswordResetUseCase;

  let repository: InMemoryRepository<
    PasswordResetRepository,
    PasswordResetEntity
  >;
  let userRepository: InMemoryRepository<UserRepository, UserEntity>;
  let mailService: DeepMocked<MailService>;

  beforeEach(() => {
    repository = new InMemoryPasswordResetRepository();
    userRepository = new InMemoryUserRepository();
    mailService = createMock<MailService>();
    usecase = new RequestPasswordResetUseCase(
      repository,
      userRepository,
      mailService,
    );
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

  it('should send an email to the user containing the code', async () => {
    const email = faker.internet.email();
    const user = MockUser.createEntity({
      override: {
        email,
      },
    });

    userRepository.save(user);

    await usecase.exec({
      email,
    });

    expect(repository.items).toHaveLength(1);
    expect(mailService.send).toHaveBeenCalledTimes(1);
    expect(mailService.send).toHaveBeenCalledWith(
      expect.objectContaining<Partial<SendMailOptions>>({
        to: email,
        bodyHtml: expect.stringContaining(repository.items[0].code),
      }),
    );
  });
});
