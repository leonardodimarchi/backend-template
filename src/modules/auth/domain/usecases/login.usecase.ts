import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { InvalidEmailError } from '@modules/user/domain/errors/invalid-email.error';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { UseCase } from '@shared/domain/usecase';
import { Either, Left, Right } from '@shared/helpers/either';
import { IncorrectPasswordError } from '../errors/incorrect-password.error';
import { UserNotFoundError } from '../errors/user-not-found.error';

export interface LoginUseCaseInput {
  email: string;
  password: string;
}

export interface LoginUseCaseOutput {
  user: UserEntity;
}

export type LoginUseCaseErrors = InvalidEmailError | IncorrectPasswordError;

export class LoginUseCase
  implements UseCase<LoginUseCaseInput, LoginUseCaseOutput, LoginUseCaseErrors>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordEncryptionService: PasswordEncryptionService,
  ) {}

  async exec({
    email,
    password,
  }: LoginUseCaseInput): Promise<
    Either<LoginUseCaseErrors, LoginUseCaseOutput>
  > {
    const user = await this.repository.getByEmail(email);

    if (!user) {
      return new Left(new UserNotFoundError(email));
    }

    const isPasswordCorrect = await this.passwordEncryptionService.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return new Left(new IncorrectPasswordError());
    }

    return new Right({ user });
  }
}
