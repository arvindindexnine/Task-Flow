import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetTokenToUser1771835908597 implements MigrationInterface {
    name = 'AddResetTokenToUser1771835908597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "reset_token_expiry" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "reset_token_expiry"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "reset_token"`);
    }

}
