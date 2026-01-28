import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1769597714523 implements MigrationInterface {
  name = 'InitialMigration1769597714523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "taskId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_93a72d5d7e5370002fd7a237fd9" UNIQUE ("taskId", "name"), CONSTRAINT "PK_fb2322fb12d4db26386caeff6ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ed786959519e4915b874d3677" ON "task_label" ("taskId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text NOT NULL, "status" "public"."task_status_enum" NOT NULL DEFAULT 'OPEN', "userId" uuid NOT NULL, "createTime" TIMESTAMP NOT NULL DEFAULT now(), "updateTime" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("city" character varying(50) NOT NULL, "country" character varying(50) NOT NULL, "number" character varying(15) NOT NULL, "street" character varying(50) NOT NULL, "zipCode" character varying(10) NOT NULL, "personId" uuid NOT NULL, CONSTRAINT "PK_e3d0b5ba0387be88105ad7683bb" PRIMARY KEY ("personId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "person" ("name" character varying(50) NOT NULL, "surname" character varying(50) NOT NULL, "phone" integer NOT NULL, "photo" character varying(50), "userId" uuid NOT NULL, CONSTRAINT "PK_83b775da14886d352de2a4cac01" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("name" character varying NOT NULL, CONSTRAINT "PK_ae4578dcaed5adff96595e61660" PRIMARY KEY ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "createTime" TIMESTAMP NOT NULL DEFAULT now(), "updateTime" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hashed_password" ("userId" uuid NOT NULL, "hash" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "PK_ba69521950c3445d64018779293" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_role" ("userId" uuid NOT NULL, "roleName" character varying NOT NULL, CONSTRAINT "PK_8e8a23b3ea43dd063b8726385cd" PRIMARY KEY ("userId", "roleName"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_02914c59615da1ef38e848e324" ON "user_roles_role" ("roleName") `,
    );
    await queryRunner.query(
      `ALTER TABLE "task_label" ADD CONSTRAINT "FK_2ed786959519e4915b874d3677b" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_e3d0b5ba0387be88105ad7683bb" FOREIGN KEY ("personId") REFERENCES "person"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" ADD CONSTRAINT "FK_83b775da14886d352de2a4cac01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashed_password" ADD CONSTRAINT "FK_ba69521950c3445d64018779293" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_02914c59615da1ef38e848e324a" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_02914c59615da1ef38e848e324a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hashed_password" DROP CONSTRAINT "FK_ba69521950c3445d64018779293"`,
    );
    await queryRunner.query(
      `ALTER TABLE "person" DROP CONSTRAINT "FK_83b775da14886d352de2a4cac01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_e3d0b5ba0387be88105ad7683bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_label" DROP CONSTRAINT "FK_2ed786959519e4915b874d3677b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_02914c59615da1ef38e848e324"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles_role"`);
    await queryRunner.query(`DROP TABLE "hashed_password"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "person"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2ed786959519e4915b874d3677"`,
    );
    await queryRunner.query(`DROP TABLE "task_label"`);
  }
}
