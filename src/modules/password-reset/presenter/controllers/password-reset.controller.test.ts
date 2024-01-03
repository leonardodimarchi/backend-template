import { RequestPasswordResetUseCase } from '@modules/password-reset/domain/usecases/request/request-password-reset.usecase';
import { PasswordResetController } from './password-reset.controller';
import { faker } from '@faker-js/faker';
import { ExecutePasswordResetUseCase } from '@modules/password-reset/domain/usecases/execute/execute-password-reset.usecase';
import { ValidatePasswordResetUseCase } from '@modules/password-reset/domain/usecases/validate/validate-password-reset.usecase';
import { right, left } from '@shared/helpers/either';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { MockPasswordReset } from 'test/factories/password-reset-mock';
import { UserNotFoundError } from '@modules/user/domain/errors/user-not-found.error';
import { InternalServerErrorException } from '@nestjs/common';
import { PasswordResetNotFoundError } from '@modules/password-reset/domain/errors/password-reset-not-found.error';

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
});
