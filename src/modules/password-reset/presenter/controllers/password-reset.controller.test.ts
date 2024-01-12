import { faker } from '@faker-js/faker';
import { IncorrectOldPasswordError } from '@modules/password-reset/domain/errors/incorrect-old-password.error';
import { PasswordResetNotFoundError } from '@modules/password-reset/domain/errors/password-reset-not-found.error';
import { ExecutePasswordResetUseCase } from '@modules/password-reset/domain/usecases/execute/execute-password-reset.usecase';
import { RequestPasswordResetUseCase } from '@modules/password-reset/domain/usecases/request/request-password-reset.usecase';
import { ValidatePasswordResetUseCase } from '@modules/password-reset/domain/usecases/validate/validate-password-reset.usecase';
import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { left, right } from '@shared/helpers/either';
import { MockPasswordReset } from 'test/factories/password-reset-mock';
import { createI18nMock } from 'test/utils/create-i18n-mock';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { PasswordResetController } from './password-reset.controller';

describe('PasswordResetController', () => {
  let controller: PasswordResetController;
  let requestPasswordResetUseCase: DeepMocked<RequestPasswordResetUseCase>;
  let validatePasswordResetUseCase: DeepMocked<ValidatePasswordResetUseCase>;
  let executePasswordResetUseCase: DeepMocked<ExecutePasswordResetUseCase>;

  beforeEach(() => {
    requestPasswordResetUseCase = createMock<RequestPasswordResetUseCase>();
    validatePasswordResetUseCase = createMock<ValidatePasswordResetUseCase>();
    executePasswordResetUseCase = createMock<ExecutePasswordResetUseCase>();
    controller = new PasswordResetController(
      requestPasswordResetUseCase,
      validatePasswordResetUseCase,
      executePasswordResetUseCase,
    );
  });

  describe('request', () => {
    it('should have no feedback if the reset was successfully requested', async () => {
      requestPasswordResetUseCase.exec.mockResolvedValueOnce(
        right({
          createdPasswordReset: MockPasswordReset.createEntity(),
        }),
      );

      const result = await controller.request(faker.internet.email());

      expect(result).toBeUndefined();
    });

    it('should have no feedback if the user was not found', async () => {
      requestPasswordResetUseCase.exec.mockResolvedValueOnce(
        left(new UserNotFoundError()),
      );

      const result = await controller.request(faker.internet.email());

      expect(result).toBeUndefined();
    });

    it('should throw an internal server exception when receiving an unknown error', async () => {
      requestPasswordResetUseCase.exec.mockResolvedValueOnce(left(new Error()));

      const call = async () => await controller.request(faker.internet.email());

      expect(call).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateCode', () => {
    it('should return that the code is valid', async () => {
      validatePasswordResetUseCase.exec.mockResolvedValueOnce(
        right({
          matches: true,
        }),
      );

      const result = await controller.validateCode('A'.repeat(8));

      expect(result.isValid).toBeTruthy();
    });

    it('should return that the code is invalid if it was not found', async () => {
      validatePasswordResetUseCase.exec.mockResolvedValueOnce(
        left(new PasswordResetNotFoundError()),
      );

      const result = await controller.validateCode('A'.repeat(8));

      expect(result.isValid).toBeFalsy();
    });

    it('should throw an internal server exception when receiving an unknown error', async () => {
      validatePasswordResetUseCase.exec.mockResolvedValueOnce(
        left(new Error()),
      );

      const call = async () => await controller.validateCode('A'.repeat(8));

      expect(call).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('execute', () => {
    it('should return nothing when sucessful', async () => {
      executePasswordResetUseCase.exec.mockResolvedValueOnce(right({}));

      const result = await controller.execute(
        'A'.repeat(8),
        {
          oldPassword: '',
          newPassword: '',
        },
        createI18nMock(),
      );

      expect(result).toBeUndefined();
    });

    it('should throw a not found exception if the password reset was not found', async () => {
      executePasswordResetUseCase.exec.mockResolvedValueOnce(
        left(new PasswordResetNotFoundError()),
      );

      const call = async () =>
        await controller.execute(
          'A'.repeat(8),
          {
            oldPassword: '',
            newPassword: '',
          },
          createI18nMock(),
        );

      expect(call).rejects.toThrow(NotFoundException);
    });

    it('should throw a not found exception if the user was not found', async () => {
      executePasswordResetUseCase.exec.mockResolvedValueOnce(
        left(new UserNotFoundError()),
      );

      const call = async () =>
        await controller.execute(
          'A'.repeat(8),
          {
            oldPassword: '',
            newPassword: '',
          },
          createI18nMock(),
        );

      expect(call).rejects.toThrow(NotFoundException);
    });

    it('should throw a bad request exception if the old password is incorrect', async () => {
      executePasswordResetUseCase.exec.mockResolvedValueOnce(
        left(new IncorrectOldPasswordError()),
      );

      const call = async () =>
        await controller.execute(
          'A'.repeat(8),
          {
            oldPassword: '',
            newPassword: '',
          },
          createI18nMock(),
        );

      expect(call).rejects.toThrow(BadRequestException);
    });

    it('should throw an internal server exception when receiving an unknown error', async () => {
      executePasswordResetUseCase.exec.mockResolvedValueOnce(left(new Error()));

      const call = async () =>
        await controller.execute(
          'A'.repeat(8),
          {
            oldPassword: '',
            newPassword: '',
          },
          createI18nMock(),
        );

      expect(call).rejects.toThrow(InternalServerErrorException);
    });
  });
});
