import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/domain/usecase';
import { Either, left, right } from '@shared/helpers/either';
import { IncorrectOldPasswordError } from '../../errors/incorrect-old-password.error';
import { IncorrectPasswordResetCodeError } from '../../errors/incorrect-password-reset-code.error';
import { PasswordResetNotFoundError } from '../../errors/password-reset-not-found.error';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';

export interface ExecutePasswordResetUseCaseInput {
  requestUser: RequestUserEntity;
  code: string;
  oldPassword: string;
  newPassword: string;
}

export interface ExecutePasswordResetUseCaseOutput {}

export type ExecutePasswordResetUseCaseErrors =
  | PasswordResetNotFoundError
  | IncorrectOldPasswordError
  | IncorrectPasswordResetCodeError;

@Injectable()
export class ExecutePasswordResetUseCase
  implements
    UseCase<
      ExecutePasswordResetUseCaseInput,
      ExecutePasswordResetUseCaseOutput,
      ExecutePasswordResetUseCaseErrors
    >
{
  constructor(
    private readonly repository: PasswordResetRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordEncryptionService: PasswordEncryptionService,
  ) {}

  async exec({
    requestUser,
    code,
  }: ExecutePasswordResetUseCaseInput): Promise<
    Either<ExecutePasswordResetUseCaseErrors, ExecutePasswordResetUseCaseOutput>
  > {
    const passwordReset = await this.repository.getValidByUserId(
      requestUser.id,
    );

    if (!passwordReset) {
      return left(new PasswordResetNotFoundError());
    }

    if (code.toLowerCase() !== passwordReset.code) {
      return left(new IncorrectPasswordResetCodeError());
    }

    return right({});
  }
}
