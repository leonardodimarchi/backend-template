import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvVariableKeys } from '@shared/infra/env/interfaces/env-variables';
import { EnvService } from '@shared/infra/env/interfaces/env.service';
import { LoginUseCase } from './domain/usecases/login.usecase';
import { JwtStrategy } from './infra/strategies/auth-jwt.strategy';
import { LocalStrategy } from './infra/strategies/auth-local.strategy';
import { AuthController } from './presenter/controllers/auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        return {
          secret: env.get(EnvVariableKeys.JWT_SECRET),
          signOptions: { expiresIn: env.get(EnvVariableKeys.JWT_EXPIRES_IN) },
        };
      },
    }),
  ],
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
    JwtStrategy,
  ],
})
export class AuthModule {}
