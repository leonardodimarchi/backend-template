import { UserEntity } from "@modules/user/domain/entities/user/user.entity";

export class UserViewModel {
  constructor(entity: UserEntity) {
    this.email = entity.email;
    this.name = entity.name;
  }

  email: string;
  name: string;
}
