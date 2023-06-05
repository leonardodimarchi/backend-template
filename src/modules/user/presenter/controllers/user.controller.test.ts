import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from '@modules/user/domain/usecases/create-user.usecase';
import { UserController } from './user.controller';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { MockUser } from 'test/factories/mock-user';
import { UserViewModel } from '../models/view-models/user.view-model';
import { DuplicatedEmailError } from '@modules/user/domain/errors/duplicated-email.error';
import { faker } from '@faker-js/faker';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Left, Right } from '@shared/helpers/either';
import { InvalidEmailError } from '@modules/user/domain/errors/invalid-email.error';
import { InvalidNameError } from '@modules/user/domain/errors/invalid-name.error';
import { createI18nMock } from 'test/utils/create-i18n-mock';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: DeepMocked<CreateUserUseCase>;

  beforeEach(() => {
    createUserUseCase = createMock<CreateUserUseCase>();
    controller = new UserController(createUserUseCase);
  });

  describe('create', () => {
    it('should return an user view model', async () => {
      const createdUser = MockUser.createEntity();
      const expectedResult = new UserViewModel(createdUser);

      createUserUseCase.exec.mockResolvedValueOnce(new Right({ createdUser }));

      const result = await controller.create(MockUser.createPayload(), createI18nMock());

      expect(result).toBeInstanceOf(UserViewModel);
      expect(result).toEqual(expectedResult);
    });

    it('should call the usecase with the correct params', async () => {
      const createdUser = MockUser.createEntity();
      const payload = MockUser.createPayload();

      jest
        .spyOn(createUserUseCase, 'exec')
        .mockResolvedValueOnce(new Right({ createdUser }));

      await controller.create(payload, createI18nMock());

      expect(createUserUseCase.exec).toHaveBeenCalledTimes(1);
      expect(createUserUseCase.exec).toHaveBeenCalledWith<
        [CreateUserUseCaseInput]
      >({
        email: payload.email,
        name: payload.name,
        password: payload.password,
      });
    });

    it('should throw a 409 http exception when receiving a duplicated email error', async () => {
      createUserUseCase.exec.mockResolvedValueOnce(
        new Left(new DuplicatedEmailError(faker.internet.email()))
      );

      const call = async () =>
        await controller.create(MockUser.createPayload(), createI18nMock());

      expect(call).rejects.toThrow(ConflictException);
    });

    it('should throw a 403 http exception when receiving an invalid email error', async () => {
      createUserUseCase.exec.mockResolvedValueOnce(
        new Left(new InvalidEmailError(faker.internet.email()))
      );

      const call = async () =>
        await controller.create(MockUser.createPayload(), createI18nMock());

      expect(call).rejects.toThrow(BadRequestException);
    });

    it('should throw a 403 http exception when receiving an invalid name error', async () => {
      createUserUseCase.exec.mockResolvedValueOnce(
        new Left(new InvalidNameError(faker.person.fullName()))
      );

      const call = async () =>
        await controller.create(MockUser.createPayload(), createI18nMock());

      expect(call).rejects.toThrow(BadRequestException);
    });
  });
});
