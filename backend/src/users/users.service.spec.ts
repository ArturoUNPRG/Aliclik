import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      // CORRECCIÓN: Quitamos los campos null. Si son opcionales en el DTO,
      // es mejor no enviarlos o enviarlos como undefined.
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: '123',
        name: 'Test',
        role: 'USER',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      // Simulamos la respuesta de la base de datos (aquí sí pueden ser null)
      prisma.user.create.mockResolvedValue({
        id: 1,
        email: dto.email,
        name: dto.name,
        password: 'hashedPassword',
        role: dto.role,
        phone: null,
        address: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(dto.email);
      expect(result).not.toHaveProperty('password');
    });

    it('debería lanzar error si el email ya existe', async () => {
      const dto: CreateUserDto = {
        email: 'duplicado@test.com',
        password: '123',
        name: 'Test',
        role: 'USER',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'duplicado@test.com',
        name: 'Test',
        password: 'hash',
        role: 'USER',
        phone: null,
        address: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('debería retornar un usuario si existe', async () => {
      const user = {
        id: 1,
        email: 'buscado@test.com',
        name: 'Juan',
        password: 'hash',
        role: 'USER',
        phone: null,
        address: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('buscado@test.com');
      expect(result).toEqual(user);
    });

    it('debería retornar null si no existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findByEmail('inexistente@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de usuarios', async () => {
      const users = [
        {
          id: 1,
          name: 'User 1',
          email: 'u1@test.com',
          role: 'USER',
          createdAt: new Date(),
          phone: null,
          address: null,
          avatar: null,
        },
        {
          id: 2,
          name: 'User 2',
          email: 'u2@test.com',
          role: 'ADMIN',
          createdAt: new Date(),
          phone: null,
          address: null,
          avatar: null,
        },
      ];
      prisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });
});
