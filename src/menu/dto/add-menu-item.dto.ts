import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IMenu, MenuSide } from '../model/menu.model';

export class AddMenuItemDto implements Omit<IMenu, 'role'> {
  @IsOptional()
  @IsBoolean()
  hidden?: boolean | undefined;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  @IsEnum(MenuSide)
  menuSide: MenuSide;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  role: string[];
}
