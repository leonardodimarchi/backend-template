import { BaseEntity, BaseEntityProps } from '@shared/domain/base.entity';

export interface UserEntityProps {
  name: string;
  email: string;
  password: string;
}

export class UserEntity extends BaseEntity<UserEntityProps> {
  private constructor(
    props: UserEntityProps,
    baseEntityProps?: BaseEntityProps
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(props: UserEntityProps, baseEntityProps?: BaseEntityProps): UserEntity {
    return new UserEntity(props, baseEntityProps);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }
}
