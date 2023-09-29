import { UUID } from 'crypto';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseSchema extends BaseEntity {
  @PrimaryColumn({ type: 'character varying' })
  id: UUID;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
