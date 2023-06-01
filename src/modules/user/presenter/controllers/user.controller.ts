import { CreateUserUseCase } from '@modules/user/domain/usecases/create-user.usecase';
import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserViewModel } from '../models/view-models/user.view-model';
import { CreateUserPayload } from '../models/payloads/create-user.payload';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DuplicatedEmailError } from '@modules/user/domain/errors/duplicated-email.error';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserViewModel })
  @Post()
  async create(@Body() payload: CreateUserPayload): Promise<UserViewModel> {
    const { email, name, password } = payload;

    const result = await this.createUserUseCase.exec({
      email,
      name,
      password,
    });

    if (result.isLeft()) {
      if (result.value instanceof DuplicatedEmailError) {
        throw new ConflictException('The provided e-mail already exists.', {
          cause: result.value,
        });
      }

      throw new InternalServerErrorException();
    }

    return new UserViewModel(result.value.createdUser);
  }
}
