// Dealer World Typings

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

export type Gender = "Male" | "Female" | "Other";

export const fantasyNames = [
  "Ashwyn",
  "Bram",
  "Cindrel",
  "Drek",
  "Elowen",
  "Fenn",
  "Garruk",
  "Halcyon",
  "Isolde",
  "Jarek",
  "Kaelen",
  "Lyra",
  "Morrik",
  "Nyssa",
  "Orin",
  "Pax",
  "Quinn",
  "Riven",
  "Sylas",
  "Thera",
  "Ulric",
  "Vanya",
  "Wren",
  "Xara",
  "Ysra",
  "Zarek",
];

export interface Stats {
  strength: number;
  speed: number;
  sanity: number;
  life: number;
  gold: number;
}

export interface Dealer {
  name: string;
  race: Race;
  gender: Gender;
  stats: Stats;
}

// Static Races & Genders Metadata
export const races: { label: Race; icon: string; description: string }[] = [
  {
    label: "Human",
    icon: "🧑‍🦱",
    description: "Streetwise survivor of the magical black market.",
  },
  {
    label: "Elf",
    icon: "🧝‍♂️",
    description: "Elegant and precise, trades with flair.",
  },
  {
    label: "Dwarf",
    icon: "🧔",
    description: "Tough and relentless, master of underground deals.",
  },
  {
    label: "Goblin",
    icon: "👺",
    description: "Shifty and unpredictable, thrives on chaos.",
  },
  {
    label: "Orc",
    icon: "👹",
    description: "Strength-driven, intimidates competitors easily.",
  },
  {
    label: "Vampire",
    icon: "🧛‍♂️",
    description: "Nocturnal trader, blood deals at midnight.",
  },
  {
    label: "Werewolf",
    icon: "🐺",
    description: "Wild and loyal, runs fast deals.",
  },
  {
    label: "Fairy",
    icon: "🧚‍♂️",
    description: "Small but resourceful, specialist in rare goods.",
  },
  {
    label: "Demon",
    icon: "😈",
    description: "Dark-bargain master, always one step ahead.",
  },
  {
    label: "Angel",
    icon: "👼",
    description: "Fallen from grace, still playing the game.",
  },
  {
    label: "Golem",
    icon: "🪨",
    description: "Silent but unstoppable, carries massive loads.",
  },
  {
    label: "Lizardfolk",
    icon: "🦎",
    description: "Sly and swift, blends into any market.",
  },
];

export const genders: { label: Gender; icon: string }[] = [
  { label: "Male", icon: "♂️" },
  { label: "Female", icon: "♀️" },
  { label: "Other", icon: "⚧️" },
];
