import { BaseEntity, BaseEntityProps } from '@shared/domain/base.entity';
import { Replace } from '@shared/helpers/replace';
import { Email } from './value-objects/email';
import { Either, Left, Right } from '@shared/helpers/either';
import { InvalidEmailError } from '../../errors/invalid-email.error';

export interface UserEntityProps {
  name: string;
  email: Email;
  password: string;
}

export type UserEntityCreateProps = Replace<
  UserEntityProps,
  {
    email: string;
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
  ): Either<InvalidEmailError, UserEntity> {
    const emailValue = Email.create(email);

    if (emailValue.isLeft()) {
      return new Left(emailValue.value);
    }

    return new Right(
      new UserEntity(
        {
          name,
          email: emailValue.value,
          password,
        },
        baseEntityProps
      )
    );
  }

  set name(name: string) {
    this.props.name = name;
  }

  get name(): string {
    return this.props.name;
  }

  set email(email: Email) {
    this.props.email = email;
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
