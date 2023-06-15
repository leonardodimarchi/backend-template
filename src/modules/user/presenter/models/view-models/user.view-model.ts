import { UserEntity } from "@modules/user/domain/entities/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserViewModel {
  constructor(entity: UserEntity) {
    this.email = entity.email.value;
    this.name = entity.name.value;
  }

  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}
