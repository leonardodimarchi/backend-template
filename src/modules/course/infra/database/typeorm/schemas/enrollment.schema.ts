import { UserSchema } from '@modules/user/infra/database/typeorm/schemas/user.schema';
import { BaseSchema } from '@shared/infra/database/typeorm/base.schema';
import { UUID } from 'crypto';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { CourseSchema } from './course.schema';

@Entity('enrollments')
export class EnrollmentSchema extends BaseSchema {
  @Column()
  studentId: UUID;

  @Column()
  courseId: UUID;

  @ManyToOne(() => UserSchema)
  student?: Relation<UserSchema>;

  @ManyToOne(() => CourseSchema)
  course?: Relation<CourseSchema>;
}
