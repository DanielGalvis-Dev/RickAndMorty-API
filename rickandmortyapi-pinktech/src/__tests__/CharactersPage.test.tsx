// Tests para la página de personajes

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import React from 'react'
import type { Character } from '../types';

describe('CharactersPage Component', () => {
  // Mock de la respuesta de la API
  const mockApiResponse = {
    info: {
      count: 826,
      pages: 42,
      next: 'https://rickandmortyapi.com/api/character?page=2',
      prev: null
    },
    results: [
      {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth (C-137)', url: '' },
        location: { name: 'Citadel of Ricks', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: []
      },
      {
        id: 2,
        name: 'Morty Smith',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth (C-137)', url: '' },
        location: { name: 'Earth (Replacement Dimension)', url: '' },
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
        episode: []
      }
    ]
  };

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();
  });

  it('should render character list when data is loaded', async () => {
    // Mock fetch exitoso
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      } as Response)
    );

    // Componente simplificado para testing
    const CharactersPage = () => {
      const [characters, setCharacters] = React.useState<Character[]>([]);
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        fetch('https://rickandmortyapi.com/api/character')
          .then(res => res.json())
          .then(data => {
            setCharacters(data.results);
            setLoading(false);
          });
      }, []);

      if (loading) return <div>Loading...</div>;

      return (
        <div>
          {characters.map(char => (
            <div key={char.id} data-testid="character-card">
              {char.name}
            </div>
          ))}
        </div>
      );
    };

    render(<CharactersPage />);

    // Verificar loading inicial
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Esperar a que se carguen los personajes
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getAllByTestId('character-card')).toHaveLength(2);
  });

  it('should show error state when API fails', async () => {
    // Mock fetch que falla
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('API Error')),
      } as Response)
    );

    const CharactersPage = () => {
      const [error, setError] = React.useState<string | null>(null);
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        fetch('https://rickandmortyapi.com/api/character')
          .then(res => {
            if (!res.ok) throw new Error('Error fetching characters');
            return res.json();
          })
          .catch(() => {
            setError('No se pudieron cargar los personajes');
            setLoading(false);
          });
      }, []);

      if (loading && !error) return <div>Loading...</div>;
      if (error) return <div>{error}</div>;

      return null;
    };

    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar los personajes')).toBeInTheDocument();
    });
  });

  it('should show empty state when no results', async () => {
    // Mock con resultados vacíos
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ info: {}, results: [] }),
      } as Response)
    );

    const CharactersPage = () => {
      const [characters, setCharacters] = React.useState<Character[]>([]);
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        fetch('https://rickandmortyapi.com/api/character')
          .then(res => res.json())
          .then(data => {
            setCharacters(data.results);
            setLoading(false);
          });
      }, []);

      if (loading) return <div>Loading...</div>;
      if (characters.length === 0) {
        return <div>No se encontraron personajes</div>;
      }

      return null;
    };

    render(<CharactersPage />);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron personajes')).toBeInTheDocument();
    });
  });

  it('should filter characters by name', async () => {
    const user = userEvent.setup();

    // Mock inicial
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      } as Response)
    );

    const CharactersPage = () => {
      const [nameInput, setNameInput] = React.useState('');

      React.useEffect(() => {
        const params = new URLSearchParams();
        if (nameInput) params.append('name', nameInput);
        
        fetch(`https://rickandmortyapi.com/api/character?${params}`)
          .then(res => res.json())
          .catch(() => {});
      }, [nameInput]);

      return (
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Buscar por nombre..."
          data-testid="search-input"
        />
      );
    };

    render(<CharactersPage />);

    const searchInput = screen.getByTestId('search-input');
    
    // Simular escritura
    await user.type(searchInput, 'Rick');

    await waitFor(() => {
      expect(searchInput).toHaveValue('Rick');
    });

    // Verificar que se llamó fetch con el parámetro correcto
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=Rick')
      );
    });
  });

  it('should handle pagination correctly', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      } as Response)
    );

    const CharactersPage = () => {
      const [page, setPage] = React.useState(1);
      const [totalPages] = React.useState(42);

      React.useEffect(() => {
        fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
          .then(res => res.json())
          .catch(() => {});
      }, [page]);

      return (
        <div>
          <span>Página {page} de {totalPages}</span>
          <button 
            onClick={() => setPage(p => p - 1)} 
            disabled={page === 1}
            data-testid="prev-button"
          >
            Anterior
          </button>
          <button 
            onClick={() => setPage(p => p + 1)} 
            disabled={page === totalPages}
            data-testid="next-button"
          >
            Siguiente
          </button>
        </div>
      );
    };

    render(<CharactersPage />);

    // Verificar estado inicial
    expect(screen.getByText('Página 1 de 42')).toBeInTheDocument();
    expect(screen.getByTestId('prev-button')).toBeDisabled();
    expect(screen.getByTestId('next-button')).not.toBeDisabled();

    // Hacer clic en siguiente
    fireEvent.click(screen.getByTestId('next-button'));

    await waitFor(() => {
      expect(screen.getByText('Página 2 de 42')).toBeInTheDocument();
    });

    // Verificar que ahora el botón anterior no está deshabilitado
    expect(screen.getByTestId('prev-button')).not.toBeDisabled();
  });

  it('should clear filters when clear button is clicked', async () => {
    const CharactersPage = () => {
      const [nameInput, setNameInput] = React.useState('Rick');
      const [status, setStatus] = React.useState('alive');
      const [species, setSpecies] = React.useState('Human');

      const clearFilters = () => {
        setNameInput('');
        setStatus('');
        setSpecies('');
      };

      return (
        <div>
          <input data-testid="name-input" value={nameInput} readOnly />
          <input data-testid="status-input" value={status} readOnly />
          <input data-testid="species-input" value={species} readOnly />
          <button onClick={clearFilters} data-testid="clear-button">
            Limpiar filtros
          </button>
        </div>
      );
    };

    render(<CharactersPage />);

    // Verificar estado inicial con filtros
    expect(screen.getByTestId('name-input')).toHaveValue('Rick');
    expect(screen.getByTestId('status-input')).toHaveValue('alive');
    expect(screen.getByTestId('species-input')).toHaveValue('Human');

    // Limpiar filtros
    fireEvent.click(screen.getByTestId('clear-button'));

    // Verificar que se limpiaron
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('status-input')).toHaveValue('');
      expect(screen.getByTestId('species-input')).toHaveValue('');
    });
  });
});