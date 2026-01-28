import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IMenu, MenuSide } from '../model/menu.model';
import { Expose } from 'class-transformer';
import { Role } from '../../user/entity/role.entity';

@Entity()
export class Menu implements IMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @Expose()
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @Expose()
  shortName?: string;

  @Column({
    type: 'enum',
    enum: MenuSide,
    nullable: false,
  })
  @Expose()
  menuSide: MenuSide;

  @Column({
    type: 'int',
    nullable: false,
  })
  @Expose()
  position: number;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  @Expose()
  hidden?: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @Expose()
  link: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @Expose()
  image: string;

  @ManyToMany(() => Role, (role) => role.menu)
  @JoinTable()
  role: Role[];
}
