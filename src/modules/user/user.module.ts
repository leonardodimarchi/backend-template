import { Module } from '@nestjs/common';
import { UserDatabaseModule } from './infra/database/user-database.module';
import { UserController } from './presenter/controllers/user.controller';
import { CreateUserUseCase } from './domain/usecases/create-user.usecase';
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  imports: [UserDatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (repository: UserRepository) => {
        return new CreateUserUseCase(repository);
      },
      inject: [UserRepository],
    },
  ],
})
export class UserModule {}
