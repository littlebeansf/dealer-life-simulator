import { fantasyNames, Race, Gender, races, genders } from "../types/character";

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomDealerData() {
  const name = getRandomElement(fantasyNames);
  const race = getRandomElement(races).label;
  const gender = getRandomElement(genders).label;

  return { name, race, gender };
}
