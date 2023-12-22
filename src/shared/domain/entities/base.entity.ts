import { UUID, randomUUID } from 'crypto';

export interface BaseEntityProps {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export class BaseEntity<TProps extends object> {
  constructor(props: TProps, baseEntityProps?: BaseEntityProps) {
    this._id = baseEntityProps?.id ?? randomUUID();
    this._createdAt = baseEntityProps?.createdAt ?? new Date();
    this._updatedAt = baseEntityProps?.updatedAt ?? new Date();
    this.props = props;
  }

  protected _id: UUID;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected props: TProps;

  get id(): UUID {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
