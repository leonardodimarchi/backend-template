import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';

export class CreateAdminUser1688770619687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO users VALUES ('${randomUUID()}', 'now()', 'now()', 'Admin', 'admin@email.com', '${await bcrypt.hash(
        'admin@123',
        10,
      )}', '${UserRole.ADMIN}');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE role = '${UserRole.ADMIN}';`,
    );
  }
}
