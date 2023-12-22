import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@shared/helpers/either';
import { PasswordResetNotFoundError } from '../../errors/password-reset-not-found.error';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';
import { UseCase } from '@shared/domain/usecases/usecase';

export interface ValidatePasswordResetUseCaseInput {
  requestUser: RequestUserEntity;
  code: string;
}

export interface ValidatePasswordResetUseCaseOutput {
  matches: boolean;
}

export type ValidatePasswordResetUseCaseErrors = PasswordResetNotFoundError;

@Injectable()
export class ValidatePasswordResetUseCase
  implements
    UseCase<
      ValidatePasswordResetUseCaseInput,
      ValidatePasswordResetUseCaseOutput,
      ValidatePasswordResetUseCaseErrors
    >
{
  constructor(private readonly repository: PasswordResetRepository) {}

  async exec({
    requestUser,
    code,
  }: ValidatePasswordResetUseCaseInput): Promise<
    Either<
      ValidatePasswordResetUseCaseErrors,
      ValidatePasswordResetUseCaseOutput
    >
  > {
    const passwordReset = await this.repository.getValidByUserId(
      requestUser.id,
    );

    if (!passwordReset) {
      return left(new PasswordResetNotFoundError());
    }

    return right({
      matches: code.toLowerCase() === passwordReset.code.toLowerCase(),
    });
  }
}
