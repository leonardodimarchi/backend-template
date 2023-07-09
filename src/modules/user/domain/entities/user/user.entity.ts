import { BaseEntity, BaseEntityProps } from '@shared/domain/base.entity';
import { Replace } from '@shared/helpers/replace';
import { Email } from './value-objects/email';
import { Either, Left, Right } from '@shared/helpers/either';
import { InvalidEmailError } from '../../errors/invalid-email.error';
import { Name } from './value-objects/name';
import { InvalidNameError } from '../../errors/invalid-name.error';
import { UserRole } from './user-role.enum';

export interface UserEntityProps {
  name: Name;
  email: Email;
  password: string;
  roles: UserRole[];
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
    baseEntityProps?: BaseEntityProps,
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(
    { name, email, password, roles: role }: UserEntityCreateProps,
    baseEntityProps?: BaseEntityProps,
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
          roles: role,
        },
        baseEntityProps,
      ),
    );
  }

  get name(): Name {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get roles(): UserRole[] {
    return this.props.roles;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }
}
