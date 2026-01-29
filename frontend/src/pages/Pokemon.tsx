import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Modal } from '../components/ui/Modal';
import { 
  Search, Gamepad2, Loader2,
  Sparkles, Filter, Grid3x3, LayoutGrid, Grid, CloudLightning, Activity, Zap 
} from 'lucide-react';

// --- INTERFACES ---
interface PokemonDetails {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
  abilities: string[];
}

// --- DICCIONARIOS ---
const typeTranslations: Record<string, string> = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua',
  electric: 'Eléctrico', grass: 'Planta', ice: 'Hielo',
  fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra',
  flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
  rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón',
  steel: 'Acero', fairy: 'Hada', dark: 'Siniestro'
};

const statTranslations: Record<string, string> = {
  hp: 'PS', attack: 'Ataque', defense: 'Defensa',
  'special-attack': 'Atq. Esp', 'special-defense': 'Def. Esp', speed: 'Velocidad'
};

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-300',
  fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-600',
  flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-purple-800', dragon: 'bg-indigo-600',
  steel: 'bg-gray-500', fairy: 'bg-pink-300', dark: 'bg-gray-800'
};

const pokemonTypes = Object.keys(typeTranslations);

export default function PokemonPage() {
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [gridCols, setGridCols] = useState<3 | 4 | 5>(5); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); 
  const [isSearching, setIsSearching] = useState(false); // Sirve para búsqueda y filtros

  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  
  const LIMIT = 20;

  // --- CARGA NORMAL  ---
  const loadPokemon = useCallback(async (reset = false) => {
    if (isSearching && !reset) return;
    
    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const { data } = await api.get(`/pokemon?limit=${LIMIT}&offset=${currentOffset}`);
      
      if (reset) {
        setPokemonList(data);
        setOffset(LIMIT);
      } else {
        setPokemonList(prev => [...prev, ...data]);
        setOffset(prev => prev + LIMIT);
      }
    } catch {
      toast.error('Error al cargar Pokémon');
    } finally {
      setLoading(false);
    }
  }, [offset, isSearching]);

  // --- BÚSQUEDA POR NOMBRE ---
  const performSearch = useCallback(async (term: string) => {
    setLoading(true);
    setIsSearching(true);
    setPokemonList([]); 
    setTypeFilter('');

    try {
      const { data } = await api.get(`/pokemon/search?term=${term}`);
      if (Array.isArray(data) && data.length === 0) {
        toast('No se encontraron coincidencias', { icon: '🔍' });
      }
      setPokemonList(data);
    } catch {
      toast.error('Error en la búsqueda');
      setPokemonList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- NUEVO: FILTRADO POR TIPO (BACKEND) ---
  const handleTypeChange = async (newType: string) => {
    setTypeFilter(newType);
    setSearchTerm('');

    if (!newType) {
      setIsSearching(false);
      loadPokemon(true);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    setPokemonList([]);

    try {
      const { data } = await api.get(`/pokemon/by-type?type=${newType}`);
      setPokemonList(data);
      if (data.length === 0) toast('No hay Pokémon de este tipo', { icon: 'info' });
    } catch {
      toast.error('Error al filtrar por tipo');
    } finally {
      setLoading(false);
    }
  };

  // --- DEBOUNCE BÚSQUEDA ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        performSearch(searchTerm);
      } else if (isSearching && !typeFilter) {
        // Solo reseteamos si no hay filtro de tipo activo
        setIsSearching(false);
        loadPokemon(true);
      }
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Carga Inicial
  useEffect(() => {
    loadPokemon(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGridClass = () => {
    switch(gridCols) {
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Catálogo Pokémon <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">API Caché</span>
          </h1>
          <p className="text-sm text-gray-500">Explorador de la Pokédex Nacional</p>
        </div>
        <div className="flex gap-4 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
           <div className="flex items-center gap-2">
             <CloudLightning className="h-4 w-4 text-yellow-500" />
             <span>Estado: <strong>Conectado</strong></span>
           </div>
           <div className="w-px h-4 bg-gray-300"></div>
           <span>Visibles: <strong>{pokemonList.length}</strong></span>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-end lg:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full lg:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre" 
            className="pl-10 pr-12 block w-full rounded-lg border-gray-300 bg-gray-50 border py-2 text-sm focus:border-brand focus:ring-brand outline-none transition-all"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            disabled={!!typeFilter} // Desactivar si hay filtro de tipo
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-red-500 hover:text-red-700 font-bold">X</button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* SELECTOR DE TIPO */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-400" />
            <select className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-brand focus:border-brand block w-full sm:w-40 p-2 outline-none capitalize"
              value={typeFilter} 
              onChange={(e) => handleTypeChange(e.target.value)}
              disabled={!!searchTerm}
            >
              <option value="">Todos los tipos</option>
              {pokemonTypes.map(key => (
                <option key={key} value={key}>
                  {typeTranslations[key]}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
             <button onClick={() => setGridCols(3)} className={`p-1.5 rounded-md ${gridCols === 3 ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}><Grid3x3 className="h-4 w-4" /></button>
             <button onClick={() => setGridCols(4)} className={`p-1.5 rounded-md ${gridCols === 4 ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}><Grid className="h-4 w-4" /></button>
             <button onClick={() => setGridCols(5)} className={`p-1.5 rounded-md ${gridCols === 5 ? 'bg-white shadow text-gray-800' : 'text-gray-400'}`}><LayoutGrid className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar">
        {pokemonList.length === 0 && !loading ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
             <Gamepad2 className="h-16 w-16 text-gray-300 mb-4" />
             <p className="text-gray-500 text-lg">No se encontraron Pokémon</p>
           </div>
        ) : (
          <div className={`grid gap-6 ${getGridClass()}`}>
            {pokemonList.map((poke) => (
              <div key={poke.id} onClick={() => setSelectedPokemon(poke)}
                className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden h-[280px] flex flex-col transform hover:-translate-y-1">
                <div className="flex justify-between items-center z-10">
                  <span className="text-xs font-bold text-gray-400 group-hover:text-brand transition-colors">#{poke.id.toString().padStart(3, '0')}</span>
                  {poke.types[0] && <div className={`h-2 w-2 rounded-full ${typeColors[poke.types[0].type.name]}`}></div>}
                </div>
                <div className="relative flex-1 flex items-center justify-center my-2">
                  <img src={poke.sprites.other['official-artwork'].front_default} alt={poke.name} className="h-32 w-32 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300 z-10" loading="lazy" />
                  <div className="absolute inset-0 m-auto h-32 w-32 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors -z-0"></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20">
                     <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">Ver Detalles</span>
                  </div>
                </div>
                <div className="mt-auto z-10 text-center">
                  <h3 className="text-lg font-bold text-gray-800 capitalize mb-2 group-hover:text-brand transition-colors">{poke.name}</h3>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {poke.types.map((t) => (
                      <span key={t.type.name} className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm ${typeColors[t.type.name] || 'bg-gray-400'}`}>
                        {typeTranslations[t.type.name] || t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border border-gray-100 animate-bounce-slow">
              <Loader2 className="h-5 w-5 animate-spin text-brand" /><span className="text-sm font-medium text-gray-600">Procesando...</span>
            </div>
          </div>
        )}

        {!loading && !isSearching && !typeFilter && pokemonList.length > 0 && (
          <div className="flex justify-center py-8">
            <button onClick={() => loadPokemon()} className="group flex items-center gap-2 bg-white text-gray-700 hover:text-white hover:bg-brand px-8 py-3 rounded-full border border-gray-300 hover:border-brand hover:shadow-xl transition-all duration-300 active:scale-95">
              <Sparkles className="h-4 w-4 text-yellow-400 group-hover:text-white" /><span className="font-bold text-sm">Cargar más pokemones</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal isOpen={!!selectedPokemon} onClose={() => setSelectedPokemon(null)} title="Información de Pokémon">
         {selectedPokemon && (
           <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className={`h-32 w-32 rounded-full flex items-center justify-center ${typeColors[selectedPokemon.types[0]?.type.name] || 'bg-gray-200'} bg-opacity-20`}>
                   <img src={selectedPokemon.sprites.other['official-artwork'].front_default} className="h-28 w-28 object-contain drop-shadow-xl" alt={selectedPokemon.name} />
                </div>
                <h2 className="text-2xl font-bold capitalize mt-4 text-gray-800">{selectedPokemon.name}</h2>
                <div className="flex gap-2 mt-2">
                   {selectedPokemon.types.map(t => (
                      <span key={t.type.name} className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${typeColors[t.type.name]}`}>
                        {typeTranslations[t.type.name] || t.type.name}
                      </span>
                   ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <span className="text-xs text-gray-500 uppercase font-bold">Altura</span>
                    <p className="text-lg font-bold text-gray-800">{selectedPokemon.height / 10} m</p>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <span className="text-xs text-gray-500 uppercase font-bold">Peso</span>
                    <p className="text-lg font-bold text-gray-800">{selectedPokemon.weight / 10} kg</p>
                 </div>
              </div>
              <div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Estadísticas Base
                 </h3>
                 <div className="space-y-3">
                    {selectedPokemon.stats.map(stat => (
                       <div key={stat.name} className="flex items-center gap-3 text-sm">
                          <span className="w-24 capitalize font-medium text-gray-600">
                            {statTranslations[stat.name] || stat.name}
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${stat.value > 100 ? 'bg-green-500' : stat.value > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(stat.value, 100)}%` }}></div>
                          </div>
                          <span className="w-8 text-right font-bold text-gray-700">{stat.value}</span>
                       </div>
                    ))}
                 </div>
              </div>
              <div>
                 <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Habilidades
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {selectedPokemon.abilities.map(ab => (
                       <span key={ab} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold capitalize border border-blue-100">
                          {ab.replace('-', ' ')}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
         )}
      </Modal>
    </div>
  );
}