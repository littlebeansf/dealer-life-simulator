# 🃏 Dealer Life Simulator

> A browser-based fantasy life simulator with a dark dealer aesthetic. Buy low. Sell high. Don't get caught.

[![Play Now](https://img.shields.io/badge/Play%20Now-GitHub%20Pages-brightgreen?style=for-the-badge)](https://littlebeansf.github.io/dealer-life-simulator/)

---

## 🎮 Play It

**→ [littlebeansf.github.io/dealer-life-simulator](https://littlebeansf.github.io/dealer-life-simulator/)**

No install required. Runs entirely in the browser.

---

## What It Is

Dealer Life Simulator is a spec-driven POC built from a 47-page game design document. You play a character born into a world of magic, contraband, and consequence — managing inventory, relationships, reputation, and survival across 10 fantasy locations.

Inspired by the mechanics of BitLife and Dope Wars, with a pixel art aesthetic and a fantasy setting.

---

## Features

### 🧬 Character & Races
- 10 playable races: Goblin, Elf, Dwarf, Golem, Ghost, Orc, Fairy, Vampire, Werewolf, Dragonkin
- Inherited race mechanics (45% father / 45% mother / 10% mutation)
- Per-race stat modifiers, carry capacity, travel risk, home location

### 💊 Contraband Market
- 10 contraband items with base prices, weights, and risk levels
- Buy/sell per location with stock limits and yearly price refresh
- Native item bonuses per location

### 🗺️ World & Travel
- 10 locations with unique pixel art backgrounds
- Route-based travel with gold costs and risk-triggered random events

### ⚡ Life Loop
- Age up yearly — triggers events, refreshes markets, tracks vitals
- Health, Stamina, Heat as core stats
- 50 activities (always-available + location-bound) with diminishing returns

### 👥 People & Relationships
- NPC system with role types (family, merchant, dealer, rival, enemy)
- Per-NPC trust, fear, and respect meters
- 8 social actions: talk, compliment, gift, apologize, bribe, threaten, etc.

### 🎭 Reputation
- 4 axes: Public, Underworld, Fear, Heat
- Heat affects travel risk and law encounters

### 🎲 Event Engine
- Multi-choice random events with stat-gated options
- Travel, market, and age-up events
- Full color-coded event log

### 💀 Death & Legacy
- Legacy score + prestige rank (Nobody → Legendary Dealer)
- Final stats summary

### 🎨 UI & UX
- **BitLife-style split layout** — location panel always visible (top), game content below
- **31 pixel art assets** — unique location backgrounds, drug item icons, race portraits
- **Dark / Light mode** with system preference detection
- **Banner notifications** — slide-in from top, color-coded, auto-dismiss
- Press Start 2P pixel font aesthetic

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui |
| State | React useState (no external store) |
| Backend | Express.js |
| Database | SQLite via Drizzle ORM |
| Bundler | Vite |
| Hosting | GitHub Pages (static) |

> **Note:** The GitHub Pages version runs frontend-only (no save persistence). The full version with SQLite save/load runs on [Perplexity Computer](https://www.perplexity.ai/computer/a/dealer-life-simulator-HORj9O4iRfC8i3O638kLvg).

---

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5000`.

---

## Build & Deploy

```bash
npm run build
# Static output → dist/public/
```

---

## Roadmap

- [ ] More event content (faction quests, story arcs)
- [ ] Deeper NPC system (recurring characters, faction allegiances)
- [ ] Quest / storyline system
- [ ] Save persistence on GitHub Pages (localStorage fallback when no backend)
- [ ] Leaderboard / legacy hall of fame
- [ ] Multiplayer trade or PvP heat system?

---

*Built with [Perplexity AI Computer](https://perplexity.ai) from a 47-page spec in one session.*
