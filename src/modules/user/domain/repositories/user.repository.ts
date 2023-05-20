import { UserEntity } from "../entities/user/user.entity";

export abstract class UserRepository {
    abstract save(user: UserEntity): Promise<void>;
}
