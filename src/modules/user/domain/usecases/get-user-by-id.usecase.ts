import { Either, Left, Right } from '@shared/helpers/either';
import { UUID } from 'crypto';
import { UserEntity } from '../entities/user/user.entity';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserRepository } from '../repositories/user.repository';
import { UseCase } from '@shared/domain/usecases/usecase';

export interface GetUserByIdUseCaseInput {
  id: UUID;
}

export interface GetUserByIdUseCaseOutput {
  user: UserEntity;
}

export type GetUserByIdUseCaseErrors = Error;

export class GetUserByIdUseCase
  implements
    UseCase<
      GetUserByIdUseCaseInput,
      GetUserByIdUseCaseOutput,
      GetUserByIdUseCaseErrors
    >
{
  constructor(private readonly repository: UserRepository) {}

  async exec({
    id,
  }: GetUserByIdUseCaseInput): Promise<
    Either<GetUserByIdUseCaseErrors, GetUserByIdUseCaseOutput>
  > {
    const user = await this.repository.getById(id);

    if (!user) {
      return new Left(new UserNotFoundError(id));
    }

    return new Right({ user });
  }
}
