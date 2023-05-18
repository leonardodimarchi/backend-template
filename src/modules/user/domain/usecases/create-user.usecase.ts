import { UseCase } from '@shared/domain/usecase';
import { UserEntity } from '../entities/user.entity';

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

    return { createdUser: user };
  }
}
