import { BaseEntity, BaseEntityProps } from '@shared/domain/base.entity';
import { Replace } from '@shared/helpers/replace';
import { Email } from './value-objects/email';
import { Either, Left, Right } from '@shared/helpers/either';
import { InvalidEmailError } from '../../errors/invalid-email.error';
import { Name } from './value-objects/name';
import { InvalidNameError } from '../../errors/invalid-name.error';

export interface UserEntityProps {
  name: Name;
  email: Email;
  password: string;
}

export type UserEntityCreateProps = Replace<
  UserEntityProps,
  {
    email: string;
    name: string;
  }
>;

export class UserEntity extends BaseEntity<UserEntityProps> {
  private constructor(
    props: UserEntityProps,
    baseEntityProps?: BaseEntityProps
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(
    { name, email, password }: UserEntityCreateProps,
    baseEntityProps?: BaseEntityProps
  ): Either<InvalidEmailError | InvalidNameError, UserEntity> {
    const emailValue = Email.create(email);
    const nameValue = Name.create(name);

    if (emailValue.isLeft()) {
      return new Left(emailValue.value);
    }

    if (nameValue.isLeft()) {
      return new Left(nameValue.value);
    }

    return new Right(
      new UserEntity(
        {
          name: nameValue.value,
          email: emailValue.value,
          password,
        },
        baseEntityProps
      )
    );
  }

  get name(): string {
    return this.props.name.value;
  }

  get email(): string {
    return this.props.email.value;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }
}
