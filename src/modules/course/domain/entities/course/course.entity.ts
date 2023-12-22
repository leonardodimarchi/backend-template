import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import {
  BaseEntity,
  BaseEntityProps,
} from '@shared/domain/entities/base.entity';
import { Either, Left, Right } from '@shared/helpers/either';
import { Replace } from '@shared/helpers/replace';
import { UUID } from 'crypto';
import { InvalidMoneyError } from '../../errors/invalid-money.error';
import { Money } from './value-objects/money';

export interface CourseEntityProps {
  title: string;
  description: string;
  price: Money;
  instructorId: UUID;
  instructor?: UserEntity;
}

export type CourseEntityCreateProps = Replace<
  CourseEntityProps,
  {
    price: number;
  }
>;

export class CourseEntity extends BaseEntity<CourseEntityProps> {
  private constructor(
    props: CourseEntityProps,
    baseEntityProps?: BaseEntityProps,
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(
    {
      title,
      description,
      price,
      instructorId,
      instructor,
    }: CourseEntityCreateProps,
    baseEntityProps?: BaseEntityProps,
  ): Either<InvalidMoneyError, CourseEntity> {
    const priceValue = Money.create(price);

    if (priceValue.isLeft()) {
      return new Left(priceValue.value);
    }

    return new Right(
      new CourseEntity(
        {
          title,
          description,
          price: priceValue.value,
          instructorId,
          instructor,
        },
        baseEntityProps,
      ),
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

  public get price(): Money {
    return this.props.price;
  }

  public set price(price: Money) {
    this.props.price = price;
  }

  public get instructorId(): UUID {
    return this.props.instructorId;
  }

  public get instructor(): UserEntity | null {
    return this.props.instructor || null;
  }
}
