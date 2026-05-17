import type {
  GameState,
  Player,
  Person,
  Inventory,
  MarketState,
  EventLogEntry,
  RaceId,
  LocationId,
  ItemId,
  Stats,
  Effect,
  EventOutcome,
  Reputation,
  PublicRepLabel,
  UnderworldRank,
  Activity,
  GameEvent,
} from './types';
import { RACES } from './data/races';
import { ITEMS, ALL_ITEM_IDS } from './data/items';
import { LOCATIONS, LOCATION_LIST } from './data/locations';
import { TRAVEL_EVENTS, AGE_UP_EVENTS } from './data/events';

// ===== SAVE/LOAD (API-backed, works in sandboxed iframe) =====

export async function saveGame(state: GameState): Promise<void> {
  try {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: state }),
    });
  } catch (e) {
    console.error('Save failed', e);
  }
}

export async function loadGame(): Promise<GameState | null> {
  try {
    const res = await fetch('/api/save');
    const json = await res.json();
    if (!json.exists) return null;
    return json.data as GameState;
  } catch {
    return null;
  }
}

export async function deleteSave(): Promise<void> {
  try {
    await fetch('/api/save', { method: 'DELETE' });
  } catch (e) {
    console.error('Delete save failed', e);
  }
}

export async function hasSave(): Promise<boolean> {
  try {
    const res = await fetch('/api/save');
    const json = await res.json();
    return json.exists;
  } catch {
    return false;
  }
}

// ===== RANDOM =====
export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function chance(probability: number): boolean {
  return Math.random() < probability;
}

// ===== MARKET =====
export function generateMarketState(locationId: LocationId, year: number): MarketState {
  const location = LOCATIONS[locationId];
  const prices: Partial<Record<ItemId, number>> = {};
  const stock: Partial<Record<ItemId, number>> = {};

  for (const itemId of ALL_ITEM_IDS) {
    const item = ITEMS[itemId];
    const locationMod = location.priceModifiers[itemId] ?? 1;
    const volatility = item.volatility;
    const priceMod = 1 + (Math.random() - 0.5) * 2 * volatility;
    prices[itemId] = Math.max(1, Math.round(item.basePrice * locationMod * priceMod));

    // Native items have higher stock
    if (itemId === location.nativeItemId) {
      stock[itemId] = rand(15, 30);
    } else if (item.rarity === 'legendary') {
      stock[itemId] = chance(0.3) ? rand(1, 3) : 0;
    } else if (item.rarity === 'rare') {
      stock[itemId] = chance(0.5) ? rand(2, 8) : 0;
    } else if (item.rarity === 'uncommon') {
      stock[itemId] = rand(0, 12);
    } else {
      stock[itemId] = rand(5, 20);
    }
  }

  return {
    locationId,
    year,
    prices: prices as Record<ItemId, number>,
    stock: stock as Record<ItemId, number>,
    heat: 0,
  };
}

export function initAllMarkets(year: number): Record<LocationId, MarketState> {
  const markets: Partial<Record<LocationId, MarketState>> = {};
  for (const loc of LOCATION_LIST) {
    markets[loc.id] = generateMarketState(loc.id, year);
  }
  return markets as Record<LocationId, MarketState>;
}

export function refreshAllMarkets(state: GameState): Record<LocationId, MarketState> {
  const markets: Partial<Record<LocationId, MarketState>> = {};
  for (const loc of LOCATION_LIST) {
    markets[loc.id] = generateMarketState(loc.id, state.currentYear);
  }
  return markets as Record<LocationId, MarketState>;
}

// ===== REPUTATION LABELS =====
export function getPublicRepLabel(value: number): PublicRepLabel {
  if (value >= 80) return 'Beloved';
  if (value >= 60) return 'Honorable';
  if (value >= 40) return 'Helpful';
  if (value >= 10) return 'Neutral';
  if (value >= -10) return 'Suspicious';
  if (value >= -30) return 'Dangerous';
  if (value >= -60) return 'Infamous';
  if (value >= -80) return 'Outcast';
  return 'Folk Hero'; // ironically folk hero for extreme outcast
}

export function getUnderworldRank(value: number): UnderworldRank {
  if (value >= 90) return 'Mythic Kingpin';
  if (value >= 70) return 'Black Market Baron';
  if (value >= 50) return 'Regional Dealer';
  if (value >= 35) return 'Trusted Courier';
  if (value >= 20) return 'Hustler';
  if (value >= 5) return 'Errand Runner';
  return 'Nobody';
}

// ===== CARRY CAPACITY =====
export function calcCarryCapacity(player: Player): number {
  const race = RACES[player.raceId];
  return Math.round(50 + player.stats.strength * 0.5 + race.carryCapacityModifier);
}

export function calcInventoryWeight(inventory: Inventory): number {
  let total = 0;
  for (const [itemId, qty] of Object.entries(inventory.items)) {
    total += ITEMS[itemId as ItemId].weight * qty;
  }
  return total;
}

