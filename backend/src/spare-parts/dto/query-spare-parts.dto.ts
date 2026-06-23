import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SparePartStatus } from '../calculate-status';

export class QuerySparePartsDto {
  @IsOptional()
  @IsEnum(['disponible', 'bajo_stock', 'agotado'])
  status?: SparePartStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
