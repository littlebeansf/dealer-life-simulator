// /data/locations.ts

import { Race } from "@/types/character";

export type LocationType =
  | "Valewatch"
  | "Sylvanglade"
  | "Ironroot Bastion"
  | "Wretchgloom"
  | "Bloodfang Steppes"
  | "Astral Spire"
  | "Opal Shoals"
  | "Shroomgrove"
  | "Ashen Scar"
  | "Deepforge Warrens"
  | "Sunscorch Expanse"
  | "Weeping Marshes"
  | "Duskmire Woods"
  | "The Hollow Market"
  | "Crystal Rift";

export interface Location {
  id: LocationType;
  name: string;
  description: string;
  biome:
    | "City"
    | "Forest"
    | "Mountain"
    | "Caves"
    | "Plains"
    | "Ruins"
    | "Swamp"
    | "Coast"
    | "Wasteland"
    | "Bazaar";
  dominantRace?: Race;
  x: number; // for worldmap placement (we can adjust later)
  y: number;
}

export const locations: Location[] = [
  {
    id: "Valewatch",
    name: "Valewatch",
    description:
      "The vibrant beating heart of humankind. Bustling with trade, intrigue, and ambition.",
    biome: "City",
    dominantRace: "Human",
    x: 36,
    y: 40,
  },
  {
    id: "Sylvanglade",
    name: "Sylvanglade",
    description:
      "Whispering woods where ancient elven cities rise among giant silver trees.",
    biome: "Forest",
    dominantRace: "Elf",
    x: 26,
    y: 26,
  },
  {
    id: "Ironroot Bastion",
    name: "Ironroot Bastion",
    description:
      "Indomitable fortress-city carved into the roots of the Iron Mountains, home of Dwarves.",
    biome: "Mountain",
    dominantRace: "Dwarf",
    x: 24,
    y: 72,
  },
  {
    id: "Wretchgloom",
    name: "Wretchgloom",
    description:
      "Foul labyrinthine caves crawling with goblin tribes and shady dealings.",
    biome: "Caves",
    dominantRace: "Goblin",
    x: 24,
    y: 86,
  },
  {
    id: "Bloodfang Steppes",
    name: "Bloodfang Steppes",
    description: "Vast war-torn plains ruled by Orc clans and primal rage.",
    biome: "Plains",
    dominantRace: "Orc",
    x: 40,
    y: 80,
  },
  {
    id: "Astral Spire",
    name: "Astral Spire",
    description:
      "A floating monolithic tower shimmering with pure arcane energies. Angelic domain.",
    biome: "Ruins",
    dominantRace: "Angel",
    x: 71.5,
    y: 25,
  },
  {
    id: "Shroomgrove",
    name: "Shroomgrove",
    description:
      "A giant fungal jungle pulsating with life and dangerous spores, home of Lizardfolk.",
    biome: "Forest",
    dominantRace: "Lizardfolk",
    x: 44,
    y: 60,
  },
  {
    id: "Ashen Scar",
    name: "Ashen Scar",
    description:
      "Charred wastelands left behind after ancient demonic wars. Smells of sulfur and death.",
    biome: "Wasteland",
    dominantRace: "Demon",
    x: 56,
    y: 43,
  },
  {
    id: "Deepforge Warrens",
    name: "Deepforge Warrens",
    description:
      "Subterranean tunnels and halls where Golems and ancient engineers still dwell.",
    biome: "Mountain",
    dominantRace: "Golem",
    x: 15,
    y: 40,
  },
  {
    id: "Weeping Marshes",
    name: "Weeping Marshes",
    description:
      "Haunted wetlands shrouded in mist, where Vampires and lost souls stalk the night.",
    biome: "Swamp",
    dominantRace: "Vampire",
    x: 66,
    y: 48,
  },
  {
    id: "Duskmire Woods",
    name: "Duskmire Woods",
    description:
      "Darkened cursed forests howling with wolves and ancient terrors.",
    biome: "Forest",
    dominantRace: "Werewolf",
    x: 60,
    y: 66,
  },
  {
    id: "The Hollow Market",
    name: "The Hollow Market",
    description:
      "Secret underground city of thieves, assassins, and forbidden magic traders.",
    biome: "Bazaar",
    dominantRace: undefined, // Neutral / Dark economy
    x: 12,
    y: 60,
  },
  {
    id: "Opal Shoals",
    name: "Opal Shoals",
    description:
      "Iridescent beaches kissed by strange tides, where sirens lure the foolish.",
    biome: "Coast",
    dominantRace: undefined, // Neutral
    x: 55,
    y: 90,
  },
  {
    id: "Sunscorch Expanse",
    name: "Sunscorch Expanse",
    description:
      "Endless blazing deserts where reptilian tribes survive on bone and fire.",
    biome: "Plains",
    dominantRace: undefined, // Neutral desert
    x: 60,
    y: 78,
  },
  {
    id: "Crystal Rift",
    name: "Crystal Rift",
    description:
      "A shattered canyon where crystals hum with forgotten magic. Treasure hunters' paradise.",
    biome: "Ruins",
    dominantRace: undefined,
    x: 78,
    y: 57,
  },
];
