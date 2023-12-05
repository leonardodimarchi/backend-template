import { UserSchema } from '@modules/user/infra/database/typeorm/schemas/user.schema';
import { BaseSchema } from '@shared/infra/database/typeorm/base.schema';
import { UUID } from 'node:crypto';
import { Column, Entity, Index, ManyToOne, Relation } from 'typeorm';

@Entity('password_resets')
export class PasswordResetSchema extends BaseSchema {
  @Index('idx_password_reset_code')
  @Column()
  userId: UUID;

  @Column()
  code: string;

  @Column()
  validUntil: Date;

  @Column({ default: false })
  used: boolean;

  @ManyToOne(() => UserSchema, {
    onDelete: 'CASCADE',
  })
  user?: Relation<UserSchema>;
}
