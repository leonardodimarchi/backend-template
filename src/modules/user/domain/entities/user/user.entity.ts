import { BaseEntity, BaseEntityProps } from '@shared/domain/base.entity';
import { Replace } from '@shared/helpers/replace';
import { Email } from './value-objects/email';

export interface UserEntityProps {
  name: string;
  email: Email;
  password: string;
}

export type UserEntityCreateProps = Replace<UserEntityProps, {
  email: string;
}>

export class UserEntity extends BaseEntity<UserEntityProps> {
  private constructor(
    props: UserEntityProps,
    baseEntityProps?: BaseEntityProps
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create({ name, email, password }: UserEntityCreateProps, baseEntityProps?: BaseEntityProps): UserEntity {
    return new UserEntity({
      name,
      email: Email.create(email),
      password
    }, baseEntityProps);
  }

  set name(name: string) {
    this.props.name = name;
  }

  get name(): string {
    return this.props.name;
  }

  set email(email: string) {
    this.props.email = Email.create(email);
  }

  get email(): string {
    return this.props.email.value;
  }

  get password(): string {
    return this.props.password;
  }
}
