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
  let staminaChange = -1;

  if (newAge > 60) {
    healthChange -= 3;
    staminaChange -= 2;
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

  switch (action) {
    case 'compliment':
      p.relationship = Math.min(100, p.relationship + rand(3, 8));
      p.trust = Math.min(100, p.trust + rand(1, 4));
      logText = `You complimented ${p.name}. They seemed pleased.`;
      break;
    case 'insult':
      p.relationship = Math.max(-100, p.relationship - rand(8, 15));
      p.fear = Math.min(100, p.fear + rand(0, 5));
      logText = `You insulted ${p.name}. They'll remember that.`;
      p.memories = [{ age: s.player.age, description: 'You insulted me in public.' }, ...p.memories].slice(0, 10);
      logEmoji = '😤';
      break;
    case 'give_gift':
      if (s.player.money >= 25) {
        s.player = { ...s.player, money: s.player.money - 25 };
        p.relationship = Math.min(100, p.relationship + rand(8, 15));
        p.trust = Math.min(100, p.trust + rand(3, 8));
        logText = `You gave ${p.name} a gift worth 25 gold. They're touched.`;
        p.memories = [{ age: s.player.age, description: 'You gave me a generous gift.' }, ...p.memories].slice(0, 10);
        logEmoji = '🎁';
      } else {
        logText = 'Not enough gold to give a gift.';
      }
      break;
    case 'threaten':
      p.fear = Math.min(100, p.fear + rand(10, 20));
      p.relationship = Math.max(-100, p.relationship - rand(5, 10));
      s.player = {
        ...s.player,
        reputation: {
          ...s.player.reputation,
          fear: Math.min(100, s.player.reputation.fear + 3),
          public: Math.max(-100, s.player.reputation.public - 3),
          publicLabel: getPublicRepLabel(s.player.reputation.public - 3),
          underworldRank: s.player.reputation.underworldRank,
        },
      };
      logText = `You threatened ${p.name}. Fear rose. Your public reputation suffered.`;
      p.memories = [{ age: s.player.age, description: 'You threatened me.' }, ...p.memories].slice(0, 10);
      logEmoji = '😠';
      break;
    case 'ask_rumor':
      if (p.trust >= 40) {
        const rumor = generateRumor();
        s.rumors = [rumor, ...(s.rumors ?? [])].slice(0, 5);
        s.eventLog = [
          {
            id: `rumor_${Date.now()}`,
            age: s.player.age,
            text: `${p.name} whispers: "${rumor}"`,
            type: 'rumor',
            emoji: '👂',
          },
          ...s.eventLog,
        ];
        logText = `${p.name} shared a market rumor with you.`;
      } else {
        logText = `${p.name} doesn't trust you enough to share rumors.`;
      }
      break;
    case 'bribe':
      if (s.player.money >= 30) {
        s.player = { ...s.player, money: s.player.money - 30 };
        if (chance(0.7)) {
          p.relationship = Math.min(100, p.relationship + rand(5, 12));
          logText = `You bribed ${p.name}. The gold worked.`;
          logEmoji = '💰';
        } else {
          p.relationship = Math.max(-100, p.relationship - rand(5, 10));
          logText = `${p.name} was offended by your bribe attempt.`;
        }
        p.memories = [{ age: s.player.age, description: 'You tried to bribe me.' }, ...p.memories].slice(0, 10);
      } else {
        logText = 'Not enough gold to bribe.';
      }
      break;
    case 'apologize':
      p.relationship = Math.min(100, p.relationship + rand(4, 8));
      p.trust = Math.min(100, p.trust + rand(2, 5));
      logText = `You apologized to ${p.name}. They seemed to accept it.`;
      break;
    case 'talk':
    default:
      p.relationship = Math.min(100, p.relationship + rand(1, 4));
      logText = `You had a conversation with ${p.name}.`;
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
