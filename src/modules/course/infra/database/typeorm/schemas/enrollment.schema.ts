import { UserSchema } from "@modules/user/infra/database/typeorm/schemas/user.schema";
import { BaseSchema } from "@shared/infra/database/typeorm/base.schema";
import { Entity, ManyToOne } from "typeorm";
import { CourseSchema } from "./course.schema";

@Entity('enrollments')
export class EnrollmentSchema extends BaseSchema {
  @ManyToOne(() => UserSchema)
  student: UserSchema;

  @ManyToOne(() => CourseSchema)
  course: CourseSchema;
}
