import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsPositive, Max, IsEnum } from 'class-validator';
import { AnimalRaza, AnimalTipo } from '@prisma/client';

export class CreateAnimalDto {
  @IsString()
  nombre!: string;

  @IsString()
  arete!: string;

  @IsEnum(AnimalRaza)
  raza!: AnimalRaza;

  @IsEnum(AnimalTipo)
  tipo!: AnimalTipo;

  @IsNumber()
  @IsPositive({ message: 'El peso debe ser mayor a 0' })
  @Max(1500, { message: 'El peso debe ser menor a 1500 kg' })
  peso!: number;

  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
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
