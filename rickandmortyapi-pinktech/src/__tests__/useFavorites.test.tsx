// Estado vacío

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Hook de favoritos para testing
const useFavorites = () => {
  const [favorites, setFavorites] = React.useState<number[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
};

describe("useFavorites Hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty favorites", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it("should add favorite", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favorites).toContain(1);
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it("should remove favorite", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(1);
    });

    expect(result.current.favorites).not.toContain(1);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("should persist favorites in localStorage", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(2);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "favorites",
      JSON.stringify([1, 2]),
    );
  });

  it("should load favorites from localStorage", () => {
    localStorage.getItem = vi.fn(() => JSON.stringify([1, 2, 3]));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([1, 2, 3]);
  });
});
