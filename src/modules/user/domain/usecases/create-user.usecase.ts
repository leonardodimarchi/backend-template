import { UseCase } from '@shared/domain/usecase';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

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

    await this.repository.save(user);

    return { createdUser: user };
  }
}
