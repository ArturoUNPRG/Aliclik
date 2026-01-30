// backend/src/auth/auth.controller.ts

import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Validamos credenciales
    const validUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!validUser) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Devolver el token
    return this.authService.login(validUser);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
