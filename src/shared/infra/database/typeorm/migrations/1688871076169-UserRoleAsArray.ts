import { UserRole } from '@modules/user/domain/entities/user/user-role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRoleAsArray1688871076169 implements MigrationInterface {
  name = 'UserRoleAsArray1688871076169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "roles" text NOT NULL DEFAULT '${UserRole.STUDENT}'`,
    );
    await queryRunner.query(`UPDATE "users" u SET "roles" = u.role`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT '${UserRole.STUDENT}'`,
    );
    await queryRunner.query(`UPDATE "users" u SET "role" = u.roles`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
  }
}
