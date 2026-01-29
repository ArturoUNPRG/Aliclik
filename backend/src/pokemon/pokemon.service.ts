import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

// --- INTERFACES INTERNAS ---
interface PokeResult {
  name: string;
  url: string;
}

interface PokeApiResponse {
  results: PokeResult[];
}

interface PokeTypeResponse {
  pokemon: {
    pokemon: PokeResult;
  }[];
}

interface PokeDetailResponse {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
}

// --- INTERFAZ EXPORTADA ---
export interface SimplifiedPokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: { name: string; value: number }[];
  abilities: string[];
}

@Injectable()
export class PokemonService {
  private readonly POKE_API = 'https://pokeapi.co/api/v2/pokemon';
  private readonly TYPE_API = 'https://pokeapi.co/api/v2/type';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // --- OBTENER LISTA PAGINADA ---
  async findAll(limit = 20, offset = 0): Promise<SimplifiedPokemon[]> {
    void this.indexMasterListInBackground();

    const cacheKey = `pokemon_list_${limit}_${offset}`;

    const cached = await this.cacheManager.get<SimplifiedPokemon[]>(cacheKey);
    if (cached) {
      console.log(
        `[CACHE HIT] Recuperando lista ${offset}-${offset + limit} de memoria.`,
      );
      return cached;
    }

    try {
      console.log(
        `[API CALL] Descargando lista ${offset}-${offset + limit} de Internet...`,
      );
      const { data } = await firstValueFrom(
        this.httpService.get<PokeApiResponse>(
          `${this.POKE_API}?limit=${limit}&offset=${offset}`,
        ),
      );

      const detailedPokemon = await this.fetchDetails(data.results);
      await this.cacheManager.set(cacheKey, detailedPokemon, 300000);

      return detailedPokemon;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error conectando con PokeAPI');
    }
  }

  // --- BÚSQUEDA INTELIGENTE ---
  async search(term: string): Promise<SimplifiedPokemon[]> {
    const cleanTerm = term.toLowerCase().trim();

    let allPokemon =
      await this.cacheManager.get<PokeResult[]>('all_pokemon_names');

    if (!allPokemon) {
      console.log('[SEARCH] Indice no listo. Forzando descarga...');
      await this.indexMasterListInBackground(true);
      allPokemon =
        await this.cacheManager.get<PokeResult[]>('all_pokemon_names');
    } else {
      console.log('[SEARCH] Buscando en cache local (Indexado)...');
    }

    if (!allPokemon) return [];

    const matches = allPokemon
      .filter((p) => p.name.includes(cleanTerm))
      .slice(0, 20);

    return this.fetchDetails(matches);
  }

  // --- NUEVO: FILTRADO POR TIPO (REAL) ---
  async filterByType(type: string): Promise<SimplifiedPokemon[]> {
    const cleanType = type.toLowerCase();
    const cacheKey = `type_filter_${cleanType}`;

    const cached = await this.cacheManager.get<SimplifiedPokemon[]>(cacheKey);
    if (cached) return cached;

    try {
      // Usamos la interfaz PokeTypeResponse para evitar 'unsafe'
      const { data } = await firstValueFrom(
        this.httpService.get<PokeTypeResponse>(`${this.TYPE_API}/${cleanType}`),
      );

      // Mapeamos de forma segura gracias a la interfaz
      const rawList = data.pokemon.map((p) => p.pokemon).slice(0, 20);

      const detailedPokemon = await this.fetchDetails(rawList);
      await this.cacheManager.set(cacheKey, detailedPokemon, 300000);

      return detailedPokemon;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // --- LOGICA DE SEGUNDO PLANO ---
  private async indexMasterListInBackground(waitForIt = false) {
    const exists =
      await this.cacheManager.get<PokeResult[]>('all_pokemon_names');
    if (exists) return;

    console.log('[BACKGROUND] Iniciando descarga de Lista Maestra...');

    const task = async () => {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<PokeApiResponse>(`${this.POKE_API}?limit=10000`),
        );
        await this.cacheManager.set(
          'all_pokemon_names',
          data.results,
          86400000,
        );
        console.log(
          '[BACKGROUND] Lista Maestra (1300+) indexada correctamente.',
        );
      } catch (error) {
        console.error('[BACKGROUND ERROR]', error);
      }
    };

    if (waitForIt) {
      await task();
    } else {
      void task();
    }
  }

  // --- HELPER PRIVADO ---
  private async fetchDetails(
    basicList: PokeResult[],
  ): Promise<SimplifiedPokemon[]> {
    const promises = basicList.map(async (p) => {
      const cachedDetail = await this.cacheManager.get<SimplifiedPokemon>(
        p.url,
      );
      if (cachedDetail) return cachedDetail;

      try {
        const { data } = await firstValueFrom(
          this.httpService.get<PokeDetailResponse>(p.url),
        );

        const simplified: SimplifiedPokemon = {
          id: data.id,
          name: data.name,
          types: data.types,
          height: data.height,
          weight: data.weight,
          sprites: {
            other: {
              'official-artwork': {
                front_default:
                  data.sprites.other['official-artwork'].front_default,
              },
            },
          },
          stats: data.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          abilities: data.abilities.map((a) => a.ability.name),
        };

        await this.cacheManager.set(p.url, simplified, 3600000);
        return simplified;
      } catch {
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((p): p is SimplifiedPokemon => p !== null);
  }
}
