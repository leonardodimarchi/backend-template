import { Module } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { PasswordEncryptionService } from './domain/services/password-encryption.service';
import { CreateUserUseCase } from './domain/usecases/create-user.usecase';
import { GetUserByIdUseCase } from './domain/usecases/get-user-by-id.usecase';
import { UserDatabaseModule } from './infra/database/user-database.module';
import { UserServiceModule } from './infra/services/user-services.module';
import { UserController } from './presenter/controllers/user.controller';

@Module({
  imports: [UserDatabaseModule, UserServiceModule],
  controllers: [UserController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (
        repository: UserRepository,
        passwordEncryptionService: PasswordEncryptionService,
      ) => {
        return new CreateUserUseCase(repository, passwordEncryptionService);
      },
      inject: [UserRepository, PasswordEncryptionService],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (repository: UserRepository) => {
        return new GetUserByIdUseCase(repository);
      },
      inject: [UserRepository],
    },
  ],
  exports: [
    UserDatabaseModule,
    UserServiceModule,
    CreateUserUseCase,
    GetUserByIdUseCase,
  ],
})
export class UserModule {}
