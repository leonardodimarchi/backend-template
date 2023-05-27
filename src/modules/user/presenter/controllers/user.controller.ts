import { CreateUserUseCase } from '@modules/user/domain/usecases/create-user.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { UserViewModel } from '../models/view-models/user.view-model';
import { CreateUserPayload } from '../models/payloads/create-user.payload';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiResponse({ type: UserViewModel })
  @Post()
  async create(@Body() payload: CreateUserPayload): Promise<UserViewModel> {
    const {
      email,
      name,
      password,
    } = payload;

    const { createdUser } = await this.createUserUseCase.exec({
      email,
      name,
      password,
    });

    return new UserViewModel(createdUser);
  }
}
