import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLotDto {
  @IsString()
  nombre!: string;

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

  @IsString()
  departamento!: string;

  @IsString()
  municipio!: string;

  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  foto_url?: string;
}
