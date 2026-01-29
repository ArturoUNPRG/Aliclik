import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

// 1. Simulamos el UsersService
const mockUsersService = {
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
};

// 2. Simulamos el JwtService
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // Inyectamos las dependencias falsas
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });
});
