import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import { Either, Right } from '@shared/helpers/either';
import { UUID } from 'crypto';

export interface RequestUserEntityProps {
  id: UUID;
  email: string;
  roles: UserRole[];
}

export type RequestUserEntityCreateProps = RequestUserEntityProps;

export class RequestUserEntity {
  private constructor(props: RequestUserEntityProps) {
    this.props = props;
    Object.freeze(this);
  }

  static create({
    id,
    email,
    roles,
  }: RequestUserEntityCreateProps): Either<Error, RequestUserEntity> {
    return new Right(new RequestUserEntity({ id, email, roles }));
  }

  private props: RequestUserEntityProps;

  get id(): UUID {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get roles(): UserRole[] {
    return this.props.roles;
  }
}
