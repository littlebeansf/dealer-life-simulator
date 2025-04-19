// /utils/createDealerState.ts

import { Dealer } from "../types/character";
import { DealerState } from "../types/game";
import { raceStartingLocations } from "./raceStartingLocation";

export function createDealerState(dealer: Dealer): DealerState {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return {
    id: crypto.randomUUID(),
    name: dealer.name,
    race: dealer.race,
    gender: dealer.gender,
    time: {
      age: 18,
      month: currentMonth,
      year: currentYear,
    },
    stats: {
      strength: dealer.stats.strength,
      speed: dealer.stats.speed,
      sanity: dealer.stats.sanity,
      life: dealer.stats.life,
      gold: 1000, // ✅ Start with 1000 gold
    },
    location: raceStartingLocations[dealer.race],
    storage: [],
    knownContacts: [],
  };
}
