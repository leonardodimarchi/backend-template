import { CreateUserUseCase, CreateUserUseCaseInput } from '@modules/user/domain/usecases/create-user.usecase';
import { UserController } from './user.controller';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { MockUser } from 'test/factories/mock-user';
import { UserViewModel } from '../models/view-models/user.view-model';
import { DuplicatedEmailError } from '@modules/user/domain/errors/duplicated-email.error';
import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';

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

      createUserUseCase.exec.mockResolvedValueOnce({ createdUser });

      const result = await controller.create(MockUser.createPayload());

      expect(result).toBeInstanceOf(UserViewModel);
      expect(result).toEqual(expectedResult);
    });

    it('should call the usecase with the correct params', async () => {
      const createdUser = MockUser.createEntity();
      const payload = MockUser.createPayload();

      jest
        .spyOn(createUserUseCase, 'exec')
        .mockResolvedValueOnce({ createdUser });

      await controller.create(payload);

      expect(createUserUseCase.exec).toHaveBeenCalledTimes(1);
      expect(createUserUseCase.exec).toHaveBeenCalledWith<[CreateUserUseCaseInput]>({
        email: payload.email,
        name: payload.name,
        password: payload.password,
      });
    });

    it('should throw a 409 http exception when receivingduplicated email error', async () => {
      createUserUseCase.exec.mockRejectedValueOnce(new DuplicatedEmailError(faker.internet.email()));

      const call = async () => await controller.create(MockUser.createPayload());

      expect(call).rejects.toThrow(ConflictException);
    });
  });
});
