import { Module } from '@nestjs/common';
import { UserDatabaseModule } from './infra/database/user-database.module';
import { UserController } from './presenter/controllers/user.controller';
import { CreateUserUseCase } from './domain/usecases/create-user.usecase';
import { UserRepository } from './domain/repositories/user.repository';
import { PasswordEncryptionService } from './domain/services/password-encryption.service';
import { UserServiceModule } from './infra/services/user-services.module';

@Module({
  imports: [UserDatabaseModule, UserServiceModule],
  controllers: [UserController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (
        repository: UserRepository,
        passwordEncryptionService: PasswordEncryptionService
      ) => {
        return new CreateUserUseCase(repository, passwordEncryptionService);
      },
      inject: [UserRepository, PasswordEncryptionService],
    },
  ],
})
export class UserModule {}
