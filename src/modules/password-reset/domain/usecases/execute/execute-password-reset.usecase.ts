import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/domain/usecases/usecase';
import { Either, left, right } from '@shared/helpers/either';
import { IncorrectOldPasswordError } from '../../errors/incorrect-old-password.error';
import { PasswordResetNotFoundError } from '../../errors/password-reset-not-found.error';
import { PasswordResetRepository } from '../../repositories/password-reset.repository';

export interface ExecutePasswordResetUseCaseInput {
  code: string;
  oldPassword: string;
  newPassword: string;
}

export interface ExecutePasswordResetUseCaseOutput {}

export type ExecutePasswordResetUseCaseErrors =
  | PasswordResetNotFoundError
  | IncorrectOldPasswordError
  | UserNotFoundError;

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
    code,
    oldPassword,
    newPassword,
  }: ExecutePasswordResetUseCaseInput): Promise<
    Either<ExecutePasswordResetUseCaseErrors, ExecutePasswordResetUseCaseOutput>
  > {
    const passwordReset = await this.repository.getValidByCode(code);

    if (!passwordReset) {
      return left(new PasswordResetNotFoundError());
    }

    const user = await this.userRepository.getById(passwordReset.userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const isOldPasswordCorrect = await this.passwordEncryptionService.compare(
      oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      return left(new IncorrectOldPasswordError());
    }

    passwordReset.setAsUsed();

    await this.repository.save(passwordReset);

    const userNewPassword =
      await this.passwordEncryptionService.hash(newPassword);

    user.password = userNewPassword;

    await this.userRepository.save(user);

    return right({});
  }
}
