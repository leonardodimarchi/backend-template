import { CreateUserUseCase } from '@modules/user/domain/usecases/create-user.usecase';
import { Controller, Post } from '@nestjs/common';
import { UserViewModel } from '../models/view-models/user.view-model';
import { CreateUserPayload } from '../models/payloads/create-user.payload';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create({
    email,
    name,
    password,
  }: CreateUserPayload): Promise<UserViewModel> {
    const { createdUser } = await this.createUserUseCase.exec({
      email,
      name,
      password,
    });

    return new UserViewModel(createdUser);
  }
}
