# Rick & Morty API - PinkTech App 🚀

Aplicación web para explorar personajes de Rick and Morty usando su API oficial.

**Desarrollado por:** Daniel Galvis 
**Challenge:** PinkTech  
**Fecha:** Enero 2026

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Ejecutar Tests](#ejecutar-tests)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características Implementadas](#características-implementadas)
- [Decisiones Técnicas](#decisiones-técnicas)
- [Mejoras Futuras](#mejoras-futuras)
- [API Reference](#api-reference)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior) 
- **npm** (viene con Node.js)

## 📦 Instalación

### Paso 1: Clonar el proyecto

```bash
git clone https://github.com/danielgalvis-dev/rickandmortyapi-pinktech.git
cd rickandmortyapi-pinktech
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Instalar dependencias adicionales

```bash
# Tailwind CSS
npm install tailwindcss @tailwindcss/vite

# Lucide React (iconos)
npm install lucide-react

# React Router DOM
npm install react-router-dom

# Testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

---

## 📁 Estructura del Proyecto

```
rickandmortyapi-pinktech/
├── public/
│   └── vite.svg
├── src/
│   ├── __tests__/
│   │   ├── CharacterCard.test.tsx
│   │   ├── CharactersPage.test.tsx
│   │   └── useFavorites.test.tsx
│   ├── components/
│   │   ├── CharacterCard.tsx        # Card de personaje
│   │   ├── EmptyState.tsx           # Estado vacío
│   │   ├── ErrorState.tsx           # Estado de error
│   │   └── SkeletonCard.tsx         # Skeleton loader
│   ├── hooks/
│   │   ├── useDebounce.ts           # Hook de debounce
│   │   └── useFavorites.ts          # Hook de favoritos
│   ├── pages/
│   │   ├── CharacterDetailPage.tsx  # Detalle de personaje
│   │   ├── CharactersPage.tsx       # Listado y filtros
│   │   └── FavoritesPage.tsx        # Página de favoritos
│   ├── services/
│   │   └── api.ts                   # Servicios de API
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── App.css                      
│   ├── App.tsx                      
│   ├── index.css                    
│   ├── main.tsx                     
│   └── setupTests.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── README.md
```

---

## 🚀 Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Modo Producción

```bash
# Compilar
npm run build

# Previsualizar build
npm run preview
```
---

## 🧪 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología       | Versión   | Propósito         |
|------------------|-----------|-------------------|
| React            | ^19.2.0   |  UI               |
| TypeScript       | ^5.9.3    | Tipado estático   |
| Vite             | ^7.2.4    | Build tool        |
| Tailwind CSS     | ^4.1.18   | Estilos           |
| React Router DOM | ^7.12.0   | Routing           |
| Lucide React     | ^0.562.0  | Iconos            |
| Vitest           | ^4.0.17   | Testing framework |
| Testing Library  | ^14.2.0   | Testing utilities |

---

## ✨ Características Implementadas

### 1. Listado de Personajes (/)
- ✅ Grid responsivo con cards
- ✅ Información: imagen, nombre, especie, estado
- ✅ Paginación (next/prev)
- ✅ Loading states (skeletons)
- ✅ Error handling con retry
- ✅ Empty state

**Endpoint:** `GET /character?page=1`

### 2. Búsqueda y Filtros
- ✅ Búsqueda por nombre (debounce 400ms)
- ✅ Filtro por status (alive/dead/unknown)
- ✅ Filtro por species (texto libre)
- ✅ URL reflejada (simulada)
- ✅ Botón limpiar filtros

**Endpoint:** `GET /character/?name=rick&status=alive&page=1`

### 3. Detalle de Personaje (/character/:id)
- ✅ Información completa del personaje
- ✅ Lista de episodios con nombres y códigos
- ✅ Carga eficiente de episodios: `/episode/[1,2,3]`
- ✅ Botón agregar/quitar favoritos
- ✅ Navegación de vuelta

**Endpoints:**
- `GET /character/:id`
- `GET /episode/[1,2,3]`

### 4. Favoritos (/favorites)
- ✅ Listado de personajes favoritos
- ✅ Persistencia en localStorage
- ✅ Quitar favoritos desde la lista
- ✅ Empty state con CTA "Explorar personajes"
- ✅ Contador en header

---

## 🎯 Decisiones Técnicas

### 1. Debounce vs Botón de Búsqueda
**Decisión:** Debounce de 400ms

**Justificación:**
- Mejor UX: feedback inmediato al usuario
- Reduce requests innecesarios (espera a que el usuario termine de escribir)
- Más moderno y esperado en aplicaciones actuales
- Balance entre responsividad (300ms sería muy rápido) y delay perceptible (500ms+ se siente lento)

### 2. Carga de Episodios
**Decisión:** Batch request `/episode/[1,2,3]`

**Justificación:**
- Opción A elegida: más eficiente
- Reduce de N requests a 1 solo request
- Mejor performance y tiempo de carga
- Menor carga en el servidor de la API
- La API de Rick & Morty soporta esta funcionalidad nativamente

### 3. Arquitectura de Componentes
**Decisión:** Separación en componentes, pages, services, hooks

**Justificación:**
- **Componentes:** Reutilizables y testables (`CharacterCard`, `SkeletonCard`)
- **Pages:** Lógica de negocio y estado de cada vista
- **Services:** Centraliza llamadas a la API (fácil de modificar/mockear)
- **Hooks:** Lógica reutilizable (`useFavorites`, `useDebounce`)
- Facilita mantenimiento y escalabilidad

### 4. Estado vs React Query/SWR
**Decisión:** useState + useEffect

**Justificación:**
- Suficiente para el scope del proyecto
- Menos dependencias = menor bundle size
- Más control sobre el comportamiento
- Para producción consideraría React Query para:
  - Cache automático
  - Revalidación en background
  - Deduplicación de requests

### 5. Navegación Simulada vs React Router
**Decisión:** Estado interno (simulada)

**Justificación:**
- Artifact no soporta múltiples archivos inicialmente
- Demostración del concepto funcional
- En proyecto real usaría React Router DOM con:
```tsx
<Routes>
  <Route path="/" element={<CharactersPage />} />
  <Route path="/characters/:id" element={<CharacterDetailPage />} />
  <Route path="/favorites" element={<FavoritesPage />} />
</Routes>
```

### 6. localStorage vs Backend
**Decisión:** localStorage para favoritos

**Justificación:**
- Requerimiento del challenge
- Apropiado para datos del lado del cliente
- No requiere autenticación
- Funciona offline
- En producción con usuarios: backend + sync

### 7. TypeScript Strict Mode
**Decisión:** Tipado completo

**Justificación:**
- Detecta errores en tiempo de desarrollo
- Mejor autocompletado en IDE
- Documentación integrada
- Refactoring más seguro

---

## 🔮 Mejoras Futuras

### Con más tiempo implementaría:

#### 1. Cache y Performance
- ✨ **React Query o SWR**
  - Cache automático de personajes
  - Revalidación en background
  - Optimistic updates para favoritos
  - Deduplicación de requests

```tsx
// Ejemplo con React Query
const { data, isLoading } = useQuery({
  queryKey: ['character', id],
  queryFn: () => fetchCharacter(id),
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

#### 2. Infinite Scroll
- Reemplazar paginación tradicional
- Mejor UX en móvil
- Usar Intersection Observer API

```tsx
const { ref, inView } = useInView();

useEffect(() => {
  if (inView && hasNextPage) {
    fetchNextPage();
  }
}, [inView]);
```

#### 3. Testing Completo
- **Unit tests:**
  - Todos los hooks personalizados
  - Funciones de servicios
  - Utilidades
- **Integration tests:**
  - Flujos completos de usuario
  - Interacción entre componentes
- **E2E tests con Playwright:**
  - Flujo de búsqueda completo
  - Agregar/quitar favoritos
  - Navegación entre páginas

```tsx
// Ejemplo de test
describe('Favorites Flow', () => {
  it('should add and persist favorite', async () => {
    render(<App />);
    const card = screen.getByText('Rick Sanchez');
    const favoriteBtn = within(card).getByLabelText('Agregar a favoritos');
    
    await userEvent.click(favoriteBtn);
    
    expect(localStorage.getItem('favorites')).toContain('1');
  });
});
```

#### 4. Optimizaciones
- **Code splitting** por ruta
- **Lazy loading** de imágenes
- **Virtual scrolling** para listas largas
- **Service Worker** para offline support
- **Image optimization** con WebP

#### 5. Features Adicionales
- 🔍 **Búsqueda avanzada:**
  - Múltiples filtros simultáneos
  - Rangos de episodios
  - Ordenamiento personalizado
  
- 📱 **PWA:**
  - Instalable en móvil
  - Funciona offline
  - Push notifications

- 🌙 **Dark Mode:**
  - Toggle en header
  - Persistencia en localStorage

- 📊 **Analytics:**
  - Personajes más buscados
  - Favoritos populares

---

## 🔌 API Reference

### Base URL
```
https://rickandmortyapi.com/api
```

### Endpoints Utilizados

#### 1. Get All Characters
```http
GET /character
GET /character?page=2
GET /character?name=rick&status=alive
```

**Query Parameters:**
- `page` (number): Número de página
- `name` (string): Filtrar por nombre
- `status` (string): alive | dead | unknown
- `species` (string): Filtrar por especie

**Response:**
```json
{
  "info": {
    "count": 826,
    "pages": 42,
    "next": "https://rickandmortyapi.com/api/character?page=2",
    "prev": null
  },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "gender": "Male",
      "origin": { "name": "Earth (C-137)" },
      "location": { "name": "Citadel of Ricks" },
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      "episode": ["https://rickandmortyapi.com/api/episode/1"]
    }
  ]
}
```

#### 2. Get Single Character
```http
GET /character/1
```

#### 3. Get Multiple Characters
```http
GET /character/1,2,3
```

#### 4. Get Multiple Episodes
```http
GET /episode/1,2,3
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Pilot",
    "episode": "S01E01"
  }
]
```

### Manejo de Errores

La API retorna:
- **404**: Recurso no encontrado
- **500**: Error del servidor

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build           # Compila para producción
npm run preview         # Previsualiza build de producción

# Testing
npm run test            # Ejecuta tests
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Genera reporte de cobertura

# Linting
npm run lint            # Ejecuta ESLint
npm run lint:fix        # Arregla errores de linting automáticamente

```

---

## 👤 Autor

**[Daniel de Jesús Galvis Zambrano]**
- GitHub: [@DanielGalvis-Dev](https://github.com/DanielGalvis-Dev)
- Email: daniel.galvis.dev@gmail.com
- LinkedIn: [Daniel Galvis](https://linkedin.com/in/DanielGalvis-Dev)

---
