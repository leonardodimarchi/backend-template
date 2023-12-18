import { Module } from '@nestjs/common';
import { ExecutePasswordResetUseCase } from './domain/usecases/execute/execute-password-reset.usecase';
import { RequestPasswordResetUseCase } from './domain/usecases/request/request-password-reset.usecase';
import { ValidatePasswordResetUseCase } from './domain/usecases/validate/validate-password-reset.usecase';
import { PasswordResetDatabaseModule } from './infra/database/password-reset-database.module';
import { PasswordResetController } from './presenter/controllers/password-reset.controller';

@Module({
  imports: [PasswordResetDatabaseModule],
  controllers: [PasswordResetController],
  providers: [
    RequestPasswordResetUseCase,
    ValidatePasswordResetUseCase,
    ExecutePasswordResetUseCase,
  ],
})
export class PasswordResetModule {}
