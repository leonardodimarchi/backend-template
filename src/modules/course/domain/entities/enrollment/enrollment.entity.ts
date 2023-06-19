import { BaseEntity, BaseEntityProps } from '@shared/domain/base.entity';
import { Replace } from '@shared/helpers/replace';
import { Either, Right } from '@shared/helpers/either';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { CourseEntity } from '../course/course.entity';

export interface EnrollmentEntityProps {
  student: UserEntity;
  course: CourseEntity;
}

export type EnrollmentEntityCreateProps = Replace<EnrollmentEntityProps, {}>;

export class EnrollmentEntity extends BaseEntity<EnrollmentEntityProps> {
  private constructor(
    props: EnrollmentEntityProps,
    baseEntityProps?: BaseEntityProps
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(
    { student, course }: EnrollmentEntityCreateProps,
    baseEntityProps?: BaseEntityProps
  ): Either<Error, EnrollmentEntity> {
    return new Right(
      new EnrollmentEntity(
        {
          student,
          course,
        },
        baseEntityProps
      )
    );
  }

  public get student(): UserEntity {
    return this.props.student;
  }

  public get course(): CourseEntity {
    return this.props.course;
  }
}
