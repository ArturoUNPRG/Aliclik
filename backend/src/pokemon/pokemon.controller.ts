import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService, SimplifiedPokemon } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ): Promise<SimplifiedPokemon[]> {
    return this.pokemonService.findAll(+limit || 20, +offset || 0);
  }

  @Get('search')
  search(@Query('term') term: string): Promise<SimplifiedPokemon[]> {
    return this.pokemonService.search(term);
  }

  @Get('by-type')
  filterByType(@Query('type') type: string): Promise<SimplifiedPokemon[]> {
    return this.pokemonService.filterByType(type);
  }
}
