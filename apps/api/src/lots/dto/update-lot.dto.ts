import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLotDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  animalIds?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  precio?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  peso_promedio?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  peso_total?: number;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  municipio?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  foto_url?: string;

  @IsOptional()
  @IsString()
  categoria?: string;
}
