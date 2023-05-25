import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './typeorm/schemas/user.schema';
import { TypeOrmUserRepository } from './typeorm/repositories/typeorm-user.repository';
import { UserRepository } from '@modules/user/domain/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository }
  ],
  exports: [UserRepository],
})
export class UserDatabaseModule {}
