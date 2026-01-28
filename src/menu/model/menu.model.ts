import { IRole } from 'src/user/model/role.model';

export enum MenuSide {
  Left = 'left',
  Right = 'right',
}

export interface IMenu {
  name: string;
  shortName?: string;
  menuSide: MenuSide;
  position: number;
  hidden?: boolean;
  link: string;
  image: string;
  role: IRole[];
}
