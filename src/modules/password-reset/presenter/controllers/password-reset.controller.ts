import { ExecutePasswordResetUseCase } from '@modules/password-reset/domain/usecases/execute/execute-password-reset.usecase';
import { RequestPasswordResetUseCase } from '@modules/password-reset/domain/usecases/request/request-password-reset.usecase';
import { ValidatePasswordResetUseCase } from '@modules/password-reset/domain/usecases/validate/validate-password-reset.usecase';
import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import {
  Controller,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Password Resets')
@Controller('password-resets')
export class PasswordResetController {
  constructor(
    private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private readonly validatePasswordResetUseCase: ValidatePasswordResetUseCase,
    private readonly executePasswordResetUseCase: ExecutePasswordResetUseCase,
  ) {}

  @ApiOperation({ summary: 'Requests a password reset' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  @Post('request/:email')
  public async request(@Param('email') email: string): Promise<void> {
    const result = await this.requestPasswordResetUseCase.exec({
      email,
    });

    if (result.isRight()) {
      return;
    }

    if (result.value instanceof UserNotFoundError) {
      return;
    }

    throw new InternalServerErrorException();
  }
}
