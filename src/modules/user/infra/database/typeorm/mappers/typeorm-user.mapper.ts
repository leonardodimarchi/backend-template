import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserSchema } from '../schemas/user.schema';

export class TypeOrmUserMapper {
  static toEntity(schema: UserSchema): UserEntity {
    const user = UserEntity.create(
      {
        name: schema.name,
        email: schema.email,
        password: schema.password,
        roles: schema.roles,
      },
      {
        id: schema.id,
        createdAt: schema.createdAt,
        updatedAt: schema.updatedAt,
      },
    );

    if (user.isLeft()) {
      throw new Error(`Could not map user schema to entity: ${user.value}`);
    }

    return user.value;
  }

  static toSchema(entity: UserEntity): UserSchema {
    return UserSchema.create({
      id: entity.id,
      name: entity.name.value,
      email: entity.email.value,
      password: entity.password,
      roles: entity.roles,
    });
  }
}
