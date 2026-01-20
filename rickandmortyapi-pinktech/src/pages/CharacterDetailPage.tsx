import { Loader2, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import type { Character, Episode } from "../types";
import { ErrorState } from "../components/ErrorState";
import { fetchCharacter, fetchEpisodes } from "../services/api";

// Página de detalle de personaje
export const CharacterDetailPage: React.FC<{
  characterId: string;
  onBack: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}> = ({ characterId, onBack, isFavorite, toggleFavorite }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCharacter(characterId);
        setCharacter(data);

        // Cargar episodios de forma eficiente
        if (data.episode.length > 0) {
          const episodesData = await fetchEpisodes(data.episode);
          setEpisodes(episodesData);
        }
      } catch (err) {
        setError("No se pudo cargar el personaje");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState
          message={error || "Personaje no encontrado"}
          onRetry={onBack}
        />
      </div>
    );
  }

  const statusColor = {
    Alive: "text-green-600",
    Dead: "text-red-600",
    unknown: "text-gray-600",
  }[character.status];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2 cursor-pointer"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Imagen del personaje */}
          <div className="md:w-1/3">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Información del personaje */}
          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{character.name}</h1>
              <button
                onClick={toggleFavorite}
                className="p-2 hover:scale-110 transition-transform cursor-pointer"
                aria-label={
                  isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                }
              >
                <Heart
                  className={
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                  }
                  size={32}
                />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <span className="font-semibold">Estado: </span>
                <span className={statusColor}>{character.status}</span>
              </div>
              <div>
                <span className="font-semibold">Especie: </span>
                {character.species}
              </div>
              <div>
                <span className="font-semibold">Género: </span>
                {character.gender}
              </div>
              <div>
                <span className="font-semibold">Origen: </span>
                {character.origin.name}
              </div>
              <div>
                <span className="font-semibold">Ubicación: </span>
                {character.location.name}
              </div>
            </div>

            {/* Lista de episodios */}
            <div>
              <h2 className="text-xl font-bold mb-3">
                Episodios ({episodes.length})
              </h2>
              <div className="max-h-64 overflow-y-auto space-y-2 cursor-">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium">{episode.name}</div>
                    <div className="text-sm text-gray-600">
                      {episode.episode}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
