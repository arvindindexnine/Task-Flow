import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusAndSeedAdmin1771965200000 implements MigrationInterface {
    name = 'AddStatusAndSeedAdmin1771965200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add status column to user table
        // First check if type exists to avoid errors on retry
        await queryRunner.query(`DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
                CREATE TYPE "public"."user_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
            END IF;
        END $$;`);

        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'APPROVED'`);

        // Seed Super Admin with ID 0 to match AuthService
        // The password hash corresponds to 'Admin@123'
        await queryRunner.query(`
            INSERT INTO "user" (id, email, password, name, status, created_at, updated_at)
            VALUES (0, 'superadmin@company.com', '$2b$10$Jj0tMdobkWI7s3VzjV7lxOLQgn/I83eVCS6H0VJ6c9VKP/jTrdjBC', 'Super Admin', 'APPROVED', now(), now())
            ON CONFLICT (email) DO NOTHING
        `);

        // Ensure user_id 0 exists in user_role for SUPER_ADMIN role
        await queryRunner.query(`
            INSERT INTO "user_role" (user_id, role_id)
            SELECT 0, id FROM "role" WHERE name = 'SUPER_ADMIN'
            ON CONFLICT DO NOTHING
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user_role" WHERE user_id = 0`);
        await queryRunner.query(`DELETE FROM "user" WHERE id = 0`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    }
}
