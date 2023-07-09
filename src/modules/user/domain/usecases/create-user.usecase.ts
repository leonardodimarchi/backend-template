import { UseCase } from '@shared/domain/usecase';
import { UserEntity } from '../entities/user/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { DuplicatedEmailError } from '../errors/duplicated-email.error';
import { PasswordEncryptionService } from '../services/password-encryption.service';
import { InvalidEmailError } from '../errors/invalid-email.error';
import { Either, Left, Right } from '@shared/helpers/either';
import { InvalidNameError } from '../errors/invalid-name.error';
import { UserRole } from '../entities/user/user-role.enum';

export interface CreateUserUseCaseInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserUseCaseOutput {
  createdUser: UserEntity;
}

export type CreateUserUseCaseErrors =
  | InvalidEmailError
  | InvalidNameError
  | DuplicatedEmailError;

export class CreateUserUseCase
  implements
    UseCase<
      CreateUserUseCaseInput,
      CreateUserUseCaseOutput,
      CreateUserUseCaseErrors
    >
{
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordEncryptionService: PasswordEncryptionService,
  ) {}

  async exec({
    name,
    email,
    password,
  }: CreateUserUseCaseInput): Promise<
    Either<CreateUserUseCaseErrors, CreateUserUseCaseOutput>
  > {
    const user = UserEntity.create({
      name,
      email,
      password,
      roles: [UserRole.STUDENT],
    });

    if (user.isLeft()) {
      return new Left(user.value);
    }

    const hasDuplicatedEmail = await this.repository.isDuplicatedEmail(email);

    if (hasDuplicatedEmail) {
      return new Left(new DuplicatedEmailError(email));
    }

    const encryptedPassword = await this.passwordEncryptionService.hash(
      user.value.password,
    );

    user.value.password = encryptedPassword;

    await this.repository.save(user.value);

    return new Right({ createdUser: user.value });
  }
}
