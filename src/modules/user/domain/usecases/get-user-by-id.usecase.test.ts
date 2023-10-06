import { faker } from '@faker-js/faker';
import { Left, Right } from '@shared/helpers/either';
import { UUID } from 'crypto';
import { MockUser } from 'test/factories/mock-user';
import { InMemoryRepository } from 'test/repositories/in-memory-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { UserEntity } from '../entities/user/user.entity';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserRepository } from '../repositories/user.repository';
import {
  GetUserByIdUseCase,
  GetUserByIdUseCaseOutput,
} from './get-user-by-id.usecase';

describe('GetUserByIdUseCase', () => {
  let usecase: GetUserByIdUseCase;
  let repository: InMemoryRepository<UserRepository, UserEntity>;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    usecase = new GetUserByIdUseCase(repository);
  });

  it('should return the user', async () => {
    const id = faker.string.uuid() as UUID;

    const existingUser = MockUser.createEntity({ basePropsOverride: { id } });

    await repository.save(existingUser);

    const result = await usecase.exec({ id });

    expect(result).toBeInstanceOf(Right);
    expect((result.value as GetUserByIdUseCaseOutput).user.id).toBe(id);
    expect((result.value as GetUserByIdUseCaseOutput).user.email).toBe(
      existingUser.email,
    );
  });

  it('should throw an error if the user was not found', async () => {
    const result = await usecase.exec({
      id: faker.string.uuid() as UUID,
    });

    expect(result).toBeInstanceOf(Left);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
