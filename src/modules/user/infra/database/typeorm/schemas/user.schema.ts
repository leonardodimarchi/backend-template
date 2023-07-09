import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import { BaseSchema } from '@shared/infra/database/typeorm/base.schema';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserSchema extends BaseSchema {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'simple-array',
    enum: UserRole,
    default: [UserRole.STUDENT],
  })
  roles: UserRole[];
}
