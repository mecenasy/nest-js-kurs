import { MigrationInterface, QueryRunner } from 'typeorm';

export class Student1769711111111 implements MigrationInterface {
  name = 'Student1769711111111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student" ("album" SERIAL NOT NULL, "studentId" uuid NOT NULL, "direction" character varying NOT NULL, "specialty" character varying NOT NULL, "group" character varying NOT NULL, "year" character varying NOT NULL DEFAULT '1', "active" boolean NOT NULL DEFAULT true, CONSTRAINT "REL_9316abc534487368cfd8527e8d" UNIQUE ("studentId"), CONSTRAINT "PK_ea086032bc893bc772097be422c" PRIMARY KEY ("album"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "FK_9316abc534487368cfd8527e8df" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "FK_9316abc534487368cfd8527e8df"`,
    );
    await queryRunner.query(`DROP TABLE "student"`);
  }
}
