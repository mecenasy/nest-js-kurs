import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { Role } from 'src/user/entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role])],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
