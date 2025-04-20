// /types/game.ts

import { Gender, Race } from "./character";

export type LocationType =
  | "Human City"
  | "Elven Forest"
  | "Dwarven Mountain"
  | "Goblin Caves"
  | "Orcish Plains"
  | "Arcane Tower"
  | "Crystal Shores"
  | "Shroomgrove"
  | "Ashen Wastes"
  | "Dwarven Halls"
  | "Sunscorched Desert"
  | "Haunted Marsh"
  | "Dark Forest";

// Product / Drug available in the game
export interface Product {
  id: string;
  name: string;
  basePrice: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  icon: string; // ✅ Added officially
}

export interface StorageItem {
  productId: string;
  quantity: number;
  totalSpent: number; // ✅ New field to track total spent on that product
}

// Full DealerState during the game
export interface DealerState {
  id: string;
  name: string;
  race: Race;
  gender: Gender;
  time: {
    age: number;
    month: number;
    year: number;
  };
  stats: {
    strength: number;
    speed: number;
    sanity: number;
    life: number;
    gold: number;
  };
  location: LocationType;
  storage: StorageItem[];
  knownContacts: string[];
}
