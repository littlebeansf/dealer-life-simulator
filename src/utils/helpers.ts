import { Race, Gender } from "../types/character";

const fantasyNames = [
  "Alaric",
  "Seraphina",
  "Thorne",
  "Lyra",
  "Kaelen",
  "Isolde",
  "Dorian",
  "Selene",
  "Magnus",
  "Elara",
  "Draven",
  "Vesper",
];

function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomDealerData(): {
  name: string;
  race: Race;
  gender: Gender;
} {
  const name = randomFromArray(fantasyNames);
  const race = randomFromArray([
    "Human",
    "Elf",
    "Dwarf",
    "Goblin",
    "Orc",
    "Vampire",
    "Werewolf",
    "Fairy",
    "Demon",
    "Angel",
    "Golem",
    "Lizardfolk",
    "Other", // ✅ Consider Other race if needed
  ]) as Race;
  const gender = randomFromArray([
    "Male",
    "Female",
    "Other", // ✅ Now correctly includes Other gender
  ]) as Gender;

  return {
    name,
    race,
    gender,
  };
}
