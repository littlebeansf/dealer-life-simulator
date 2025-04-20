import { Product } from "@/types/game";

export function generateMarketPrices(
  products: Product[]
): Record<string, number> {
  const prices: Record<string, number> = {};
  products.forEach((product) => {
    const fluctuation = Math.random() * 0.5 + 0.75; // 75% to 125%
    prices[product.id] = Math.floor(product.basePrice * fluctuation);
  });
  return prices;
}

export function generateMarketStock(
  products: Product[]
): Record<string, number> {
  const stock: Record<string, number> = {};
  products.forEach((product) => {
    stock[product.id] = Math.floor(Math.random() * 300) + 1; // Between 1–300 units
  });
  return stock;
}

export function advanceTime(dealerState: any) {
  const newMonth = (dealerState.time.month + 1) % 12;
  const newYear =
    dealerState.time.month === 11
      ? dealerState.time.year + 1
      : dealerState.time.year;
  const newAge =
    dealerState.time.month === 11
      ? dealerState.time.age + 1
      : dealerState.time.age;

  return {
    ...dealerState,
    time: {
      ...dealerState.time,
      month: newMonth,
      year: newYear,
      age: newAge,
    },
  };
}
