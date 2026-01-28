import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { UserRoleId } from 'src/decorators/user-role.decorator';
import { MenuService } from './menu.service';
import { AddMenuItemDto } from './dto/add-menu-item.dto';
import { Menu } from './entity/menu.entity';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  public async getMenu(@UserRoleId() role: string): Promise<Menu[]> {
    return await this.menuService.getMenu(role);
  }

  @Post()
  @Roles('admin')
  public async addMenuItem(@Body() menuDto: AddMenuItemDto): Promise<Menu> {
    console.log('🚀 ~ MenuController ~ addMenuItem ~ menuDto:', menuDto);
    return await this.menuService.addMenuItem(menuDto);
  }
}
