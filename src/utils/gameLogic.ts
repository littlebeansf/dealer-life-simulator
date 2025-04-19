import { DealerState } from "../types/game";
import { Product } from "../types/game";

// Advance time by 1 month
export function advanceTime(state: DealerState): DealerState {
  let newMonth = state.time.month + 1;
  let newYear = state.time.year;
  let newAge = state.time.age;

  if (newMonth > 11) {
    newMonth = 0;
    newYear += 1;
    newAge += 1;
  }

  return {
    ...state,
    time: {
      year: newYear,
      month: newMonth,
      age: newAge,
    },
  };
}

// Generate market prices randomly based on base price
export function generateMarketPrices(
  products: Product[]
): Record<string, number> {
  const prices: Record<string, number> = {};

  products.forEach((product) => {
    // Random fluctuation between -20% and +20%
    const fluctuation = 1 + (Math.random() * 0.4 - 0.2);
    const price = Math.round(product.basePrice * fluctuation);
    prices[product.id] = price;
  });

  return prices;
}
