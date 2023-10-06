import { UserNotFoundError } from '@modules/auth/domain/errors/user-not-found.error';
import { GetUserByIdUseCase } from '@modules/user/domain/usecases/get-user-by-id.usecase';
import { UserViewModel } from '@modules/user/presenter/models/view-models/user.view-model';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Left, Right } from '@shared/helpers/either';
import { MockRequestUser } from 'test/factories/mock-request-user';
import { MockUser } from 'test/factories/mock-user';
import { createI18nMock } from 'test/utils/create-i18n-mock';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: DeepMocked<JwtService>;
  let getUserByIdUseCase: DeepMocked<GetUserByIdUseCase>;

  beforeEach(() => {
    jwtService = createMock<JwtService>();
    getUserByIdUseCase = createMock<GetUserByIdUseCase>();
    controller = new AuthController(jwtService, getUserByIdUseCase);
  });

  describe('login', () => {
    it('should return the generated access token', async () => {
      jwtService.signAsync.mockResolvedValueOnce('mockedAccessToken');

      const result = await controller.login(MockUser.createEntity());

      expect(result.accessToken).toBe('mockedAccessToken');
    });

    it('should sign jwt with user email and id', async () => {
      const requestUser = MockUser.createEntity();

      await controller.login(requestUser);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: requestUser.email.value,
        sub: requestUser.id,
      });
    });
  });

  describe('getProfile', () => {
    it('should return the request user', async () => {
      const requestUserEntity = MockRequestUser.createEntity();

      const userEntity = MockUser.createEntity({
        override: {
          email: requestUserEntity.email,
        },
        basePropsOverride: { id: requestUserEntity.id },
      });

      const userViewModel = new UserViewModel(userEntity);

      getUserByIdUseCase.exec.mockResolvedValueOnce(
        new Right({ user: userEntity }),
      );

      const result = await controller.getProfile(
        requestUserEntity,
        createI18nMock(),
      );

      expect(result).toEqual(userViewModel);
    });

    it('should throw a not found exception if the user was not found', async () => {
      const requestUserEntity = MockRequestUser.createEntity();

      getUserByIdUseCase.exec.mockResolvedValueOnce(
        new Left(new UserNotFoundError(requestUserEntity.id)),
      );

      const call = async () =>
        await controller.getProfile(requestUserEntity, createI18nMock());

      expect(call).rejects.toThrow(NotFoundException);
    });

    it('should throw a internal server exception if there is some unknown error', async () => {
      const requestUserEntity = MockRequestUser.createEntity();

      getUserByIdUseCase.exec.mockResolvedValueOnce(new Left(new Error()));

      const call = async () =>
        await controller.getProfile(requestUserEntity, createI18nMock());

      expect(call).rejects.toThrow(InternalServerErrorException);
    });
  });
});
