// Core game types for Dealer Life Simulator

export type Gender = 'male' | 'female' | 'other';

export type RaceId =
  | 'goblin'
  | 'elf'
  | 'dwarf'
  | 'golem'
  | 'ghost'
  | 'orc'
  | 'fairy'
  | 'vampire'
  | 'werewolf'
  | 'dragonkin';

export type LocationId =
  | 'goblinland'
  | 'elvenwood'
  | 'dwarf_mines'
  | 'ghost_marsh'
  | 'orc_warcamp'
  | 'fairy_glade'
  | 'vampire_court'
  | 'golem_quarry'
  | 'dragon_peaks'
  | 'moonfang_wilds';

export type ItemId =
  | 'moonleaf'
  | 'goblin_dust'
  | 'dream_sap'
  | 'pixie_sparks'
  | 'dragon_resin'
  | 'ghost_mist'
  | 'ogre_brew'
  | 'witchroot'
  | 'vampire_ash'
  | 'siren_tears';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export type PersonRole =
  | 'family'
  | 'merchant'
  | 'dealer'
  | 'rival'
  | 'friend'
  | 'lover'
  | 'enemy'
  | 'contact'
  | 'informant';

export type RelationshipStatus =
  | 'Beloved'
  | 'Friendly'
  | 'Neutral'
  | 'Suspicious'
  | 'Hostile'
  | 'Rival'
  | 'Enemy'
  | 'Terrified'
  | 'Loyal'
  | 'In Debt'
  | 'Betrayed'
  | 'Family'
  | 'Lover'
  | 'Business Partner'
  | 'Dead';

export type PublicRepLabel =
  | 'Beloved'
  | 'Honorable'
  | 'Helpful'
  | 'Neutral'
  | 'Suspicious'
  | 'Dangerous'
  | 'Infamous'
  | 'Outcast'
  | 'Folk Hero';

export type UnderworldRank =
  | 'Nobody'
  | 'Errand Runner'
  | 'Hustler'
  | 'Trusted Courier'
  | 'Regional Dealer'
  | 'Black Market Baron'
  | 'Mythic Kingpin';

export interface Stats {
  strength: number;
  intelligence: number;
  charisma: number;
  luck: number;
}

export interface Reputation {
  public: number;       // -100 to 100
  underworld: number;   // 0 to 100
  fear: number;         // 0 to 100
  publicLabel: PublicRepLabel;
  underworldRank: UnderworldRank;
}

export interface PersonMemory {
  age: number;
  description: string;
  impact?: {
    relationship?: number;
    trust?: number;
    fear?: number;
    respect?: number;
  };
}

export interface Person {
  id: string;
  name: string;
  raceId: RaceId;
  age: number;
  gender?: Gender;
  role: PersonRole;
  locationId?: LocationId;
  emoji: string;
  traits: string[];
  relationship: number;   // -100 to 100
  trust: number;          // 0 to 100
  fear: number;           // 0 to 100
  respect: number;        // 0 to 100
  debtToPlayer: number;
  playerDebtToThem: number;
  statusLabels: RelationshipStatus[];
  memories: PersonMemory[];
  isAlive: boolean;
}

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  raceId: RaceId;
  fatherId: string;
  motherId: string;
  money: number;
  stats: Stats;
  health: number;   // 0-100
  stamina: number;  // 0-100
  reputation: Reputation;
  heat: number;     // 0-100
  carryCapacity: number;
  activityCounts: Record<string, number>; // per-year activity usage
}

export interface InventoryItem {
  itemId: ItemId;
  quantity: number;
}

export interface Inventory {
  items: Record<ItemId, number>;
  capacityUsed: number;
  capacityMax: number;
}

export interface MarketState {
  locationId: LocationId;
  year: number;
  prices: Record<ItemId, number>;
  stock: Record<ItemId, number>;
  heat: number;
}

export interface EventLogEntry {
  id: string;
  age: number;
  text: string;
  type: 'birth' | 'travel' | 'trade' | 'event' | 'activity' | 'relationship' | 'age_up' | 'death' | 'rumor';
  emoji?: string;
}

export interface EventChoice {
  id: string;
  label: string;
  requiresStat?: { stat: keyof Stats | 'health' | 'stamina' | 'money' | 'heat'; min?: number; max?: number };
  requiresItem?: ItemId;
  outcomes: EventOutcome[];
}

export interface EventOutcome {
  description: string;
  probability: number;
  effects: Effect[];
  addPerson?: Partial<Person>;
}

export interface Effect {
  type:
    | 'money'
    | 'health'
    | 'stamina'
    | 'heat'
    | 'stat'
    | 'reputation_public'
    | 'reputation_underworld'
    | 'reputation_fear'
    | 'relationship'
    | 'add_item'
    | 'remove_item'
    | 'log';
  value?: number;
  stat?: keyof Stats;
  personId?: string;
  itemId?: ItemId;
  text?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  choices: EventChoice[];
  tags: string[];
}

export interface GameState {
  player: Player;
  currentYear: number;
  currentLocationId: LocationId;
  markets: Record<LocationId, MarketState>;
  people: Record<string, Person>;
  inventory: Inventory;
  eventLog: EventLogEntry[];
  flags: Record<string, boolean | number | string>;
  pendingEvent: ActiveEvent | null;
  screen: GameScreen;
  rumors: string[];
}

export interface ActiveEvent {
  event: GameEvent;
  phase: number;
  chosenChoiceId?: string;
}

export type GameScreen =
  | 'main_menu'
  | 'new_game'
  | 'main'
  | 'character'
  | 'inventory'
  | 'market'
  | 'map'
  | 'activities'
  | 'people'
  | 'person_detail'
  | 'death';

export interface Race {
  id: RaceId;
  name: string;
  emoji: string;
  description: string;
  statModifiers: Partial<Stats>;
  healthModifier: number;
  staminaModifier: number;
  carryCapacityModifier: number;
  travelRiskModifier: number;
  tags: string[];
  homeLocationId: LocationId;
  flavor: string;
}

export interface ContrabandItem {
  id: ItemId;
  name: string;
  emoji: string;
  description: string;
  basePrice: number;
  weight: number;
  rarity: Rarity;
  risk: number;
  volatility: number;
  nativeLocationId?: LocationId;
}

export interface TravelRoute {
  toLocationId: LocationId;
  cost: number;
  riskLevel: number;
}

export interface Location {
  id: LocationId;
  name: string;
  raceId: RaceId;
  emoji: string;
  description: string;
  bgColor: string;
  accentColor: string;
  nativeItemId: ItemId;
  travelRoutes: TravelRoute[];
  lawRisk: number;
  baseTravelRisk: number;
  uniqueActivityIds: string[];
  priceModifiers: Partial<Record<ItemId, number>>;
  merchantId: string;
  culture: string;
}

export interface Activity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  locationId?: LocationId; // undefined = always available
  cooldownPerYear: number; // max uses per year
  effects: Effect[];
  riskEffects?: Effect[]; // effects on failure
  riskChance?: number;
  requiresMinAge?: number;
  requiresStat?: { stat: keyof Stats; min: number };
}
