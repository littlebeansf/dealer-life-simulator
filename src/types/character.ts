// /types/character.ts

// Race types available in the game
export type Race =
  | "Human"
  | "Elf"
  | "Dwarf"
  | "Goblin"
  | "Orc"
  | "Vampire"
  | "Werewolf"
  | "Fairy"
  | "Demon"
  | "Angel"
  | "Golem"
  | "Lizardfolk";

// Gender types available in the game
export type Gender = "Male" | "Female" | "Other";

// Genders list for character creation screen
export const genders = [
  { label: "Male", icon: "♂️" },
  { label: "Female", icon: "♀️" },
  { label: "Other", icon: "⚧️" },
];

// Dealer structure (used for creating a new dealer character)
export interface Dealer {
  name: string;
  race: Race;
  gender: Gender;
  stats: {
    strength: number;
    speed: number;
    sanity: number;
    life: number;
    gold: number;
  };
}

// Races list for character creation screen
export const races = [
  { label: "Human", icon: "🧑‍🦱", description: "Versatile and adaptable." },
  { label: "Elf", icon: "🧝‍♂️", description: "Swift and wise." },
  { label: "Dwarf", icon: "🧔", description: "Tough and resilient." },
  { label: "Goblin", icon: "👺", description: "Cunning and tricky." },
  { label: "Orc", icon: "👹", description: "Brutal and strong." },
  { label: "Vampire", icon: "🧛‍♂️", description: "Elegant and deadly." },
  { label: "Werewolf", icon: "🐺", description: "Feral and fast." },
  { label: "Fairy", icon: "🧚‍♂️", description: "Charming and quick." },
  { label: "Demon", icon: "😈", description: "Powerful and feared." },
  { label: "Angel", icon: "👼", description: "Graceful and pure." },
  { label: "Golem", icon: "🪨", description: "Massive and immovable." },
  { label: "Lizardfolk", icon: "🦎", description: "Swift and slippery." },
];
