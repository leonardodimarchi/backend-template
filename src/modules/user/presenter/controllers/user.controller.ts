import { CreateUserUseCase } from '@modules/user/domain/usecases/create-user.usecase';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserViewModel } from '../models/view-models/user.view-model';
import { CreateUserPayload } from '../models/payloads/create-user.payload';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DuplicatedEmailError } from '@modules/user/domain/errors/duplicated-email.error';
import { InvalidEmailError } from '@modules/user/domain/errors/invalid-email.error';
import { InvalidNameError } from '@modules/user/domain/errors/invalid-name.error';
import { I18nContext } from 'nestjs-i18n';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: true })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserViewModel })
  @Post()
  async create(@Body() payload: CreateUserPayload): Promise<UserViewModel> {
    const { email, name, password } = payload;

    const result = await this.createUserUseCase.exec({
      email,
      name,
      password,
    });

    if (result.isRight()) {
      return new UserViewModel(result.value.createdUser);
    }

    if (result.value instanceof DuplicatedEmailError) {
      throw new ConflictException(
        I18nContext.current()?.t('users.errors.duplicated-email'),
        {
          cause: result.value,
        }
      );
    }

    if (result.value instanceof InvalidEmailError) {
      throw new BadRequestException(I18nContext.current()?.t('users.errors.invalid-email'), {
        cause: result.value,
      });
    }

    if (result.value instanceof InvalidNameError) {
      throw new BadRequestException(I18nContext.current()?.t('users.errors.invalid-name'), {
        cause: result.value,
      });
    }

    throw new InternalServerErrorException();
  }
}
