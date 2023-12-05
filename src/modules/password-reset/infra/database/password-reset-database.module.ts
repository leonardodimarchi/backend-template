import { PasswordResetRepository } from '@modules/password-reset/domain/repositories/password-reset.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPasswordResetRepository } from './typeorm/repositories/password-reset-typeorm.repository';
import { PasswordResetSchema } from './typeorm/schemas/password-reset.schema';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetSchema])],
  providers: [
    {
      provide: PasswordResetRepository,
      useClass: TypeOrmPasswordResetRepository,
    },
  ],
  exports: [PasswordResetRepository],
})
export class PasswordResetDatabaseModule {}
