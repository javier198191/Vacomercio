import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSaleDto {
  @IsOptional()
  @IsString()
  animalId?: string;

  @IsOptional()
  @IsString()
  loteId?: string;

  @IsString()
  vendedorId!: string;

  @IsOptional()
  @IsString()
  compradorId?: string;

  @IsOptional()
  @IsString()
  compradorTelefono?: string;

  @IsNumber()
  precio_final!: number;
}
