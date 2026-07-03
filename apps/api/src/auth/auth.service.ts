import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ...rest } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare user data payload
    const userData: any = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      nombre: rest.nombre,
      departamento: rest.departamento,
      municipio: rest.municipio,
      telefono: rest.telefono,
    };

    // If isEmpresa is true, add nested write for empresa
    if (rest.isEmpresa && rest.nit && rest.razon_social) {
      userData.empresa = {
        create: {
          nit: rest.nit,
          razon_social: rest.razon_social,
        }
      };
    }

    // Create user with all fields and possible nested empresa
    const user = await this.prisma.user.create({
      data: userData,
    });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email (or modify to search by nombre as requested, but email is safer and standard)
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { nombre: email }, // Also search by nombre as per user request
        ]
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }
}
