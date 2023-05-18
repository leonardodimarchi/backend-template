import { UserEntity } from '../entities/user.entity';
import { CreateUserUseCase } from './create-user.usecase';

describe('CreateUserUseCase', () => {
  let usecase: CreateUserUseCase;

  beforeEach(() => {
    usecase = new CreateUserUseCase();
  });

  it('should return a new user', async () => {
    const { createdUser } = await usecase.exec({
        name: 'John Doe',
        email: 'john.doe@email.com',
        password: 'johnpassword',
    });

    expect(createdUser).toBeInstanceOf(UserEntity);
    expect(createdUser.name).toBe('John Doe');
    expect(createdUser.email).toBe('john.doe@email.com');
    expect(createdUser.password).toBe('johnpassword');
  });
});
