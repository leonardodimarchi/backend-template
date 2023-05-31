import { PasswordEncryptionService } from '@modules/user/domain/services/password-encryption.service';
import { Module } from '@nestjs/common';
import { BcryptPasswordEncryptionService } from './password-encryption/bcrypt-password-encryption.service';

@Module({
  providers: [
    { provide: PasswordEncryptionService, useClass: BcryptPasswordEncryptionService }
  ],
  exports: [PasswordEncryptionService],
})
export class UserServiceModule {}
