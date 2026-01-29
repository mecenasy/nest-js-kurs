import { MigrationInterface, QueryRunner } from 'typeorm';
import { groups } from './data/1769701093922-university-data';

export class UniversityData1769701093922 implements MigrationInterface {
  private genValues(values: string[]) {
    return values.map((value) => `('${value}')`).join(',');
  }
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "year" (name) VALUES ${this.genValues(['1', '2', '3', '4', '5'])}
      ON CONFLICT (name) DO NOTHING
      RETURNING name`,
    );
    await queryRunner.query(
      `WITH returning_direction AS (
        INSERT INTO direction (name) VALUES ('Informatyka'), ('Zarządzanie')
        RETURNING name
      )
      INSERT INTO "direction_years_year" ("directionName", "yearName")
      SELECT name, year
      FROM "returning_direction"
      CROSS JOIN (VALUES ${this.genValues(['1', '2', '3', '4'])}) years(year);`,
    );
    await queryRunner.query(
      `WITH returning_specialty AS (
            INSERT INTO specialty (name, "directionName") VALUES ('Programowanie','Informatyka'),('Sieciowe','Informatyka'), ('Marketing','Zarządzanie'),('Księgowość','Zarządzanie')
            RETURNING name
        )
        INSERT INTO "specialty_years_year" ("specialtyName", "yearName")
        SELECT name, year
        FROM "returning_specialty"
        CROSS JOIN (VALUES ('1'), ('2'), ('3'), ('4')) years(year);
      `,
    );

    await Promise.all(
      groups.map(async ({ name, specialty, years }) => {
        await queryRunner.query(
          `WITH added_group as (
            INSERT INTO "group" (name, "specialtyName") VALUES ('${name}', '${specialty}' )
            RETURNING name
          )
          INSERT INTO "group_years_year" ("groupName", "yearName")
          SELECT name, year
          FROM added_group
          CROSS JOIN (VALUES ${this.genValues(years)}) AS years(year);
        `,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
