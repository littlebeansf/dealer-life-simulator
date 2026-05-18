# 🃏 Dealer Life Simulator

A browser-based **fantasy life simulator** with a dark dealer aesthetic. Born into a world of contraband, magic, and consequence — buy low, sell high, manage relationships, dodge the law, and try not to get caught.

Built fully local-first from a 47-page game design spec using Perplexity AI Computer (React + TypeScript + Express + SQLite).

---

## 🎮 Play Now

| Version | URL | Notes |
|---|---|---|
| **GitHub Pages** | [littlebeansf.github.io/dealer-life-simulator](https://littlebeansf.github.io/dealer-life-simulator/) | Static, no save persistence |
| **Perplexity Computer** | [perplexity.ai/computer/…](https://www.perplexity.ai/computer/a/dealer-life-simulator-HORj9O4iRfC8i3O638kLvg) | Full SQLite save/load |

---

## 📸 Feature Overview

### 🗺️ World & Travel
- 10 fantasy locations with unique **pixel art backgrounds**: Goblinland, Elvenwood, Dwarf Mines, Vampire Court, Orc Warcamp, Fairy Glade, Ghost Marsh, Dragon Peaks, Moonfang Wilds, Golem Quarry
- Route-based travel with gold costs and risk-triggered random events
- Law risk levels and racial territories per location

### 🧬 Character & Races
- 10 playable races: Goblin, Elf, Dwarf, Golem, Ghost, Orc, Fairy, Vampire, Werewolf, Dragonkin
- Inherited race mechanics: 45% father / 45% mother / 10% mutation
- Per-race stat modifiers, carry capacity, travel risk, home location
- **Pixel art portrait** for every race

### 💊 Contraband & Market
- 10 contraband items with base prices, weights, and risk levels
- **Pixel art icon** for every item
- Buy/sell per location with stock limits and yearly price refresh
- Native item bonuses and price modifiers per location

### ⚡ Activities
- 50 activities: always-available + location-bound
- **Yearly use limits** enforced (cooldownPerYear) — cards show `X/Y` remaining uses, go greyed-out when exhausted
- Diminishing returns tracked per year, reset on advancing year
- Stat and age requirements for advanced activities

### 👥 People & Relationships — 18 Actions
Four action categories, each with real stat effects on player AND NPC:

| Category | Actions |
|---|---|
| **Social** | Talk, Compliment, Apologize, Share Rumor, Give Gift, Ask Rumor |
| **Romance** | Flirt, Go Drink, Make Love, Propose Partnership |
| **Business** | Bribe, Loan Gold, Collect Debt, Extort |
| **Conflict** | Insult, Threaten, Fight, Betray |

Every action modifies:
- **Player stats**: money, health, stamina, heat
- **Player rep**: public reputation, underworld rep, fear rep
- **NPC meters**: relationship, trust, fear, respect
- **NPC memories**: narrative record of key moments
- **NPC role/status**: actions like Make Love → Lover, Propose Partnership → Business Partner, Betray → Betrayed

### 🎭 Reputation System
- 4 independent axes: **Public**, **Underworld**, **Fear**, **Heat**
- Heat affects travel event risk and law encounters

### 🎲 Event Engine
- Multi-choice random events with stat-gated options
- Travel events, market events, age-up events
- Full event log with color-coded history

### 🎂 Life Loop
- **Advance year** to progress time and trigger events
- Advancing a year: restores **+15 stamina** (BitLife-style rest reset), ages health down slightly, refreshes market prices, resets activity cooldowns, triggers a random event
- Health, stamina, heat tracked as core vitals

### 🔔 Notifications & UX
- **Slide-in banner** notifications — color-coded (green/red/amber/blue), auto-dismiss after **6 seconds**, with ✕ manual close button
- **Scrolling news ticker** — marquee right→left animation, 10s per item, dynamic content from event log + yearly random world news
- BitLife-style split layout: top 40% always shows location art + stats, bottom 60% scrollable game content

### 💀 Death & Legacy
- Death screen with legacy score calculation
- Prestige rank titles: Nobody → Dealer → Gangster → Crime Lord → Legendary Dealer
- Final stats summary and last moments log

### 🎵 Audio
- Procedural RPG melody loop (A-minor pentatonic, Web Audio API — no external files)
- SFX: buy, sell, travel, level-up, error, click, coin
- Settings modal: music toggle, volume slider, dark/light mode

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS v3 |
| UI Components | shadcn/ui |
| Routing | Wouter (hash routing for iframe compatibility) |
| State | React useState / Context |
| Backend | Express.js |
| Database | SQLite via Drizzle ORM (`better-sqlite3`) |
| Bundler | Vite |
| Fonts | Press Start 2P (pixel), Courier New (UI text) |
| Hosting | GitHub Pages + Perplexity Computer |

---

## 🏗️ Project Structure

```
dealer-life-simulator/
├── client/
│   └── src/
│       ├── assets/pixel/        # 31 pixel art assets (locations, races, items)
│       ├── components/          # Banner, GameLayout, BottomNav, NewsTicker, StatBar…
│       ├── game/
│       │   ├── data/            # races.ts, items.ts, locations.ts, activities.ts, events.ts
│       │   ├── engine.ts        # Full game logic (market, travel, age-up, people, events)
│       │   └── types.ts         # All TypeScript interfaces
│       ├── hooks/               # useBanner, useAudio, useTheme
│       └── screens/             # 10 screens: Main, Market, Map, Activities, People, Character…
├── server/
│   ├── routes.ts               # Save/load API (/api/save GET/POST/DELETE)
│   └── storage.ts              # Drizzle SQLite storage
└── shared/
    └── schema.ts               # Drizzle schema
```

---

## 🚀 Run Locally

```bash
# Install dependencies
npm install

# Development (hot reload)
npm run dev

# Production build + serve
npm run build
NODE_ENV=production node dist/index.cjs
```

Server runs on **port 5000**. Save data persists in SQLite.

> **Note:** Do not use `localStorage`/`sessionStorage` — the app runs in a sandboxed iframe context and persists all state via the SQLite API.

---

## 🗺️ Roadmap

- [ ] Expanded event content (faction quests, recurring story arcs)
- [ ] Deeper NPC system (faction allegiances, returning characters)
- [ ] Quest system / narrative storyline
- [ ] Leaderboard / legacy hall of fame
- [ ] Save persistence on GitHub Pages (API fallback)
- [ ] Multiplayer heat / trade system

---

*Built with [Perplexity AI Computer](https://www.perplexity.ai/computer) · May 2026*
