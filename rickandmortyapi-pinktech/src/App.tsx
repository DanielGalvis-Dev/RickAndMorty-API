// APP PRINCIPAL

import { Home, Heart } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "./hooks/useFavorites";
import { CharacterDetailPage } from "./pages/CharacterDetailPage";
import { CharactersPage } from "./pages/CharactersPage";
import { FavoritesPage } from "./pages/FavoritePage";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "characters" | "detail" | "favorites"
  >("characters");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  );
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Navegación entre páginas
  const navigateToCharacters = () => setCurrentPage("characters");
  const navigateToFavorites = () => setCurrentPage("favorites");
  const navigateToDetail = (id: number) => {
    setSelectedCharacterId(id.toString());
    setCurrentPage("detail");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header/Navigation */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">
              Rick & Morty API - PinkTech
            </h1>
            <nav className="flex gap-4">
              <button
                onClick={navigateToCharacters}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentPage === "characters" || currentPage === "detail"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Ir a personajes"
              >
                <Home size={20} />
                Personajes
              </button>
              <button
                onClick={navigateToFavorites}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative cursor-pointer ${
                  currentPage === "favorites"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Ir a favoritos"
              >
                <Heart size={20} />
                Favoritos
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido de la página actual */}
      <main>
        {currentPage === "characters" && (
          <CharactersPage
            onSelectCharacter={navigateToDetail}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}
        {currentPage === "detail" && selectedCharacterId && (
          <CharacterDetailPage
            characterId={selectedCharacterId}
            onBack={navigateToCharacters}
            isFavorite={isFavorite(parseInt(selectedCharacterId))}
            toggleFavorite={() => toggleFavorite(parseInt(selectedCharacterId))}
          />
        )}
        {currentPage === "favorites" && (
          <FavoritesPage
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onSelectCharacter={navigateToDetail}
            onExplore={navigateToCharacters}
          />
        )}
      </main>
    </div>
  );
};

export default App;
