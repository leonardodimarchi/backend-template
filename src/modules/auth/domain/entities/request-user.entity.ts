import { Either, Right } from '@shared/helpers/either';
import { UUID } from 'crypto';

export interface RequestUserEntityProps {
  id: UUID;
  email: string;
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
  }: RequestUserEntityCreateProps): Either<Error, RequestUserEntity> {
    return new Right(new RequestUserEntity({ id, email }));
  }

  private props: RequestUserEntityProps;

  get id(): UUID {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }
}
