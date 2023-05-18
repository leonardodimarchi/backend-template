import {
  BaseEntity,
  BaseEntityProps,
} from '@shared/domain/entities/base.entity';

export interface UserEntityProps {
  name: string;
  email: string;
  password: string;
}

export class UserEntity extends BaseEntity<UserEntityProps> {
  static create(props: UserEntityProps, baseEntityProps?: BaseEntityProps) {
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
