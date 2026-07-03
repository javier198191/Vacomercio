import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsString()
  @IsNotEmpty()
  departamento!: string;

  @IsString()
  @IsNotEmpty()
  municipio!: string;

  @IsOptional()
  @IsBoolean()
  isEmpresa?: boolean;

  @IsOptional()
  @IsString()
  nit?: string;

  @IsOptional()
  @IsString()
  razon_social?: string;
}
