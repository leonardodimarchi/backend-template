import { RequestUserEntity } from '@modules/auth/domain/entities/request-user.entity';
import { UserNotFoundError } from '@modules/auth/domain/errors/user-not-found.error';
import { AuthJwtGuard } from '@modules/auth/infra/guards/auth-jwt.guard';
import { AuthLocalGuard } from '@modules/auth/infra/guards/auth-local.guard';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { GetUserByIdUseCase } from '@modules/user/domain/usecases/get-user-by-id.usecase';
import { UserViewModel } from '@modules/user/presenter/models/view-models/user.view-model';
import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequestUser } from '@shared/presenter/decorators/request-user.decorator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { LoginPayload } from '../models/payloads/login.payload';
import { JwtViewModel } from '../models/view-models/jwt.view-model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @UseGuards(AuthLocalGuard)
  @Post('login')
  @ApiBody({
    description: 'Login information',
    type: LoginPayload,
  })
  @ApiOkResponse({
    description: 'The JWT was generated with success',
    type: JwtViewModel,
  })
  @ApiOperation({ summary: 'Generate a JWT for authentication' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  async login(@RequestUser() requestUser: UserEntity): Promise<JwtViewModel> {
    const accessToken = await this.jwtService.signAsync({
      email: requestUser.email.value,
      sub: requestUser.id,
      roles: requestUser.roles,
    });

    return {
      accessToken,
    };
  }

  @Get('profile')
  @UseGuards(AuthJwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The logged user profile has returned with success',
    type: UserViewModel,
  })
  @ApiOperation({ summary: 'Returns logged user profile' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  async getProfile(
    @RequestUser() requestUser: RequestUserEntity,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<UserViewModel> {
    const userResult = await this.getUserByIdUseCase.exec({
      id: requestUser.id,
    });

    if (userResult.isRight()) {
      return new UserViewModel(userResult.value.user);
    }

    if (userResult.value instanceof UserNotFoundError) {
      throw new NotFoundException(i18n.t('auth.errors.user-not-found'));
    }

    throw new InternalServerErrorException();
  }
}
