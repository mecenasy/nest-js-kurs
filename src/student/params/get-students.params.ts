import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { splitElementByComa } from 'src/decorators/helper/split-element-by-coma';

export class GetStudentsParams {
  @IsOptional()
  @Transform(splitElementByComa)
  directions: string[];

  @IsOptional()
  @Transform(splitElementByComa)
  specialties: string[];

  @IsOptional()
  @Transform(splitElementByComa)
  group: string[];

  @IsOptional()
  @Transform(splitElementByComa)
  years: string[];
}
