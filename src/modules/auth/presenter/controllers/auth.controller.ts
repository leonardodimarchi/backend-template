import { AuthLocalGuard } from '@modules/auth/infra/guards/auth-local.guard';
import { Controller, UseGuards, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { LoginPayload } from '../models/payloads/login.payload';
import { JwtViewModel } from '../models/view-models/jwt.view-model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
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
  async login(): Promise<JwtViewModel> {
    return {
      accessToken: '',
    };
  }
}
