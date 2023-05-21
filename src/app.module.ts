import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@shared/infra/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
