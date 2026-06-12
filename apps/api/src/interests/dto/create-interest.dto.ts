import { IsString, IsOptional } from 'class-validator';

export class CreateInterestDto {
  @IsString()
  compradorId!: string;

  @IsOptional()
  @IsString()
  animalId?: string;

  @IsOptional()
  @IsString()
  loteId?: string;
}
