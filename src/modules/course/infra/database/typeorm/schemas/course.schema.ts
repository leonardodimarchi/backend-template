import { UserSchema } from '@modules/user/infra/database/typeorm/schemas/user.schema';
import { BaseSchema } from '@shared/infra/database/typeorm/base.schema';
import { UUID } from 'crypto';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

@Entity('courses')
export class CourseSchema extends BaseSchema {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column()
  instructorId: UUID;

  @ManyToOne(() => UserSchema, { eager: true })
  instructor?: Relation<UserSchema>;
}
