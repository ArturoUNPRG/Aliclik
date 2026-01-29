import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockHttpService = {
  get: jest.fn(),
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('PokemonService', () => {
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar datos del caché si existen', async () => {
      const cachedData = [{ name: 'bulbasaur', id: 1 }];
      mockCacheManager.get.mockResolvedValue(cachedData);
      const result = await service.findAll(20, 0);
      expect(result).toEqual(cachedData);
      expect(mockHttpService.get).not.toHaveBeenCalled();
    });
  });
});
