// backend/src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface UserPayload {
  id: number;
  email: string;
  password?: string;
  name?: string | null;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Validar que el usuario existe y la contraseña coincide
  async validateUser(email: string, pass: string): Promise<UserPayload | null> {
    const user = await this.usersService.findByEmail(email);
    // Verificamos si existe el usuario y si tiene password
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as UserPayload;
    }
    return null;
  }

  // 2. Generar el Token JWT
  login(user: UserPayload) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
