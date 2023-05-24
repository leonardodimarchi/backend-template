import { CreateUserUseCase } from '@modules/user/domain/usecases/create-user.usecase';
import { UserController } from './user.controller';
import { createMock } from 'test/utils/create-mock';
import { MockUser } from 'test/factories/mock-user';
import { UserViewModel } from '../models/view-models/user.view-model';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    createUserUseCase = createMock<CreateUserUseCase>();
    controller = new UserController(createUserUseCase);
  });

  describe('create', () => {
    it('should return an user view model', async () => {
      const createdUser = MockUser.createEntity();
      const expectedResult = new UserViewModel(createdUser);
      
      jest
        .spyOn(createUserUseCase, 'exec')
        .mockResolvedValueOnce({ createdUser });

      const result = await controller.create();

      expect(result).toBeInstanceOf(UserViewModel);
      expect(result).toEqual(expectedResult);
    });
  });
});
