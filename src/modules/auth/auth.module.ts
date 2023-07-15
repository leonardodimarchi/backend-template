import { UserRepository } from '@modules/user/domain/repositories/user.repository';
import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { UserDatabaseModule } from '@modules/user/infra/database/user-database.module';
import { UserServiceModule } from '@modules/user/infra/services/user-services.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginUseCase } from './domain/usecases/login.usecase';
import { JwtStrategy } from './infra/strategies/auth-jwt.strategy';
import { LocalStrategy } from './infra/strategies/auth-local.strategy';
import { AuthController } from './presenter/controllers/auth.controller';

@Module({
  imports: [
    UserDatabaseModule,
    UserServiceModule,
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '60s' },
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