// ===== NPC GENERATION =====
const GOBLIN_NAMES = ['Gribnuk', 'Splixor', 'Krabble', 'Ziknik', 'Fettlix', 'Wrixum'];
const ELF_NAMES = ['Sylvara', 'Aelindra', 'Thorwen', 'Eladris', 'Vaelis', 'Miranel'];
const DWARF_NAMES = ['Borgrak', 'Thornkeg', 'Grimilda', 'Durval', 'Helka', 'Gundak'];
const ORC_NAMES = ['Grakkar', 'Morrgash', 'Buldak', 'Kurgash', 'Ulgat', 'Thrax'];
const GHOST_NAMES = ['Wraithnel', 'Pallor', 'Spectra', 'Dimwell', 'Ghostal', 'Vapora'];
const VAMPIRE_NAMES = ['Countessa', 'Vellum', 'Dracara', 'Morticane', 'Lyserath', 'Bloodwyn'];
const FAIRY_NAMES = ['Luma', 'Glitterwing', 'Sparklette', 'Moonpetal', 'Fizzara', 'Brilyn'];
const WEREWOLF_NAMES = ['Vasha', 'Moonfang', 'Greyback', 'Lunara', 'Howldrick', 'Wolfen'];
const DRAGONKIN_NAMES = ['Pyraxis', 'Emberclaw', 'Draekith', 'Scalvar', 'Ignaroth', 'Burnex'];
const GOLEM_NAMES = ['Gravus', 'Stonechest', 'Rockmind', 'Bouldar', 'Granox', 'Terralock'];

function getNamePool(raceId: RaceId): string[] {
  const pools: Record<RaceId, string[]> = {
    goblin: GOBLIN_NAMES, elf: ELF_NAMES, dwarf: DWARF_NAMES,
    orc: ORC_NAMES, ghost: GHOST_NAMES, vampire: VAMPIRE_NAMES,
    fairy: FAIRY_NAMES, werewolf: WEREWOLF_NAMES, dragonkin: DRAGONKIN_NAMES,
    golem: GOLEM_NAMES,
  };
  return pools[raceId];
}

export function generateNPCName(raceId: RaceId): string {
  const pool = getNamePool(raceId);
  return pool[Math.floor(Math.random() * pool.length)];
}

const NPC_TRAITS = ['Greedy', 'Loyal', 'Cowardly', 'Brave', 'Vengeful', 'Honest', 'Paranoid', 'Noble', 'Cruel', 'Generous', 'Ambitious', 'Secretive'];

export function generateMerchant(id: string, raceId: RaceId, locationId: LocationId): Person {
  const race = RACES[raceId];
  return {
    id,
    name: generateNPCName(raceId),
    raceId,
    age: rand(25, 60),
    role: 'merchant',
    locationId,
    emoji: race.emoji,
    traits: [NPC_TRAITS[rand(0, 5)], NPC_TRAITS[rand(6, 11)]],
    relationship: rand(20, 50),
    trust: rand(20, 50),
    fear: rand(0, 20),
    respect: rand(20, 50),
    debtToPlayer: 0,
    playerDebtToThem: 0,
    statusLabels: ['Neutral'],
    memories: [],
    isAlive: true,
  };
}

export function generateParent(role: 'father' | 'mother', raceId: RaceId): Person {
  const race = RACES[raceId];
  return {
    id: `${role}_${Date.now()}_${Math.random()}`,
    name: generateNPCName(raceId),
    raceId,
    age: rand(28, 50),
    gender: role === 'father' ? 'male' : 'female',
    role: 'family',
    locationId: race.homeLocationId,
    emoji: race.emoji,
    traits: [NPC_TRAITS[rand(0, 5)], NPC_TRAITS[rand(6, 11)]],
    relationship: 70,
    trust: 80,
    fear: 0,
    respect: 60,
    debtToPlayer: 0,
    playerDebtToThem: 0,
    statusLabels: ['Family'],
    memories: [],
    isAlive: true,
  };
}

export function generateRival(): Person {
  const raceIds = Object.keys(RACES) as RaceId[];
  const raceId = raceIds[rand(0, raceIds.length - 1)];
  const race = RACES[raceId];
  const locs = LOCATION_LIST;
  const locationId = locs[rand(0, locs.length - 1)].id;
  return {
    id: `rival_${Date.now()}_${Math.random()}`,
    name: generateNPCName(raceId),
    raceId,
    age: rand(18, 45),
    role: 'rival',
    locationId,
    emoji: race.emoji,
    traits: [NPC_TRAITS[rand(0, 5)], NPC_TRAITS[rand(6, 11)]],
    relationship: rand(-30, 0),
    trust: rand(0, 30),
    fear: rand(0, 20),
    respect: rand(10, 40),
    debtToPlayer: 0,
    playerDebtToThem: 0,
    statusLabels: ['Rival'],
    memories: [],
    isAlive: true,
  };
}

// ===== RACE INHERITANCE =====
export function inheritRace(fatherRaceId: RaceId, motherRaceId: RaceId): RaceId {
  const roll = Math.random();
  if (roll < 0.45) return fatherRaceId;
  if (roll < 0.90) return motherRaceId;
  // Mutation: random race
  const races = Object.keys(RACES) as RaceId[];
  return races[Math.floor(Math.random() * races.length)];
}

