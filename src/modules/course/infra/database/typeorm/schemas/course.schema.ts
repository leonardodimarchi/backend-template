import { UserSchema } from "@modules/user/infra/database/typeorm/schemas/user.schema";
import { BaseSchema } from "@shared/infra/database/typeorm/base.schema";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('courses')
export class CourseSchema extends BaseSchema {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => UserSchema, { eager: true })
  instructor: UserSchema;
}
