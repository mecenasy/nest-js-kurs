import { MigrationInterface, QueryRunner } from 'typeorm';

export class MenuTable1769609466417 implements MigrationInterface {
  name = 'MenuTable1769609466417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "shortName" character varying(50), "menuSide" "public"."menu_menuside_enum" NOT NULL, "position" integer NOT NULL, "hidden" boolean NOT NULL, "link" character varying(50) NOT NULL, "image" character varying(50) NOT NULL, CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "menu_role_role" ("menuId" uuid NOT NULL, "roleName" character varying NOT NULL, CONSTRAINT "PK_fc32f79d7e0cebd57abb66fdaa2" PRIMARY KEY ("menuId", "roleName"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95fa06c3996cda27120b03b243" ON "menu_role_role" ("menuId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a49c740ae1275c0217e5f71deb" ON "menu_role_role" ("roleName") `,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_role_role" ADD CONSTRAINT "FK_95fa06c3996cda27120b03b2434" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_role_role" ADD CONSTRAINT "FK_a49c740ae1275c0217e5f71deb1" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menu_role_role" DROP CONSTRAINT "FK_a49c740ae1275c0217e5f71deb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "menu_role_role" DROP CONSTRAINT "FK_95fa06c3996cda27120b03b2434"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a49c740ae1275c0217e5f71deb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_95fa06c3996cda27120b03b243"`,
    );
    await queryRunner.query(`DROP TABLE "menu_role_role"`);
    await queryRunner.query(`DROP TABLE "menu"`);
  }
}
