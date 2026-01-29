import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 300000,
      max: 100,
    }),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