// ===== INITIAL STATS =====
export function generateInitialStats(raceId: RaceId): { stats: Stats; health: number; stamina: number } {
  const race = RACES[raceId];
  const base = { strength: 30, intelligence: 30, charisma: 30, luck: 30 };
  const stats: Stats = {
    strength: Math.max(5, Math.min(95, base.strength + (race.statModifiers.strength ?? 0) + rand(-5, 5))),
    intelligence: Math.max(5, Math.min(95, base.intelligence + (race.statModifiers.intelligence ?? 0) + rand(-5, 5))),
    charisma: Math.max(5, Math.min(95, base.charisma + (race.statModifiers.charisma ?? 0) + rand(-5, 5))),
    luck: Math.max(5, Math.min(95, base.luck + (race.statModifiers.luck ?? 0) + rand(-5, 5))),
  };
  const health = Math.max(30, Math.min(100, 60 + race.healthModifier + rand(-5, 5)));
  const stamina = Math.max(30, Math.min(100, 60 + race.staminaModifier + rand(-5, 5)));
  return { stats, health, stamina };
}

// ===== EFFECT APPLICATION =====
export function applyEffect(state: GameState, effect: Effect): GameState {
  const s = { ...state };
  const p = { ...s.player };

  switch (effect.type) {
    case 'money':
      p.money = Math.max(0, p.money + (effect.value ?? 0));
      break;
    case 'health':
      p.health = Math.max(0, Math.min(100, p.health + (effect.value ?? 0)));
      break;
    case 'stamina':
      p.stamina = Math.max(0, Math.min(100, p.stamina + (effect.value ?? 0)));
      break;
    case 'heat':
      p.heat = Math.max(0, Math.min(100, p.heat + (effect.value ?? 0)));
      break;
    case 'stat':
      if (effect.stat) {
        const stats = { ...p.stats };
        stats[effect.stat] = Math.max(1, Math.min(100, (stats[effect.stat] ?? 0) + (effect.value ?? 0)));
        p.stats = stats;
      }
      break;
    case 'reputation_public':
      p.reputation = {
        ...p.reputation,
        public: Math.max(-100, Math.min(100, p.reputation.public + (effect.value ?? 0))),
      };
      p.reputation.publicLabel = getPublicRepLabel(p.reputation.public);
      break;
    case 'reputation_underworld':
      p.reputation = {
        ...p.reputation,
        underworld: Math.max(0, Math.min(100, p.reputation.underworld + (effect.value ?? 0))),
      };
      p.reputation.underworldRank = getUnderworldRank(p.reputation.underworld);
      break;
    case 'reputation_fear':
      p.reputation = {
        ...p.reputation,
        fear: Math.max(0, Math.min(100, p.reputation.fear + (effect.value ?? 0))),
      };
      break;
    case 'relationship':
      if (effect.personId && s.people[effect.personId]) {
        const person = { ...s.people[effect.personId] };
        person.relationship = Math.max(-100, Math.min(100, person.relationship + (effect.value ?? 0)));
        s.people = { ...s.people, [effect.personId]: person };
      }
      break;
    case 'add_item':
      if (effect.itemId) {
        const inv = { ...s.inventory };
        const items = { ...inv.items };
        items[effect.itemId] = (items[effect.itemId] ?? 0) + 1;
        inv.items = items;
        inv.capacityUsed = calcInventoryWeight({ ...inv, items });
        s.inventory = inv;
      }
      break;
    case 'remove_item':
      if (effect.itemId) {
        const inv = { ...s.inventory };
        const items = { ...inv.items };
        items[effect.itemId] = Math.max(0, (items[effect.itemId] ?? 0) - 1);
        inv.items = items;
        inv.capacityUsed = calcInventoryWeight({ ...inv, items });
        s.inventory = inv;
      }
      break;
    case 'log':
      if (effect.text) {
        s.eventLog = [
          {
            id: `log_${Date.now()}_${Math.random()}`,
            age: s.player.age,
            text: effect.text,
            type: 'event',
          },
          ...s.eventLog,
        ];
      }
      break;
  }

  s.player = p;
  return s;
}

export function applyEffects(state: GameState, effects: Effect[]): GameState {
  let s = state;
  for (const effect of effects) {
    s = applyEffect(s, effect);
  }
  return s;
}

// ===== EVENT RESOLUTION =====
export function resolveOutcome(state: GameState, outcome: EventOutcome): GameState {
  let s = applyEffects(state, outcome.effects);
  // Add outcome description to log
  s = {
    ...s,
    eventLog: [
      {
        id: `out_${Date.now()}_${Math.random()}`,
        age: s.player.age,
        text: outcome.description,
        type: 'event',
        emoji: '📝',
      },
      ...s.eventLog,
    ],
  };
  return s;
}

export function pickOutcome(outcomes: EventOutcome[]): EventOutcome {
  const roll = Math.random();
  let cumulative = 0;
  for (const outcome of outcomes) {
    cumulative += outcome.probability;
    if (roll < cumulative) return outcome;
  }
  return outcomes[outcomes.length - 1];
}

