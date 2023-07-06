import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRole1688675236739 implements MigrationInterface {
  name = 'UserRole1688675236739';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'student'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }
}
