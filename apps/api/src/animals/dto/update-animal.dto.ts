import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsPositive, Max, IsEnum } from 'class-validator';
import { AnimalRaza, AnimalTipo } from '@prisma/client';

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  arete?: string;

  @IsOptional()
  @IsEnum(AnimalRaza)
  raza?: AnimalRaza;

  @IsOptional()
  @IsEnum(AnimalTipo)
  tipo?: AnimalTipo;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'El peso debe ser mayor a 0' })
  @Max(1500, { message: 'El peso debe ser menor a 1500 kg' })
  peso?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
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
