import { PasswordResetEntity } from '@modules/password-reset/domain/entities/password-reset.entity';
import { TypeOrmUserMapper } from '@modules/user/infra/database/typeorm/mappers/typeorm-user.mapper';
import { PasswordResetSchema } from '../schemas/password-reset.schema';

export class TypeOrmPasswordResetMapper {
  static toEntity(schema: PasswordResetSchema): PasswordResetEntity {
    const entity = PasswordResetEntity.create(
      {
        userId: schema.userId,
        code: schema.code,
        validUntil: schema.validUntil,
        used: schema.used,
        ...(schema.user && {
          user: TypeOrmUserMapper.toEntity(schema.user),
        }),
      },
      {
        id: schema.id,
        createdAt: schema.createdAt,
        updatedAt: schema.updatedAt,
      },
    );

    if (entity.isLeft()) {
      throw new Error(`Could not map entity schema to entity: ${entity.value}`);
    }

    return entity.value;
  }

  static toSchema(entity: PasswordResetEntity): PasswordResetSchema {
    return PasswordResetSchema.create({
      id: entity.id,
      code: entity.code,
      validUntil: entity.validUntil,
      used: entity.used,
      userId: entity.userId,
    });
  }
}
