import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  nombre!: string;

  @IsString()
  arete!: string;

  @IsString()
  raza!: string;

  @IsNumber()
  peso!: number;

  @IsNumber()
  precio!: number;

  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  foto_url?: string;

  @IsOptional()
  @IsString()
  loteId?: string;

  @IsOptional()
  @IsBoolean()
  en_periodo_retiro?: boolean;

  @IsOptional()
  @IsString()
  medicamento_retiro?: string;

  @IsOptional()
  @IsDateString()
  fecha_limite_retiro?: string;
}