// ===== ACTIVITY =====
export function doActivity(state: GameState, activity: Activity): GameState {
  let s = { ...state };
  const p = { ...s.player };
  const counts = { ...p.activityCounts };
  const currentCount = counts[activity.id] ?? 0;

  // Apply diminishing returns
  let effects = [...activity.effects];
  if (currentCount >= 2) {
    // Reduce stat gains for repeated use
    effects = effects.map(e => {
      if ((e.type === 'stat' || e.type === 'health' || e.type === 'stamina') && (e.value ?? 0) > 0) {
        return { ...e, value: Math.max(0, Math.floor((e.value ?? 0) * 0.3)) };
      }
      return e;
    });
  }

  counts[activity.id] = currentCount + 1;
  p.activityCounts = counts;
  s.player = p;

  s = applyEffects(s, effects);

  // Risk check
  if (activity.riskEffects && activity.riskChance && chance(activity.riskChance)) {
    s = applyEffects(s, activity.riskEffects);
  }

  // Special: tavern gives rumor
  if (activity.id === 'visit_tavern') {
    const rumor = generateRumor();
    s = {
      ...s,
      rumors: [rumor, ...(s.rumors ?? [])].slice(0, 5),
      eventLog: [
        {
          id: `rumor_${Date.now()}`,
          age: s.player.age,
          text: `Rumor: "${rumor}"`,
          type: 'rumor',
          emoji: '👂',
        },
        ...s.eventLog,
      ],
    };
  }

  // Gamble special
  if (activity.id === 'gamble' && !s.eventLog[0]?.text?.includes('lost')) {
    const winAmount = rand(20, 80);
    s = applyEffect(s, { type: 'money', value: winAmount });
    s = {
      ...s,
      eventLog: [
        {
          id: `gamble_${Date.now()}`,
          age: s.player.age,
          text: `Lucky streak! You won ${winAmount} gold at the gambling table.`,
          type: 'event',
          emoji: '🎲',
        },
        ...s.eventLog,
      ],
    };
  }

  void saveGame(s);
  return s;
}

// ===== TRAVEL =====
export function travel(state: GameState, toLocationId: LocationId): GameState {
  const location = LOCATIONS[state.currentLocationId];
  const route = location.travelRoutes.find(r => r.toLocationId === toLocationId);
  if (!route) return state;

  if (state.player.money < route.cost) return state;

  let s: GameState = {
    ...state,
    currentLocationId: toLocationId,
    player: {
      ...state.player,
      money: state.player.money - route.cost,
      stamina: Math.max(0, state.player.stamina - rand(3, 10)),
    },
    eventLog: [
      {
        id: `travel_${Date.now()}`,
        age: state.player.age,
        text: `You traveled from ${LOCATIONS[state.currentLocationId].name} to ${LOCATIONS[toLocationId].name}.`,
        type: 'travel',
        emoji: '🗺️',
      },
      ...state.eventLog,
    ],
  };

  // Travel event chance
  const raceRisk = RACES[s.player.raceId].travelRiskModifier;
  const eventChance = Math.min(0.7, route.riskLevel * 0.1 + 0.1 + raceRisk + (s.player.heat / 200));

  if (chance(eventChance)) {
    const event = TRAVEL_EVENTS[rand(0, TRAVEL_EVENTS.length - 1)];
    s = {
      ...s,
      pendingEvent: { event, phase: 0 },
    };
  }

  void saveGame(s);
  return s;
}

// ===== BUY/SELL =====
export function buyItem(state: GameState, itemId: ItemId, quantity: number): { state: GameState; error?: string } {
  const market = state.markets[state.currentLocationId];
  if (!market) return { state, error: 'No market here' };

  const price = market.prices[itemId];
  const available = market.stock[itemId];
  const item = ITEMS[itemId];
  const totalCost = price * quantity;
  const totalWeight = item.weight * quantity;

  if (available < quantity) return { state, error: 'Not enough stock' };
  if (state.player.money < totalCost) return { state, error: 'Not enough gold' };
  if (state.inventory.capacityUsed + totalWeight > state.inventory.capacityMax) {
    return { state, error: 'Not enough carry capacity' };
  }

  const newMarket = {
    ...market,
    stock: { ...market.stock, [itemId]: available - quantity },
  };

  const newItems = { ...state.inventory.items };
  newItems[itemId] = (newItems[itemId] ?? 0) + quantity;

  const newInventory: Inventory = {
    items: newItems,
    capacityUsed: state.inventory.capacityUsed + totalWeight,
    capacityMax: state.inventory.capacityMax,
  };

  // Heat from high-risk items
  const heatGain = quantity * item.risk * 0.3;

  let s: GameState = {
    ...state,
    player: {
      ...state.player,
      money: state.player.money - totalCost,
      heat: Math.min(100, state.player.heat + heatGain),
    },
    markets: { ...state.markets, [state.currentLocationId]: newMarket },
    inventory: newInventory,
    eventLog: [
      {
        id: `buy_${Date.now()}`,
        age: state.player.age,
        text: `Bought ${quantity}x ${ITEMS[itemId].name} for ${totalCost} gold.`,
        type: 'trade',
        emoji: '🛒',
      },
      ...state.eventLog,
    ],
  };

  // Underworld rep gain for dealing
  s = applyEffect(s, { type: 'reputation_underworld', value: Math.ceil(quantity * 0.5) });

  void saveGame(s);
  return { state: s };
}

