import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './typeorm/schemas/user.schema';
import { TypeOrmUserRepository } from './typeorm/repositories/typeorm-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]),
  ],
  providers: [
    TypeOrmUserRepository,
  ],
})
export class UserDatabaseModule {}
