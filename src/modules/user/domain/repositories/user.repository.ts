import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
    abstract save(user: UserEntity): Promise<void>;
}
