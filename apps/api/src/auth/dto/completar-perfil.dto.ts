import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CompletarPerfilDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsString()
  @IsNotEmpty()
  departamento!: string;

  @IsString()
  @IsNotEmpty()
  municipio!: string;
}
