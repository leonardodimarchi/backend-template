import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import {
  BaseEntity,
  BaseEntityProps,
} from '@shared/domain/entities/base.entity';
import { Either, Right } from '@shared/helpers/either';
import { Replace } from '@shared/helpers/replace';
import { UUID } from 'node:crypto';

export interface PasswordResetEntityProps {
  userId: UUID;
  user?: UserEntity;
  code: string;
  validUntil: Date;
  used: boolean;
}

export type PasswordResetEntityCreateProps = Replace<
  PasswordResetEntityProps,
  {
    code?: string;
    validUntil?: Date;
    used?: boolean;
  }
>;

export class PasswordResetEntity extends BaseEntity<PasswordResetEntityProps> {
  private constructor(
    props: PasswordResetEntityProps,
    baseEntityProps?: BaseEntityProps,
  ) {
    super(props, baseEntityProps);
    Object.freeze(this);
  }

  static create(
    { userId, code, user, validUntil, used }: PasswordResetEntityCreateProps,
    baseEntityProps?: BaseEntityProps,
  ): Either<Error, PasswordResetEntity> {
    const day = 24 * 60 * 60 * 1000;
    const tomorrow = new Date(+new Date() + day);

    return new Right(
      new PasswordResetEntity(
        {
          userId,
          user,
          code: code || this.generateCode(),
          validUntil: validUntil || tomorrow,
          used: used ?? false,
        },
        baseEntityProps,
      ),
    );
  }

  static generateCode(): string {
    const codeSize = 8;

    return [...Array(codeSize)]
      .map(() =>
        Math.floor(Math.random() * 16)
          .toString(16)
          .toUpperCase(),
      )
      .join('');
  }

  public get userId(): UUID {
    return this.props.userId;
  }

  public get user(): UserEntity | null {
    return this.props.user || null;
  }

  public get code(): string {
    return this.props.code;
  }

  public get validUntil(): Date {
    return this.props.validUntil;
  }

  public get used(): boolean {
    return this.props.used;
  }
}
