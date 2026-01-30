import { MigrationInterface, QueryRunner } from 'typeorm';
import { PasswordService } from 'src/user/password/password.service';
import { users } from './data/1769761782012-add_users';

export class AddUsers1769761782012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const passSer = new PasswordService();
    await Promise.all(
      users.map(async (user) => {
        const { address, email, password, person, role, student } = user;
        const { hash, salt } = passSer.generatePassword(password);
        await queryRunner.query(
          `
                WITH inserted_user AS (
                  INSERT INTO "user" (email)
                  VALUES ('${email}')
                  RETURNING id
                ),
                inserted_password AS (
                  INSERT INTO "hashed_password" (hash, salt, "userId")
                  SELECT '${hash}', '${salt}', id FROM inserted_user
                ),
                inserted_person AS (
                  INSERT INTO person (name, surname, phone, photo, "userId")
                  SELECT '${person.name}', '${person.surname}', ${person.phone}, '${person.photo}', id FROM inserted_user
                  RETURNING "userId"
                ),
                inserted_address AS (
                  INSERT INTO address (city, country, number, street, "zipCode", "personId")
                  SELECT '${address.city}', '${address.country}', '${address.number}', '${address.street}', '${address.zipCode}', "userId" FROM inserted_person
                ),
                inserted_student AS (
                  INSERT INTO student ("studentId", direction, "group", "year", specialty)
                  SELECT id, '${student?.direction}', '${student?.group}', '${student?.year}', '${student?.specialty}'
                  FROM inserted_user
                  WHERE '${role}' = 'student'
                )
                INSERT INTO user_roles_role ("userId", "roleName")
                SELECT id, '${role}' FROM inserted_user
                `,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
