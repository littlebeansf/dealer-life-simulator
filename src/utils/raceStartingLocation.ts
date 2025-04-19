// /utils/raceStartingLocations.ts

import { Race } from "../types/character";
import { LocationType } from "../types/game";

export const raceStartingLocations: Record<Race, LocationType> = {
  Human: "Human City",
  Elf: "Elven Forest",
  Dwarf: "Dwarven Mountain",
  Goblin: "Goblin Caves",
  Orc: "Orcish Plains",
  Vampire: "Haunted Marsh",
  Werewolf: "Dark Forest",
  Fairy: "Elven Forest",
  Demon: "Ashen Wastes",
  Angel: "Arcane Tower",
  Golem: "Dwarven Halls",
  Lizardfolk: "Shroomgrove",
};
