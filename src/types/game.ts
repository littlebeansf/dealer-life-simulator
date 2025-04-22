import { LocationType } from "@/data/locations";
import { Gender, Race } from "./character";

// Type for Dealer Scrolls entries
export interface JournalEntry {
  date: string; // e.g., "April 2025"
  text: string; // e.g., "X bought 10x Magical Shrooms at 50 gold each."
}

// Product / Drug available in the game
export interface Product {
  id: string;
  name: string;
  basePrice: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  icon: string;
  craftable?: boolean;
  addictionPotential?: number;
  availableAt: LocationType[];
}

export interface StorageItem {
  productId: string;
  quantity: number;
  totalSpent: number;
}

// Extended Dealer Stats
export interface DealerStats {
  strength: number;
  speed: number;
  sanity: number;
  life: number;
  gold: number;
  totalTrades: number;
  totalGoldEarned: number;
  totalGoldSpent: number;
  reputation: number;
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
  stats: DealerStats;
  location: LocationType;
  storage: StorageItem[];
  knownContacts: string[];
  journal: JournalEntry[]; // <<<<<< ✅ Added this to track Dealer Scrolls
}
