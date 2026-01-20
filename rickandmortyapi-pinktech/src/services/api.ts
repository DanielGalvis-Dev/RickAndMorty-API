// SERVICIOS API

import type { ApiResponse, Character, Episode } from "../types";



export const API_BASE = "https://rickandmortyapi.com/api";

// Servicio para obtener personajes con filtros y paginación
export const fetchCharacters = async (
  page: number = 1,
  name: string = "",
  status: string = "",
  species: string = "",
): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (name) params.append("name", name);
  if (status) params.append("status", status);
  if (species) params.append("species", species);

  const response = await fetch(`${API_BASE}/character?${params}`);
  if (!response.ok) throw new Error("Error fetching characters");
  return response.json();
};

// Servicio para obtener un personaje específico
export const fetchCharacter = async (id: string): Promise<Character> => {
  const response = await fetch(`${API_BASE}/character/${id}`);
  if (!response.ok) throw new Error("Character not found");
  return response.json();
};

// Servicio para obtener múltiples episodios de forma eficiente
export const fetchEpisodes = async (
  episodeUrls: string[],
): Promise<Episode[]> => {
  const ids = episodeUrls.map((url) => url.split("/").pop()).join(",");
  const response = await fetch(`${API_BASE}/episode/${ids}`);
  if (!response.ok) throw new Error("Error fetching episodes");
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};
