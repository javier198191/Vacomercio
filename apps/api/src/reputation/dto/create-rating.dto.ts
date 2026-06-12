import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  calificadorId!: string;

  @IsString()
  saleId!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  estrellas!: number;

  @IsString()
  criterio!: string;

  @IsOptional()
  @IsString()
  comentario?: string;
}
