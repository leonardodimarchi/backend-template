import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import {
  BaseEntity,
  BaseEntityProps,
} from '@shared/domain/entities/base.entity';
import { Either, Right } from '@shared/helpers/either';
import { Replace } from '@shared/helpers/replace';
import { UUID } from 'crypto';
import { CourseEntity } from '../course/course.entity';

export interface EnrollmentEntityProps {
  studentId: UUID;
  courseId: UUID;
  student?: UserEntity;
  course?: CourseEntity;
}

export type EnrollmentEntityCreateProps = Replace<
  EnrollmentEntityProps,
  unknown
>;

export class EnrollmentEntity extends BaseEntity<EnrollmentEntityProps> {
  private constructor(
    props: EnrollmentEntityProps,
    baseEntityProps?: BaseEntityProps,
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(
    { studentId, courseId, student, course }: EnrollmentEntityCreateProps,
    baseEntityProps?: BaseEntityProps,
  ): Either<Error, EnrollmentEntity> {
    return new Right(
      new EnrollmentEntity(
        {
          studentId,
          courseId,
          student,
          course,
        },
        baseEntityProps,
      ),
    );
  }

  public get studentId(): UUID {
    return this.props.studentId;
  }

  public get courseId(): UUID {
    return this.props.courseId;
  }

  public get student(): UserEntity | null {
    return this.props.student || null;
  }

  public get course(): CourseEntity | null {
    return this.props.course || null;
  }
}
