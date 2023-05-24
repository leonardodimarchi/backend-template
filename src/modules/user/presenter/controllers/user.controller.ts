import { CreateUserUseCase } from '@modules/user/domain/usecases/create-user.usecase';
import { Controller, Post } from '@nestjs/common';
import { UserViewModel } from '../models/view-models/user.view-model';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(): Promise<UserViewModel> {
    const { createdUser } = await this.createUserUseCase.exec({ email: '', name: '', password: '' });

    return new UserViewModel(createdUser);
  }
}
