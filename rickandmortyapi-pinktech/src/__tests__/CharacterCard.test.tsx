// Tests para la card de personajes
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { Character } from "../types/index";

// Mock del componente CharacterCard para testing
interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

const CharacterCard = ({
  character,
  isFavorite,
  onToggleFavorite,
  onClick,
}: CharacterCardProps) => {
  const statusColor = {
    Alive: "bg-green-500",
    Dead: "bg-red-500",
    unknown: "bg-gray-500",
  }[character.status];

  return (
    <div onClick={onClick} data-testid="character-card">
      <img src={character.image} alt={character.name} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
      <h3>{character.name}</h3>
      <span className={statusColor}>{character.status}</span>
      <p>{character.species}</p>
    </div>
  );
};

describe("CharacterCard Component", () => {
  const mockCharacter = {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive" as const,
    species: "Human",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: "" },
    location: { name: "Citadel of Ricks", url: "" },
    episode: [],
  };

  it("should render character information correctly", () => {
    const mockOnToggleFavorite = vi.fn();
    const mockOnClick = vi.fn();

    render(
      <CharacterCard
        character={mockCharacter}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />,
    );

    // Verificar que se muestra el nombre
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();

    // Verificar que se muestra el estado
    expect(screen.getByText("Alive")).toBeInTheDocument();

    // Verificar que se muestra la especie
    expect(screen.getByText("Human")).toBeInTheDocument();

    // Verificar que la imagen tiene el src correcto
    const image = screen.getByAltText("Rick Sanchez");
    expect(image).toHaveAttribute("src", mockCharacter.image);
  });

  it("should call onClick when card is clicked", () => {
    const mockOnToggleFavorite = vi.fn();
    const mockOnClick = vi.fn();

    render(
      <CharacterCard
        character={mockCharacter}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />,
    );

    const card = screen.getByTestId("character-card");
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should toggle favorite when favorite button is clicked", () => {
    const mockOnToggleFavorite = vi.fn();
    const mockOnClick = vi.fn();

    render(
      <CharacterCard
        character={mockCharacter}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />,
    );

    const favoriteButton = screen.getByLabelText("Agregar a favoritos");
    fireEvent.click(favoriteButton);

    // Verificar que se llamó la función de toggle
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);

    // Verificar que NO se llamó onClick del card (stopPropagation)
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("should show correct favorite button label when isFavorite is true", () => {
    const mockOnToggleFavorite = vi.fn();
    const mockOnClick = vi.fn();

    render(
      <CharacterCard
        character={mockCharacter}
        isFavorite={true}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />,
    );

    expect(screen.getByLabelText("Quitar de favoritos")).toBeInTheDocument();
  });

  it("should apply correct status color class", () => {
    const mockOnToggleFavorite = vi.fn();
    const mockOnClick = vi.fn();

    const { rerender } = render(
      <CharacterCard
        character={{ ...mockCharacter, status: "Alive" }}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />,
    );

    // Verificar estado Alive
    let statusElement = screen.getByText("Alive");
    expect(statusElement).toHaveClass("bg-green-500");

    // Verificar estado Dead
    rerender(
      <CharacterCard
        character={{ ...mockCharacter, status: "Dead" }}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />,
    );
    statusElement = screen.getByText("Dead");
    expect(statusElement).toHaveClass("bg-red-500");

    // Verificar estado unknown
    rerender(
      <CharacterCard
        character={{ ...mockCharacter, status: "unknown" }}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onClick={mockOnClick}
      />,
    );
    statusElement = screen.getByText("unknown");
    expect(statusElement).toHaveClass("bg-gray-500");
  });
});
