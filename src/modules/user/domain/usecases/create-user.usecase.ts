import { UseCase } from '@shared/domain/usecase';
import { UserEntity } from '../entities/user/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { DuplicatedEmailError } from '../errors/duplicated-email.error';

export interface CreateUserUseCaseInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserUseCaseOutput {
  createdUser: UserEntity;
}

export class CreateUserUseCase
  implements UseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput>
{
  constructor(private readonly repository: UserRepository) {}

  async exec({
    name,
    email,
    password,
  }: CreateUserUseCaseInput): Promise<CreateUserUseCaseOutput> {
    const user = UserEntity.create({
      name,
      email,
      password,
    });

    const hasDuplicatedEmail = await this.repository.isDuplicatedEmail(email);

    if (hasDuplicatedEmail) {
      throw new DuplicatedEmailError(email);
    }

    await this.repository.save(user);

    return { createdUser: user };
  }
}
