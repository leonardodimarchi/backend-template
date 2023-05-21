import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { UserSchema } from '../schemas/user.schema';

export class TypeOrmUserMapper {
  static toEntity(schema: UserSchema): UserEntity {
    return UserEntity.create(
      {
        name: schema.name,
        email: schema.email,
        password: schema.password,
      },
      {
        id: schema.id,
        createdAt: schema.createdAt,
        updatedAt: schema.updatedAt,
      }
    );
  }

  static toSchema(entity: UserEntity): UserSchema {
    return UserSchema.create({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
    });
  }
}
