import { PasswordEncryptionService } from "@modules/user/domain/services/password-encryption.service";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class BcryptPasswordEncryptionService implements PasswordEncryptionService {
    private readonly rounds: number = 10;

    async hash(hashString: string): Promise<string> {
      return await bcrypt.hash(hashString, this.rounds);
    }
  
    async compare(password: string, hashPassword: string): Promise<boolean> {
      return await bcrypt.compare(password, hashPassword);
    }
}