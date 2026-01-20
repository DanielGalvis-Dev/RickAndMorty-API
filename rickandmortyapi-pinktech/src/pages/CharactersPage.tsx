import { Search, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

import type { Character } from "../types";
import { CharacterCard } from "../components/CharacterCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { SkeletonCard } from "../components/SkeletonCard";
import { useDebounce } from "../hooks/useDebounce";
import { fetchCharacters } from "../services/api";

// Página de listado de personajes
export const CharactersPage: React.FC<{
  onSelectCharacter: (id: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}> = ({ onSelectCharacter, toggleFavorite, isFavorite }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de filtros
  const [nameInput, setNameInput] = useState("");
  const [status, setStatus] = useState("");
  const [species, setSpecies] = useState("");

  // Aplicar debounce a la búsqueda por nombre
  const debouncedName = useDebounce(nameInput, 400);

  // Cargar personajes cuando cambien los filtros o la página
  const loadCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCharacters(page, debouncedName, status, species);
      setCharacters(data.results);
      setTotalPages(data.info.pages);
    } catch (err) {
      setError("No se pudieron cargar los personajes");
      console.error(err);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedName, status, species]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setPage(1);
  }, [debouncedName, status, species]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filtros */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Buscar personajes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda por nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Buscar por nombre"
              />
            </div>
          </div>

          {/* Filtro de estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Filtrar por estado"
            >
              <option value="">Todos</option>
              <option value="alive">Vivo</option>
              <option value="dead">Muerto</option>
              <option value="unknown">Desconocido</option>
            </select>
          </div>

          {/* Filtro de especie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especie
            </label>
            <input
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="Ej: Human, Alien..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Filtrar por especie"
            />
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {(nameInput || status || species) && (
          <button
            onClick={() => {
              setNameInput("");
              setStatus("");
              setSpecies("");
            }}
            className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer"
          >
            <X size={16} />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadCharacters} />
      ) : characters.length === 0 ? (
        <EmptyState
          message="No se encontraron personajes con esos criterios"
          action={() => {
            setNameInput("");
            setStatus("");
            setSpecies("");
          }}
          actionLabel="Limpiar filtros"
        />
      ) : (
        <>
          {/* Grid de personajes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isFavorite={isFavorite(character.id)}
                onToggleFavorite={() => toggleFavorite(character.id)}
                onClick={() => onSelectCharacter(character.id)}
              />
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <span className="text-gray-700 font-medium">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};
