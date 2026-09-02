import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Res, Req, Patch, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompletarPerfilDto } from './dto/completar-perfil.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return {
      message: 'Login exitoso',
      user: result.user,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      message: 'Sesión cerrada',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-only')
  adminOnly(@CurrentUser() user: any) {
    return { message: 'You have admin access', user };
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req: Request) {
    // This route redirects to Google for authentication
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.authService.googleLogin(req);

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.redirect('http://localhost:3000/marketplace');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('completar-perfil')
  async completarPerfil(
    @CurrentUser() user: any,
    @Body() body: CompletarPerfilDto,
  ) {
    return this.authService.completarPerfil(user.id, body);
  }
}
