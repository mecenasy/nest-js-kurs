import { IsString } from 'class-validator';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { IRole } from '../model/role.model';
import { User } from './user.entity';
import { Menu } from '../../menu/entity/menu.entity';

@Entity()
export class Role implements IRole {
  @PrimaryColumn()
  @IsString()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  user: User[];

  @ManyToMany(() => Menu, (menu) => menu.role)
  menu: Menu[];
}
