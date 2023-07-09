import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import { UserEntity } from '@modules/user/domain/entities/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityViewModel } from '@shared/presenter/models/base-entity.view-model';

export class UserViewModel extends BaseEntityViewModel {
  constructor(entity: UserEntity) {
    super(entity);

    this.email = entity.email.value;
    this.name = entity.name.value;
    this.roles = entity.roles;
  }

  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: [UserRole.STUDENT] })
  roles: string[];
}
