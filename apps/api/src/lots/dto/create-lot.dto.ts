import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateLotDto {
  @IsString()
  nombre!: string;

  @IsArray()
  @IsString({ each: true })
  animalIds!: string[];

  @IsOptional()
  @IsNumber()
  precio?: number;

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
