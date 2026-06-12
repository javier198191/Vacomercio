import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  arete?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  precio?: number;

  @IsOptional()
  @IsString()
  foto_url?: string;

  @IsOptional()
  @IsString()
  loteId?: string;

  @IsOptional()
  @IsString()
  estado?: 'DISPONIBLE' | 'EN_LOTE' | 'VENDIDO';

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
