import { Injectable } from '@nestjs/common';
import { AddMenuItemDto } from './dto/add-menu-item.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { Role } from 'src/user/entity/role.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async getMenu(role: string): Promise<Menu[]> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu.role', 'role')
      .where('role.name = :role', { role })
      .getMany();
  }

  public async addMenuItem(menuDto: AddMenuItemDto): Promise<Menu> {
    console.log('🚀 ~ MenuService ~ addMenuItem ~ menuDto:', menuDto);
    const roles = await this.roleRepository.findBy({
      name: In(menuDto.role),
    });
    console.log('🚀 ~ MenuService ~ addMenuItem ~ roles:', roles);
    return this.menuRepository.save({ ...menuDto, role: roles });
  }
}
