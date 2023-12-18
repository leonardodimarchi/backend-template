import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/domain/usecase';
import { Either, Left, Right } from '@shared/helpers/either';
import { PasswordResetEntity } from '../../entities/password-reset.entity';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';

export interface RequestPasswordResetUseCaseInput {
  email: string;
}

export interface RequestPasswordResetUseCaseOutput {
  createdPasswordReset: PasswordResetEntity;
}

export type RequestPasswordResetUseCaseErrors = UserNotFoundError | Error;

@Injectable()
export class RequestPasswordResetUseCase
  implements
    UseCase<
      RequestPasswordResetUseCaseInput,
      RequestPasswordResetUseCaseOutput,
      RequestPasswordResetUseCaseErrors
    >
{
  constructor(
    private readonly repository: PasswordResetRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async exec({
    email,
  }: RequestPasswordResetUseCaseInput): Promise<
    Either<RequestPasswordResetUseCaseErrors, RequestPasswordResetUseCaseOutput>
  > {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      return new Left(new UserNotFoundError());
    }

    const PasswordResetResult = PasswordResetEntity.create({
      userId: user.id,
    });

    if (PasswordResetResult.isLeft()) {
      return new Left(PasswordResetResult.value);
    }

    await this.repository.save(PasswordResetResult.value);

    return new Right({ createdPasswordReset: PasswordResetResult.value });
  }
}
