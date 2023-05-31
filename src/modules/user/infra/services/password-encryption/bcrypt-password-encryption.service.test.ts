import { PasswordEncryptionService } from "@modules/user/domain/services/password-encryption.service";
import { BcryptPasswordEncryptionService } from "./bcrypt-password-encryption.service";

describe('BcryptService', () => {
    let service: PasswordEncryptionService;

    beforeEach(() => {
        service = new BcryptPasswordEncryptionService();
    });

    it('should hash a password correctly', async () => {
        const passwordHashed = await service.hash('password');

        expect(await service.compare('password', passwordHashed)).toBe(true);
    });
});