import { useState, useEffect } from "react";

import type { Character } from "../types";
import { CharacterCard } from "../components/CharacterCard";
import { EmptyState } from "../components/EmptyState";
import { SkeletonCard } from "../components/SkeletonCard";
import { API_BASE } from "../services/api";

// Página de favoritos
export const FavoritesPage: React.FC<{
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  onSelectCharacter: (id: number) => void;
  onExplore: () => void;
}> = ({
  favorites,
  toggleFavorite,
  isFavorite,
  onSelectCharacter,
  onExplore,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Cargar todos los favoritos de forma eficiente
        const ids = favorites.join(",");
        const response = await fetch(`${API_BASE}/character/${ids}`);
        const data = await response.json();
        setCharacters(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
        <EmptyState
          message="Aún no tienes personajes favoritos"
          action={onExplore}
          actionLabel="Explorar personajes"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Mis Favoritos ({favorites.length})
      </h1>
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
    </div>
  );
};
