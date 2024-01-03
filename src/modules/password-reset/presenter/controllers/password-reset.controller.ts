import { ExecutePasswordResetUseCase } from '@modules/password-reset/domain/usecases/execute/execute-password-reset.usecase';
import { RequestPasswordResetUseCase } from '@modules/password-reset/domain/usecases/request/request-password-reset.usecase';
import { ValidatePasswordResetUseCase } from '@modules/password-reset/domain/usecases/validate/validate-password-reset.usecase';
import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PasswordResetCodeValidationViewModel } from '../models/view-models/password-reset-code-validation.view-model';
import { PasswordResetNotFoundError } from '@modules/password-reset/domain/errors/password-reset-not-found.error';

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

  @ApiOperation({ summary: 'Validates a password reset code' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  @Get('validate/:code')
  public async validateCode(
    @Param('code') code: string,
  ): Promise<PasswordResetCodeValidationViewModel> {
    const result = await this.validatePasswordResetUseCase.exec({
      code,
    });

    if (result.isRight()) {
      return { isValid: result.value.matches };
    }

    if (result.value instanceof PasswordResetNotFoundError) {
      return {
        isValid: false,
      };
    }

    throw new InternalServerErrorException();
  }
}