export function sellItem(state: GameState, itemId: ItemId, quantity: number): { state: GameState; error?: string } {
  const market = state.markets[state.currentLocationId];
  if (!market) return { state, error: 'No market here' };

  const owned = state.inventory.items[itemId] ?? 0;
  if (owned < quantity) return { state, error: 'Not enough in inventory' };

  const price = market.prices[itemId];
  const totalEarned = price * quantity;
  const item = ITEMS[itemId];
  const totalWeight = item.weight * quantity;

  const newItems = { ...state.inventory.items };
  newItems[itemId] = owned - quantity;

  const newInventory: Inventory = {
    items: newItems,
    capacityUsed: Math.max(0, state.inventory.capacityUsed - totalWeight),
    capacityMax: state.inventory.capacityMax,
  };

  let s: GameState = {
    ...state,
    player: {
      ...state.player,
      money: state.player.money + totalEarned,
    },
    inventory: newInventory,
    eventLog: [
      {
        id: `sell_${Date.now()}`,
        age: state.player.age,
        text: `Sold ${quantity}x ${ITEMS[itemId].name} for ${totalEarned} gold.`,
        type: 'trade',
        emoji: '💰',
      },
      ...state.eventLog,
    ],
  };

  s = applyEffect(s, { type: 'reputation_underworld', value: Math.ceil(quantity * 0.5) });

  void saveGame(s);
  return { state: s };
}

// ===== AGE UP =====
export function ageUp(state: GameState): GameState {
  const newAge = state.player.age + 1;
  const newYear = state.currentYear + 1;

  // Age effects
  let healthChange = -2; // aging
  // Stamina recovers each year (rest, reset) but worsens with age
  let staminaChange = newAge > 60 ? 8 : 15; // net stamina boost on year advance

  if (newAge > 60) {
    healthChange -= 3;
  }

  // Heat cools down
  const heatCooldown = -rand(5, 10);

  let p = {
    ...state.player,
    age: newAge,
    health: Math.max(0, Math.min(100, state.player.health + healthChange + rand(-2, 5))),
    stamina: Math.max(0, Math.min(100, state.player.stamina + staminaChange + rand(-2, 5))),
    heat: Math.max(0, state.player.heat + heatCooldown),
    activityCounts: {}, // reset activity diminishing returns
  };

  // Update carry capacity
  p.carryCapacity = calcCarryCapacity(p);

  let s: GameState = {
    ...state,
    player: p,
    currentYear: newYear,
    markets: refreshAllMarkets({ ...state, currentYear: newYear }),
    eventLog: [
      {
        id: `age_${Date.now()}`,
        age: newAge,
        text: `Age ${newAge}. A new year begins. Markets refresh across the realm.`,
        type: 'age_up',
        emoji: '🎂',
      },
      ...state.eventLog,
    ],
  };

  // Trigger random age-up event
  if (chance(0.6) && AGE_UP_EVENTS.length > 0) {
    const event = AGE_UP_EVENTS[rand(0, AGE_UP_EVENTS.length - 1)];
    s = {
      ...s,
      pendingEvent: { event, phase: 0 },
    };
  }

  // Update inventory capacity
  s.inventory = {
    ...s.inventory,
    capacityMax: p.carryCapacity,
  };

  // Death check
  if (s.player.health <= 0) {
    s = {
      ...s,
      screen: 'death',
      eventLog: [
        {
          id: `death_${Date.now()}`,
          age: newAge,
          text: `Age ${newAge}. Your health failed you. The story ends here.`,
          type: 'death',
          emoji: '💀',
        },
        ...s.eventLog,
      ],
    };
  }

  void saveGame(s);
  return s;
}

