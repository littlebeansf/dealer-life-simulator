// /utils/raceStartingLocations.ts

import { LocationType } from "@/data/locations";
import { Race } from "../types/character";

export const raceStartingLocations: Record<Race, LocationType> = {
  Human: "Valewatch",
  Elf: "Sylvanglade",
  Dwarf: "Ironroot Bastion",
  Goblin: "Wretchgloom",
  Orc: "Bloodfang Steppes",
  Vampire: "Weeping Marshes",
  Werewolf: "Duskmire Woods",
  Fairy: "Sylvanglade",
  Demon: "Ashen Scar",
  Angel: "Astral Spire",
  Golem: "Deepforge Warrens",
  Lizardfolk: "Shroomgrove",
};
