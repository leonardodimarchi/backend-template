import { BaseSchema } from "@shared/infra/database/typeorm/base.schema";
import { Column, Entity } from "typeorm";

@Entity('users')
export class UserSchema extends BaseSchema {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}