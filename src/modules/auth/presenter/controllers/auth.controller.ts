import { AuthJwtGuard } from '@modules/auth/infra/guards/auth-jwt.guard';
import { AuthLocalGuard } from '@modules/auth/infra/guards/auth-local.guard';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserViewModel } from '@modules/user/presenter/models/view-models/user.view-model';
import { Controller, UseGuards, Post, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { RequestUser } from '@shared/presenter/decorators/request-user.decorator';
import { LoginPayload } from '../models/payloads/login.payload';
import { JwtViewModel } from '../models/view-models/jwt.view-model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

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
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: true })
  async login(@RequestUser() requestUser: UserEntity): Promise<JwtViewModel> {
    const accessToken = await this.jwtService.signAsync({
      email: requestUser.email.value,
      sub: requestUser.id,
    });

    return {
      accessToken,
    };
  }

  @UseGuards(AuthJwtGuard)
  @Get('profile')
  @ApiOkResponse({
    description: 'The logged user profile has returned with success',
    type: UserViewModel,
  })
  @ApiOperation({ summary: 'Returns logged user profile' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: true })
  getProfile(@RequestUser() requestUser: UserEntity): UserViewModel {
    return new UserViewModel(requestUser);
  }
}
