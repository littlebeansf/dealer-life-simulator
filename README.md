# Dealer Life Simulator

Dealer Life Simulator is a fantasy-themed, browser-based trading game built with Vite, React, TypeScript, and Chakra UI. You start as an 18-year-old dealer and hustle through a magical economy by traveling, buying, and selling contraband while keeping track of your legend.

## Project status
- **v4.0**: Migrated to Vite + React + TypeScript + Chakra UI with animated screen transitions and modular components.
- Desktop-first layout with a mobile-inspired "dealer phone" that opens in-game apps.
- Deployed via GitHub Pages.

## How to run locally
1. **Install dependencies:** `npm install`
2. **Start dev server:** `npm run dev`
3. **Build for production:** `npm run build`

The entry point is `src/main.tsx`, which renders `<App />` and provides the Chakra UI theme.

## Game flow and player actions
### 1) Start screen
- A cinematic splash screen (`StartScreen`) with animated title and a "Begin the Pact" button. Clicking it opens a portal transition and proceeds to character creation.【F:src/components/StartScreen.tsx†L13-L99】

### 2) Character creation
- Choose a name, race (12 options), and gender (3 options) in `CharacterCreation` using the race/gender lists from `src/types/character.ts`. A random generator fills the fields with valid values and plays sparkles for feedback.【F:src/components/CharacterCreation.tsx†L22-L146】【F:src/types/character.ts†L5-L45】
- Confirming binds the pact and passes the data to `createDealerState`, which seeds a new `DealerState` with age 18, current month/year, 1,000 gold, starting location based on race, empty storage/contacts, and an initial journal entry.【F:src/components/CharacterCreation.tsx†L83-L114】【F:src/utils/createDealerState.ts†L6-L40】

### 3) Main game (Dealer Phone)
`MainGame` wraps the core loop and exposes these in-phone apps plus a top bar showing the current month and year.

- **Advance time**: The Next Turn control triggers `handleNextTurn` to increment the calendar, update age when a year passes, refresh market prices/stock, and log the passing month or birthdays to the journal with themed toasts.【F:src/components/MainGame.tsx†L37-L115】【F:src/hooks/useGameActions.tsx†L32-L98】
- **Dealer app**: `DealerStatsPanel` summarizes gold, storage value, total trades, reputation, months survived, and the most-stocked product, plus a flavor title based on wealth.【F:src/components/MainGame.tsx†L146-L173】【F:src/components/DealerStatsPanel/index.tsx†L8-L69】
- **Market app**: `MarketPanel` lists products available in the current location. Players set default or per-item purchase quantities, see live prices/stock, and buy items if they can afford the total. Purchases reduce gold, add to storage, increment trade counters, and log a journal entry with a toast.【F:src/components/MarketPanel/index.tsx†L13-L73】【F:src/components/MarketPanel/ProductCard.tsx†L11-L68】【F:src/hooks/useGameActions.tsx†L100-L157】
- **Storage app**: `StoragePanel` shows owned items with average buy price and current sell price. Buttons sell 1/10/100 units or everything of a product, updating gold, trade stats, storage quantities, and the journal with a toast.【F:src/components/StoragePanel.tsx†L15-L96】【F:src/hooks/useGameActions.tsx†L159-L226】
- **Dealer Scrolls app**: `DealerJournalPanel` (opened via the Scrolls icon) displays every journal entry written by other actions, letting players review their history.【F:src/components/MainGame.tsx†L129-L174】
- **World Map app**: `MapPanel` renders a map with travel markers. Clicking a destination spends gold based on distance, animates the dealer icon between coordinates, updates the current location, and writes a travel journal entry with a toast when the trip finishes.【F:src/components/MainGame.tsx†L129-L174】【F:src/components/MapPanel/index.tsx†L20-L140】

## Core data and logic (for rebuilding)
- **Game state schema**: `src/types/game.ts` defines `DealerState` (identity, race/gender, time, stats, location, storage, contacts, journal) plus `Product` and `StorageItem` structures used across the UI.【F:src/types/game.ts†L1-L38】
- **Character schema**: `src/types/character.ts` lists the race and gender enums and the `Dealer` structure used to seed game state.【F:src/types/character.ts†L5-L33】
- **Market data**: `src/data/products.ts` enumerates every tradable item with id, name, base price, rarity, icon, addiction potential, craftable flag, and the locations where it appears. `generateMarketPrices` and `generateMarketStock` create per-turn prices and stock using random fluctuations.【F:src/data/products.ts†L1-L99】【F:src/utils/gameLogic.ts†L1-L28】
- **World map**: `src/data/locations.ts` defines all map nodes with ids, names, biome, dominant race, and x/y coordinates used for travel cost and animation targets.【F:src/data/locations.ts†L1-L125】
- **Starting locations**: `src/utils/raceStartingLocation.ts` maps each race to its initial city; `createDealerState` uses it when spawning a new dealer.【F:src/utils/createDealerState.ts†L6-L38】
- **Time and pricing logic**: `advanceTime` increments the month/year/age, while `useGameActions` orchestrates turn progression, purchase/sale bookkeeping, storage valuation, and the journal feed.【F:src/utils/gameLogic.ts†L20-L38】【F:src/hooks/useGameActions.tsx†L32-L226】

## Assets
Art and UI sprites (start screen background, race portraits, icons for apps/navigation/status, world map) live under `src/assets` and `src/data/icons.ts`/`src/data/generic.ts`, and are loaded by their respective components. Replace these assets with files of the same names to reskin the game without code changes.

## Folder structure
- `src/components`: UI modules (Start screen, Character creation, Dealer phone apps, overlays).
- `src/data`: Game content (products, locations, icons, race images, generic backgrounds).
- `src/hooks`: Stateful game actions and animation helpers.
- `src/utils`: Helper logic for state creation, time, and market calculations.
- `src/types`: Shared TypeScript contracts.
- `public/index.html`: Root HTML for the Vite build.
