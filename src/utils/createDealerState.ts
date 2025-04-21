// /utils/createDealerState.ts

import { Dealer } from "../types/character";
import { DealerState } from "../types/game";
import { raceStartingLocations } from "./raceStartingLocation";

export function createDealerState(dealer: Dealer): DealerState {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const formattedDate = `${
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][currentMonth]
  } ${currentYear}`;

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
      gold: 1000,
      reputation: 0,
      totalGoldEarned: 0,
      totalGoldSpent: 0,
      totalTrades: 0,
    },
    location: raceStartingLocations[dealer.race],
    storage: [],
    knownContacts: [],
    journal: [
      {
        date: formattedDate,
        text: `🌟 ${dealer.name} turned 18 and officially stepped into the street trade. Let the shady saga begin...`,
      },
    ],
  };
}
