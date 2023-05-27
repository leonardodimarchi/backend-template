import { CreateUserUseCase } from '@modules/user/domain/usecases/create-user.usecase';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserViewModel } from '../models/view-models/user.view-model';
import { CreateUserPayload } from '../models/payloads/create-user.payload';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserViewModel })
  @Post()
  async create(@Body() payload: CreateUserPayload): Promise<UserViewModel> {
    const { email, name, password } = payload;

    const { createdUser } = await this.createUserUseCase.exec({
      email,
      name,
      password,
    });

    return new UserViewModel(createdUser);
  }
}