// ===== PEOPLE ACTIONS =====
export function doPersonAction(state: GameState, personId: string, action: string): GameState {
  const person = state.people[personId];
  if (!person) return state;

  let s = { ...state };
  let p = { ...person };
  let logText = '';
  let logEmoji = '👥';

  // Helper: clamp person meters
  const clampPerson = (field: 'relationship' | 'trust' | 'fear' | 'respect', delta: number) => {
    if (field === 'relationship') p.relationship = Math.max(-100, Math.min(100, p.relationship + delta));
    else if (field === 'trust') p.trust = Math.max(0, Math.min(100, p.trust + delta));
    else if (field === 'fear') p.fear = Math.max(0, Math.min(100, p.fear + delta));
    else if (field === 'respect') p.respect = Math.max(0, Math.min(100, p.respect + delta));
  };
  // Helper: adjust player stats safely
  const adjPlayer = (field: 'money' | 'health' | 'stamina' | 'heat', delta: number) => {
    if (field === 'money') s.player = { ...s.player, money: Math.max(0, s.player.money + delta) };
    else if (field === 'health') s.player = { ...s.player, health: Math.max(0, Math.min(100, s.player.health + delta)) };
    else if (field === 'stamina') s.player = { ...s.player, stamina: Math.max(0, Math.min(100, s.player.stamina + delta)) };
    else if (field === 'heat') s.player = { ...s.player, heat: Math.max(0, Math.min(100, s.player.heat + delta)) };
  };
  // Helper: adjust player public rep
  const adjPubRep = (delta: number) => {
    const newPub = Math.max(-100, Math.min(100, s.player.reputation.public + delta));
    s.player = { ...s.player, reputation: { ...s.player.reputation, public: newPub, publicLabel: getPublicRepLabel(newPub) } };
  };
  // Helper: adjust underworld rep
  const adjUWRep = (delta: number) => {
    const newUW = Math.max(0, Math.min(100, s.player.reputation.underworld + delta));
    s.player = { ...s.player, reputation: { ...s.player.reputation, underworld: newUW } };
  };
  // Helper: adjust fear rep
  const adjFearRep = (delta: number) => {
    const newFear = Math.max(0, Math.min(100, s.player.reputation.fear + delta));
    s.player = { ...s.player, reputation: { ...s.player.reputation, fear: newFear } };
  };
  // Helper: add memory
  const addMem = (desc: string) => {
    p.memories = [{ age: s.player.age, description: desc }, ...p.memories].slice(0, 10);
  };

  switch (action) {

    // ── SOCIAL ────────────────────────────────────────────────────────────────
    case 'talk':
      clampPerson('relationship', rand(1, 4));
      clampPerson('trust', rand(0, 2));
      adjPlayer('stamina', -1);
      logText = `You had a casual conversation with ${p.name}. Nothing major, but bonds strengthen slowly.`;
      logEmoji = '💬';
      break;

    case 'compliment':
      clampPerson('relationship', rand(4, 9));
      clampPerson('trust', rand(2, 5));
      clampPerson('respect', rand(1, 4));
      adjPlayer('stamina', -1);
      // Charisma bonus
      if (s.player.stats.charisma >= 7) {
        clampPerson('relationship', rand(2, 4));
      }
      logText = `You complimented ${p.name} — they seemed genuinely pleased. Relationship improved.`;
      logEmoji = '😊';
      break;

    case 'apologize':
      clampPerson('relationship', rand(5, 10));
      clampPerson('trust', rand(2, 6));
      clampPerson('fear', -rand(2, 5));
      logText = `You apologized to ${p.name}. The tension between you eased.`;
      logEmoji = '🙏';
      addMem('You apologized sincerely.');
      break;

    case 'share_rumor': {
      const sharedRumor = generateRumor();
      clampPerson('trust', rand(4, 8));
      clampPerson('relationship', rand(2, 5));
      adjPubRep(1);
      s.rumors = [sharedRumor, ...(s.rumors ?? [])].slice(0, 5);
      logText = `You shared a rumor with ${p.name}: "${sharedRumor}". They appreciated the info.`;
      logEmoji = '🗣️';
      addMem('You shared useful information with me.');
      break;
    }

    case 'give_gift':
      if (s.player.money >= 25) {
        adjPlayer('money', -25);
        clampPerson('relationship', rand(10, 18));
        clampPerson('trust', rand(5, 10));
        clampPerson('respect', rand(3, 7));
        logText = `You gave ${p.name} a gift worth 25 gold. They were visibly moved.`;
        logEmoji = '🎁';
        addMem('You gave me a generous gift.');
      } else {
        logText = `Not enough gold to give a gift. (25g needed)`;
      }
      break;

    case 'ask_rumor':
      if (p.trust >= 40) {
        const rumor = generateRumor();
        s.rumors = [rumor, ...(s.rumors ?? [])].slice(0, 5);
        s.eventLog = [
          { id: `rumor_${Date.now()}`, age: s.player.age, text: `${p.name} whispers: "${rumor}"`, type: 'rumor', emoji: '👂' },
          ...s.eventLog,
        ];
        adjPlayer('stamina', -1);
        logText = `${p.name} whispered a rumor: "${rumor}"`;
        logEmoji = '👂';
      } else {
        logText = `${p.name} doesn't trust you enough to share rumors yet.`;
      }
      break;

    // ── ROMANCE ───────────────────────────────────────────────────────────────
    case 'flirt': {
      const charm = s.player.stats.charisma;
      const success = chance(0.3 + charm * 0.05);
      if (success) {
        clampPerson('relationship', rand(5, 12));
        clampPerson('trust', rand(1, 4));
        adjPlayer('stamina', -2);
        logText = `You flirted with ${p.name} — it landed well. A spark ignited.`;
      } else {
        clampPerson('relationship', -rand(3, 7));
        adjPlayer('stamina', -2);
        logText = `Your flirting with ${p.name} fell flat. They looked unimpressed.`;
      }
      logEmoji = '😍';
      break;
    }

    case 'go_drink':
      if (s.player.money >= 15) {
        adjPlayer('money', -15);
        adjPlayer('stamina', -rand(5, 10));
        adjPlayer('health', -rand(1, 3));
        adjPlayer('heat', -rand(3, 6));
        clampPerson('relationship', rand(8, 15));
        clampPerson('trust', rand(3, 8));
        clampPerson('fear', -rand(2, 5));
        logText = `You shared drinks with ${p.name}. Inhibitions lowered, bonds deepened. Heat cooled.`;
        logEmoji = '🍺';
        addMem('We drank together. It was a good night.');
      } else {
        logText = `Not enough gold to buy drinks. (15g needed)`;
      }
      break;

    case 'make_love':
      if (p.relationship >= 60) {
        adjPlayer('health', rand(3, 8));
        adjPlayer('stamina', -rand(10, 20));
        clampPerson('relationship', rand(12, 22));
        clampPerson('trust', rand(8, 15));
        clampPerson('fear', -rand(5, 10));
        clampPerson('respect', rand(5, 10));
        logText = `An intimate moment with ${p.name}. Your bond deepened profoundly.`;
        logEmoji = '❤️';
        addMem('We shared an intimate moment together.');
        // Chance to shift role to lover
        if (p.relationship >= 75 && p.role !== 'lover') {
          p.role = 'lover';
          p.statusLabels = [...new Set([...p.statusLabels, 'Lover' as const])];
        }
      } else {
        logText = `${p.name} isn't close enough for that. Build more relationship first.`;
      }
      break;

    case 'propose_partnership':
      if (p.trust >= 60) {
        clampPerson('respect', rand(10, 20));
        clampPerson('relationship', rand(5, 12));
        adjPubRep(rand(2, 5));
        adjUWRep(rand(3, 7));
        logText = `${p.name} agreed to a business partnership. Your combined reputation grows.`;
        logEmoji = '🤝';
        addMem('We became business partners.');
        p.statusLabels = [...new Set([...p.statusLabels, 'Business Partner' as const])];
      } else {
        logText = `${p.name} doesn't trust you enough for a partnership yet.`;
      }
      break;

    // ── BUSINESS ──────────────────────────────────────────────────────────────
    case 'bribe':
      if (s.player.money >= 30) {
        adjPlayer('money', -30);
        adjPlayer('heat', -rand(3, 8));
        if (chance(0.65)) {
          clampPerson('relationship', rand(6, 14));
          clampPerson('trust', rand(2, 5));
          logText = `You bribed ${p.name}. The gold worked — their attitude shifted.`;
          logEmoji = '💰';
        } else {
          clampPerson('relationship', -rand(6, 12));
          clampPerson('trust', -rand(5, 10));
          adjPlayer('heat', rand(3, 6));
          logText = `${p.name} was offended by your bribe attempt. Things got worse.`;
        }
        addMem('You tried to bribe me.');
      } else {
        logText = `Not enough gold to bribe. (30g needed)`;
      }
      break;

    case 'loan_gold':
      if (s.player.money >= 50) {
        adjPlayer('money', -50);
        p.debtToPlayer = (p.debtToPlayer ?? 0) + 50;
        clampPerson('relationship', rand(8, 15));
        clampPerson('trust', rand(5, 10));
        logText = `You loaned ${p.name} 50 gold. They owe you now — collect when the time is right.`;
        logEmoji = '🏦';
        addMem('You lent me 50 gold when I needed it.');
      } else {
        logText = `Not enough gold to loan. (50g needed)`;
      }
      break;

    case 'collect_debt':
      if (p.debtToPlayer > 0) {
        const debt = p.debtToPlayer;
        if (chance(0.75)) {
          adjPlayer('money', debt);
          p.debtToPlayer = 0;
          clampPerson('trust', -rand(3, 7));
          clampPerson('relationship', -rand(2, 5));
          logText = `${p.name} paid back their debt of ${debt}g. They seemed relieved but slightly resentful.`;
          logEmoji = '💸';
          addMem('I repaid my debt to you.');
        } else {
          // Can't pay
          clampPerson('relationship', -rand(5, 10));
          clampPerson('trust', -rand(5, 10));
          logText = `${p.name} can't pay right now. They're embarrassed and your relationship strained.`;
          logEmoji = '💸';
          addMem('I failed to repay my debt. Shameful.');
        }
      } else {
        logText = `${p.name} doesn't owe you anything.`;
      }
      break;

    case 'extort':
      if (p.fear >= 30) {
        const extracted = rand(15, 40);
        adjPlayer('money', extracted);
        adjPlayer('heat', rand(5, 10));
        clampPerson('fear', rand(5, 12));
        clampPerson('relationship', -rand(10, 18));
        clampPerson('trust', -rand(8, 15));
        adjPubRep(-rand(3, 6));
        adjFearRep(rand(5, 10));
        logText = `You extorted ${extracted}g from ${p.name}. Heat rose. They'll never forget this.`;
        logEmoji = '🗡️';
        addMem('You extorted me. I will not forget this.');
      } else {
        logText = `${p.name} isn't afraid of you enough to extort. (Fear < 30)`;
      }
      break;

    // ── CONFLICT ──────────────────────────────────────────────────────────────
    case 'insult':
      clampPerson('relationship', -rand(8, 15));
      clampPerson('trust', -rand(5, 10));
      clampPerson('fear', rand(0, 4));
      adjPubRep(-rand(1, 3));
      adjPlayer('stamina', -2);
      logText = `You insulted ${p.name}. They glared at you. Relations are strained.`;
      logEmoji = '😤';
      addMem('You insulted me in front of others.');
      break;

    case 'threaten':
      clampPerson('fear', rand(12, 22));
      clampPerson('relationship', -rand(6, 12));
      clampPerson('trust', -rand(5, 10));
      adjFearRep(rand(4, 7));
      adjPubRep(-rand(3, 6));
      adjPlayer('heat', rand(2, 5));
      logText = `You threatened ${p.name}. Their fear spiked. Your public reputation suffered.`;
      logEmoji = '😠';
      addMem('You threatened me. I fear you.');
      break;

    case 'fight': {
      adjPlayer('stamina', -rand(10, 20));
      adjPlayer('heat', rand(5, 12));
      const won = chance(0.5 + (s.player.stats.strength - 5) * 0.05);
      if (won) {
        adjPlayer('health', -rand(3, 8));
        clampPerson('health' as any, -rand(15, 30));
        clampPerson('fear', rand(15, 25));
        clampPerson('relationship', -rand(10, 20));
        clampPerson('respect', rand(5, 12));
        adjFearRep(rand(5, 10));
        adjUWRep(rand(3, 6));
        logText = `You fought ${p.name} and won. They're shaken. Your fearsome reputation grows.`;
        logEmoji = '⚔️';
        addMem('You beat me in a fight. I respect your strength.');
      } else {
        adjPlayer('health', -rand(10, 20));
        clampPerson('relationship', -rand(5, 10));
        clampPerson('respect', -rand(5, 10));
        adjPubRep(-rand(2, 5));
        logText = `You fought ${p.name} and lost. Battered and humiliated, you retreated.`;
        logEmoji = '⚔️';
        addMem('You attacked me and lost. Pathetic.');
      }
      break;
    }

    case 'betray': {
      const betrayGold = rand(50, 120);
      adjPlayer('money', betrayGold);
      adjPlayer('heat', rand(10, 20));
      adjPubRep(-rand(8, 15));
      adjUWRep(-rand(5, 10));
      clampPerson('relationship', -rand(40, 70));
      clampPerson('trust', -rand(40, 60));
      clampPerson('fear', rand(10, 20));
      logText = `You betrayed ${p.name} for ${betrayGold}g. A profitable move — but your reputation took a serious hit.`;
      logEmoji = '🗡️';
      addMem('You betrayed me. I will never forgive you.');
      p.statusLabels = [...new Set([...p.statusLabels, 'Betrayed' as const])];
      break;
    }

    default:
      clampPerson('relationship', rand(1, 3));
      logText = `You interacted with ${p.name}.`;
      break;
  }

  s.people = { ...s.people, [personId]: p };
  s.eventLog = [
    {
      id: `person_${Date.now()}`,
      age: s.player.age,
      text: logText,
      type: 'relationship',
      emoji: logEmoji,
    },
    ...s.eventLog,
  ];

  void saveGame(s);
  return s;
}

