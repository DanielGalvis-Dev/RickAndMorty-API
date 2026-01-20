// Componente de tarjeta de personaje
import type { Character } from "../types";
import { Heart } from "lucide-react";

export const CharacterCard: React.FC<{
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}> = ({ character, isFavorite, onToggleFavorite, onClick }) => {
  // Determinar color del badge según el estado
  const statusColor = {
    Alive: "bg-green-500",
    Dead: "bg-red-500",
    unknown: "bg-gray-500",
  }[character.status];

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Ver detalles de ${character.name}`}
    >
      <div className="relative">
        <img
          src={character.image}
          alt={`${character.name} - ${character.species}`}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer"
          aria-label={
            isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
          }
        >
          <Heart
            className={
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }
            size={20}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">{character.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-sm text-gray-600">{character.status}</span>
        </div>
        <p className="text-sm text-gray-500">{character.species}</p>
      </div>
    </div>
  );
};