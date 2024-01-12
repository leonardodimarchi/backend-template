import { IncorrectOldPasswordError } from '@modules/password-reset/domain/errors/incorrect-old-password.error';
import { PasswordResetNotFoundError } from '@modules/password-reset/domain/errors/password-reset-not-found.error';
import { ExecutePasswordResetUseCase } from '@modules/password-reset/domain/usecases/execute/execute-password-reset.usecase';
import { RequestPasswordResetUseCase } from '@modules/password-reset/domain/usecases/request/request-password-reset.usecase';
import { ValidatePasswordResetUseCase } from '@modules/password-reset/domain/usecases/validate/validate-password-reset.usecase';
import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { ExecutePasswordResetPayload } from '../models/payloads/execute-password-reset.payload';
import { PasswordResetCodeValidationViewModel } from '../models/view-models/password-reset-code-validation.view-model';

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
  @ApiOkResponse({
    description: 'The code was validated',
    type: PasswordResetCodeValidationViewModel,
  })
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

  @ApiOperation({ summary: 'Reset user password' })
  @ApiHeader({ name: 'Accept-Language', example: 'en', required: false })
  @Patch('reset/:code')
  public async execute(
    @Param('code') code: string,
    @Body() payload: ExecutePasswordResetPayload,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<void> {
    const result = await this.executePasswordResetUseCase.exec({
      code,
      newPassword: payload.newPassword,
      oldPassword: payload.oldPassword,
    });

    if (result.isLeft()) {
      if (result.value instanceof PasswordResetNotFoundError) {
        throw new NotFoundException(
          i18n.t('password-reset.errors.password-reset-not-found'),
        );
      }

      if (result.value instanceof UserNotFoundError) {
        throw new NotFoundException(
          i18n.t('password-reset.errors.user-not-found'),
        );
      }

      if (result.value instanceof IncorrectOldPasswordError) {
        throw new BadRequestException(
          i18n.t('password-reset.errors.incorrect-old-password'),
        );
      }

      throw new InternalServerErrorException();
    }
  }
}