// ===== RUMOR GENERATION =====
const RUMORS = [
  'Dragon Resin prices are rising in the Vampire Court.',
  'Goblin Dust has flooded the Orc Warcamp — prices are rock bottom.',
  'Guards are searching travelers near the Dwarf Mines.',
  'Ghost Mist is scarce this year. Prices will spike.',
  'A mysterious buyer in Elvenwood is paying triple for Siren Tears.',
  'The Fairy Glade festival increased demand for Pixie Sparks.',
  'A new route through Ghost Marsh avoids the main guard checkpoint.',
  'Moonleaf supply is low this season. Buy before it runs out.',
  'Vampire Ash is back in fashion at the Dragon Peaks court.',
  'A dwarf caravan was robbed — Dream Sap is now very scarce.',
  'Witchroot shamans are gathering. Demand will spike soon.',
  'The Orc Warcamp guard has been bribed. Travel there is safer this year.',
  'Someone is spreading rumors about your goods being counterfeit.',
  'A legendary dealer was spotted heading toward Dragon Peaks.',
];

export function generateRumor(): string {
  return RUMORS[rand(0, RUMORS.length - 1)];
}

// ===== NEW GAME =====
export function createNewGame(
  playerName: string,
  gender: 'male' | 'female' | 'other',
  fatherRaceId: RaceId,
  motherRaceId: RaceId
): GameState {
  const playerRaceId = inheritRace(fatherRaceId, motherRaceId);
  const race = RACES[playerRaceId];
  const { stats, health, stamina } = generateInitialStats(playerRaceId);

  const father = generateParent('father', fatherRaceId);
  const mother = generateParent('mother', motherRaceId);

  // Generate merchants for each location
  const merchants: Record<string, Person> = {};
  for (const loc of LOCATION_LIST) {
    const merchant = generateMerchant(loc.merchantId, loc.raceId, loc.id);
    merchant.id = loc.merchantId;
    merchants[loc.merchantId] = merchant;
  }

  // Seed a rival
  const rival = generateRival();

  const people: Record<string, Person> = {
    [father.id]: father,
    [mother.id]: mother,
    [rival.id]: rival,
    ...merchants,
  };

  const startLocation = race.homeLocationId;
  const initialYear = 1;
  const markets = initAllMarkets(initialYear);

  const reputation: Reputation = {
    public: 0,
    underworld: 0,
    fear: 0,
    publicLabel: 'Neutral',
    underworldRank: 'Nobody',
  };

  const player: Player = {
    id: `player_${Date.now()}`,
    name: playerName,
    gender,
    age: 0,
    raceId: playerRaceId,
    fatherId: father.id,
    motherId: mother.id,
    money: rand(20, 50),
    stats,
    health,
    stamina,
    reputation,
    heat: 0,
    carryCapacity: 50,
    activityCounts: {},
  };

  player.carryCapacity = calcCarryCapacity(player);

  const inventory: Inventory = {
    items: {} as Record<ItemId, number>,
    capacityUsed: 0,
    capacityMax: player.carryCapacity,
  };

  const fatherRace = RACES[fatherRaceId];
  const motherRace = RACES[motherRaceId];

  const birthLog: EventLogEntry = {
    id: `birth_${Date.now()}`,
    age: 0,
    text: `You were born in ${LOCATIONS[startLocation].name} to a ${fatherRace.name} father and a ${motherRace.name} mother. You inherited the blood of the ${race.name}.`,
    type: 'birth',
    emoji: '👶',
  };

  const state: GameState = {
    player,
    currentYear: initialYear,
    currentLocationId: startLocation,
    markets,
    people,
    inventory,
    eventLog: [birthLog],
    flags: {},
    pendingEvent: null,
    screen: 'main',
    rumors: [],
  };

  void saveGame(state);
  return state;
}
