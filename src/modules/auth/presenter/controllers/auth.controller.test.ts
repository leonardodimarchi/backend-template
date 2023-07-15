import { UserViewModel } from '@modules/user/presenter/models/view-models/user.view-model';
import { JwtService } from '@nestjs/jwt';
import { MockUser } from 'test/factories/mock-user';
import { DeepMocked, createMock } from 'test/utils/create-mock';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: DeepMocked<JwtService>;

  beforeEach(() => {
    jwtService = createMock<JwtService>();
    controller = new AuthController(jwtService);
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
    it('should return the request user view-model', () => {
      const requestUser = MockUser.createEntity();
      const requestUserViewModel = new UserViewModel(requestUser);

      const result = controller.getProfile(requestUser);

      expect(result).toEqual(requestUserViewModel);
    });
  });
});
