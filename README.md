# renovation-cost-app

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A professional web-based calculator for interior finishing and renovation works in Poland. Users define rooms with walls and ceilings, select work types with per-unit pricing, and the application calculates total costs including VAT. Supports PDF quote export, user authentication, and full quote management.

## Features

- **Room-based cost calculation** -- define rooms with custom wall and ceiling dimensions
- **Multiple work types** -- Painting, Priming, Spackling, Floor Protection, Corner Beads, Groove Filling, Acrylic Caulking, and custom types
- **Per-unit pricing** -- area-based (m2) and length-based (mb) depending on work type
- **VAT calculation** -- 8% and 23% rates
- **PDF export** -- professional quotes in standard or table format via jsPDF
- **User authentication** -- Supabase Auth with registration and login
- **Quote management** -- save, load, edit, and delete quotes from the cloud
- **Responsive design** -- desktop and mobile
- **Animated UI** -- Framer Motion transitions

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth) |
| PDF | jsPDF |
| Animations | Framer Motion |

## Getting Started

### Prerequisites

- Node.js 18+, npm
- A Supabase project (for backend and auth)

### Installation

```bash
git clone https://github.com/selter2001/renovation-cost-app.git
cd renovation-cost-app
npm install
```

### Environment setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Running

```bash
npm run dev          # development server at http://localhost:5173
npm run build        # production build
```

## Architecture

**React 18 + TypeScript + Vite** frontend with **Supabase** backend:

```
src/
├── components/        # UI components (rooms, work types, quotes, auth)
├── hooks/             # Custom React hooks
├── lib/               # Supabase client, utilities
├── pages/             # Route-level pages
├── types/             # TypeScript definitions
└── App.tsx            # Root component with routing
```

The frontend handles room definitions, work type selection, cost computation with VAT, and PDF generation client-side. Supabase provides PostgreSQL storage, row-level security, and authentication. The UI uses shadcn/ui styled with Tailwind CSS and animated with Framer Motion.

## Author

**Wojciech Olszak** -- [github.com/selter2001](https://github.com/selter2001)

## License

This project is licensed under the MIT License.

---

# renovation-cost-app

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Licencja](https://img.shields.io/badge/Licencja-MIT-green?style=flat)

Profesjonalny kalkulator webowy do wyceny prac wykończeniowych i remontowych w Polsce. Użytkownicy definiują pomieszczenia ze ścianami i sufitami, wybierają rodzaje prac z cenami jednostkowymi, a aplikacja oblicza koszty z VAT. Eksport wycen do PDF, autoryzacja i zarządzanie kosztorysami.

## Funkcjonalności

- **Kalkulacja na podstawie pomieszczeń** -- definiowanie pomieszczeń z wymiarami ścian i sufitów
- **Wiele rodzajów prac** -- Malowanie, Gruntowanie, Szpachlowanie, Zabezpieczenie podłogi, Narożniki, Wypełnianie bruzd, Akryl oraz typy niestandardowe
- **Ceny jednostkowe** -- wycena powierzchniowa (m2) i długościowa (mb)
- **Obliczanie VAT** -- stawki 8% i 23%
- **Eksport PDF** -- kosztorysy w formacie standardowym lub tabelarycznym (jsPDF)
- **Autoryzacja** -- rejestracja i logowanie przez Supabase Auth
- **Zarządzanie kosztorysami** -- zapis, odczyt, edycja i usuwanie wycen z chmury
- **Responsywny design** -- komputer i urządzenia mobilne
- **Animowany interfejs** -- płynne przejścia Framer Motion

## Stos technologiczny

| Komponent | Technologia |
|-----------|-------------|
| Frontend | React 18, TypeScript, Vite |
| Stylizacja | Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth) |
| PDF | jsPDF |
| Animacje | Framer Motion |

## Uruchomienie

### Wymagania

- Node.js 18+, npm
- Projekt Supabase (backend i autoryzacja)

### Instalacja

```bash
git clone https://github.com/selter2001/renovation-cost-app.git
cd renovation-cost-app
npm install
```

### Konfiguracja środowiska

Utwórz plik `.env` w katalogu głównym projektu:

```env
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj-klucz-anon
```

### Uruchomienie

```bash
npm run dev          # serwer deweloperski na http://localhost:5173
npm run build        # build produkcyjny
```

## Architektura

Frontend **React 18 + TypeScript + Vite** z backendem **Supabase**:

```
src/
├── components/        # Komponenty UI (pomieszczenia, prace, wyceny, auth)
├── hooks/             # Niestandardowe hooki React
├── lib/               # Klient Supabase, funkcje pomocnicze
├── pages/             # Komponenty stron (routing)
├── types/             # Definicje typów TypeScript
└── App.tsx            # Komponent główny z routingiem
```

Frontend obsługuje definiowanie pomieszczeń, wybór prac, obliczanie kosztów z VAT i generowanie PDF po stronie klienta. Supabase zapewnia PostgreSQL, zabezpieczenia RLS i autoryzację. UI korzysta z shadcn/ui, Tailwind CSS i Framer Motion.

## Autor

**Wojciech Olszak** -- [github.com/selter2001](https://github.com/selter2001)

## Licencja

Projekt jest objęty licencją MIT.
