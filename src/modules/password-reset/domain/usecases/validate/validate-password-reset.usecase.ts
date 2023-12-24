import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@shared/helpers/either';
import { PasswordResetNotFoundError } from '../../errors/password-reset-not-found.error';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';
import { UseCase } from '@shared/domain/usecases/usecase';

export interface ValidatePasswordResetUseCaseInput {
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
    code,
  }: ValidatePasswordResetUseCaseInput): Promise<
    Either<
      ValidatePasswordResetUseCaseErrors,
      ValidatePasswordResetUseCaseOutput
    >
  > {
    const passwordReset = await this.repository.getValidByCode(code);

    if (!passwordReset) {
      return left(new PasswordResetNotFoundError());
    }

    return right({
      matches: true,
    });
  }
}
