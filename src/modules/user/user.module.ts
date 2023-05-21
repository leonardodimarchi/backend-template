import { Module } from '@nestjs/common';
import { UserDatabaseModule } from './infra/database/user-database.module';

@Module({
  imports: [
    UserDatabaseModule,
  ],
})
export class UserModule {}
