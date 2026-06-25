import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskTable1771829633712 implements MigrationInterface {
    name = 'CreateTaskTable1771829633712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TABLE "task" ("created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" "public"."task_status_enum" NOT NULL DEFAULT 'TODO', "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'MEDIUM', "due_date" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2fe7a278e6f08d2be55740a939" ON "task" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_f092f3386f10f2e2ef5b0b6ad1" ON "task" ("priority") `);
        await queryRunner.query(`CREATE INDEX "IDX_aacad78e8bd3e744e81fa48015" ON "task" ("due_date") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ea2c1c13f01b7a383ebbeaebb" ON "task" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6ac6d406c24a4a9c7b1a9db36" ON "task" ("user_id", "status") `);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT '2023-06-20 17:36:53.362+05:30'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT '2023-06-20 17:36:53.362+05:30'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT '2023-06-20 17:36:53.362+05:30'`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" SET DEFAULT '2023-06-20 17:36:53.362+05:30'`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6ac6d406c24a4a9c7b1a9db36"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ea2c1c13f01b7a383ebbeaebb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aacad78e8bd3e744e81fa48015"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f092f3386f10f2e2ef5b0b6ad1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fe7a278e6f08d2be55740a939"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    }

}
