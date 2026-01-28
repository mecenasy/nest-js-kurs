import { MigrationInterface, QueryRunner } from 'typeorm';
import menus from './data/1769609576629-menu-items';
export class MenuItems1769609576629 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      menus.map(async (menu) => {
        const {
          image,
          link,
          menuSide,
          name,
          position,
          role,
          shortName,
          hidden,
        } = menu;
        await queryRunner.query(
          `
        WITH added_menu_item AS (
          INSERT INTO menu (name, position, "shortName", "menuSide", link, hidden, image)
          VALUES ('${name}', ${position}, '${shortName}', '${menuSide}', '${link}', ${hidden ?? false}, '${image}')
          RETURNING id
        )
        INSERT INTO menu_role_role ("menuId", "roleName")
        SELECT id, role
        FROM added_menu_item
        CROSS JOIN (VALUES ${role.map((r) => `('${r}')`).join(',')}) AS roles(role);
          `,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }


}
