import { BaseEntity, BaseEntityProps } from '@shared/domain/base.entity';
import { Replace } from '@shared/helpers/replace';
import { Either, Left, Right } from '@shared/helpers/either';

export interface CourseEntityProps {
  title: string;
  description: string;
}

export type CourseEntityCreateProps = Replace<
  CourseEntityProps,
  {}
>;

export class CourseEntity extends BaseEntity<CourseEntityProps> {
  private constructor(
    props: CourseEntityProps,
    baseEntityProps?: BaseEntityProps
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(
    { title, description }: CourseEntityCreateProps,
    baseEntityProps?: BaseEntityProps
  ): Either<Error, CourseEntity> {
    return new Right(
      new CourseEntity(
        {
          title,
          description,
        },
        baseEntityProps
      )
    );
  }

  public get title(): string {
    return this.props.title;
  }

  public set title(title: string) {
    this.props.title = title;
  }

  public get description(): string {
    return this.props.description;
  }

  public set description(description: string) {
    this.props.description = description;
  }
}
