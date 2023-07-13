import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { LoginUseCase } from './domain/usecases/login.usecase';
import { LocalStrategy } from './infra/strategies/auth-local.strategy';
import { AuthController } from './presenter/controllers/auth.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (userRepository, passwordEncryptionService) => {
        return new LoginUseCase(userRepository, passwordEncryptionService);
      },
      inject: [UserRepository, PasswordEncryptionService],
    },
    LocalStrategy,
  ],
})
export class AuthModule {}
