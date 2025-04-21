import { useState, useEffect } from "react";
import { useToast, Box } from "@chakra-ui/react";
import { products } from "@/data/products";
import {
  advanceTime,
  generateMarketPrices,
  generateMarketStock,
} from "@/utils/gameLogic";
import { DealerState } from "@/types/game";

export function useGameActions(
  dealerState: DealerState,
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>
) {
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [marketStock, setMarketStock] = useState<Record<string, number>>({});
  const [buyAmounts, setBuyAmounts] = useState<Record<string, number>>({});
  const [defaultBuyAmount, setDefaultBuyAmount] = useState<number>(1);

  const toast = useToast();

  const monthNames = [
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
  ];

  const getProductById = (id: string) => products.find((p) => p.id === id);

  useEffect(() => {
    setMarketPrices(generateMarketPrices(products));
    setMarketStock(generateMarketStock(products));
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const initialBuyAmounts: Record<string, number> = {};
      products.forEach((product) => {
        initialBuyAmounts[product.id] = defaultBuyAmount;
      });
      setBuyAmounts(initialBuyAmounts);
    }
  }, [defaultBuyAmount]);

  const handleNextTurn = () => {
    const nextDealerState = advanceTime(dealerState);

    const startingAge = 18;
    const startYear = 2025;
    const startMonth = 3; // April = 3

    const oldMonthsPassed =
      (dealerState.time.year - startYear) * 12 +
      (dealerState.time.month - startMonth);
    const newMonthsPassed =
      (nextDealerState.time.year - startYear) * 12 +
      (nextDealerState.time.month - startMonth);

    const oldAge = startingAge + Math.floor(oldMonthsPassed / 12);
    const newAge = startingAge + Math.floor(newMonthsPassed / 12);

    let newJournal = [...dealerState.journal];
    const currentDate = `${monthNames[nextDealerState.time.month]} ${
      nextDealerState.time.year
    }`;

    if (newAge > oldAge) {
      newJournal.push({
        date: currentDate,
        text: `${dealerState.name} celebrated their ${newAge}th birthday, and the streets cheered.`,
      });

      toast({
        title: "🎉 Happy Birthday!",
        description: `You are now ${newAge} years old! 🧙‍♂️`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    } else {
      newJournal.push({
        date: currentDate,
        text: `Another month passed. ${dealerState.name} is still hustling...`,
      });

      toast({
        title: "Month Advanced",
        description: `Welcome to ${currentDate}`,
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }

    setDealerState({
      ...nextDealerState,
      journal: newJournal,
    });

    setMarketPrices(generateMarketPrices(products));
    setMarketStock(generateMarketStock(products));
  };

  const handleBuy = (productId: string) => {
    const quantity = buyAmounts[productId] || 1;
    const price = marketPrices[productId];
    const stock = marketStock[productId];
    const product = getProductById(productId);
    if (!product || quantity > stock) return;

    const totalPrice = price * quantity;
    if (dealerState.stats.gold < totalPrice) return;

    const existingItem = dealerState.storage.find(
      (item) => item.productId === product.id
    );
    let newStorage = [...dealerState.storage];

    if (existingItem) {
      newStorage = newStorage.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              totalSpent: item.totalSpent + totalPrice,
            }
          : item
      );
    } else {
      newStorage.push({
        productId: product.id,
        quantity,
        totalSpent: totalPrice,
      });
    }

    const newJournal = [
      ...dealerState.journal,
      {
        date: `${monthNames[dealerState.time.month]} ${dealerState.time.year}`,
        text: `${dealerState.name} bought ${quantity}x ${product.name} for ${totalPrice} gold.`,
      },
    ];

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: dealerState.stats.gold - totalPrice,
        totalTrades: dealerState.stats.totalTrades + 1,
        totalGoldSpent: dealerState.stats.totalGoldSpent + totalPrice,
      },
      storage: newStorage,
      journal: newJournal,
    });

    setMarketStock((prev) => ({ ...prev, [productId]: stock - quantity }));

    toast({
      duration: 3000,
      isClosable: true,
      position: "top-left",
      render: () => (
        <Box
          p={3}
          bg="red.500"
          borderRadius="md"
          color="white"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Box fontSize="2xl">{product.icon}</Box>
          <Box>
            <strong>
              Bought {quantity}x {product.name}
            </strong>
            <br />
            Spent ${totalPrice}
          </Box>
        </Box>
      ),
    });
  };

  const handleSellAmount = (productId: string, amount: number) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    const product = getProductById(productId);
    if (!existingItem || existingItem.quantity <= 0 || !product) return;

    const sellAmount = Math.min(existingItem.quantity, amount);
    const newStorage = dealerState.storage
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - sellAmount }
          : item
      )
      .filter((item) => item.quantity > 0);

    const newJournal = [
      ...dealerState.journal,
      {
        date: `${monthNames[dealerState.time.month]} ${dealerState.time.year}`,
        text: `${dealerState.name} sold ${sellAmount}x ${product.name} for ${
          price * sellAmount
        } gold.`,
      },
    ];

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: dealerState.stats.gold + price * sellAmount,
        totalTrades: dealerState.stats.totalTrades + 1,
        totalGoldEarned: dealerState.stats.totalGoldEarned + price * sellAmount,
      },
      storage: newStorage,
      journal: newJournal,
    });

    toast({
      duration: 3000,
      isClosable: true,
      position: "top-left",
      render: () => (
        <Box
          p={3}
          bg="green.500"
          borderRadius="md"
          color="white"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Box fontSize="2xl">{product.icon}</Box>
          <Box>
            <strong>
              Sold {sellAmount}x {product.name}
            </strong>
            <br />
            Gained ${price * sellAmount}
          </Box>
        </Box>
      ),
    });
  };

  const handleSellAll = (productId: string) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    const product = getProductById(productId);
    if (!existingItem || !product) return;

    const newStorage = dealerState.storage.filter(
      (item) => item.productId !== productId
    );

    const newJournal = [
      ...dealerState.journal,
      {
        date: `${monthNames[dealerState.time.month]} ${dealerState.time.year}`,
        text: `${dealerState.name} sold ALL of their ${
          product.name
        } stash for ${price * existingItem.quantity} gold.`,
      },
    ];

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: dealerState.stats.gold + price * existingItem.quantity,
        totalTrades: dealerState.stats.totalTrades + 1,
        totalGoldEarned:
          dealerState.stats.totalGoldEarned + price * existingItem.quantity,
      },
      storage: newStorage,
      journal: newJournal,
    });

    toast({
      duration: 3000,
      isClosable: true,
      position: "top-left",
      render: () => (
        <Box
          p={3}
          bg="green.500"
          borderRadius="md"
          color="white"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Box fontSize="2xl">{product.icon}</Box>
          <Box>
            <strong>Sold all {product.name}</strong>
            <br />
            Gained ${price * existingItem.quantity}
          </Box>
        </Box>
      ),
    });
  };

  const totalStorageValue = dealerState.storage.reduce((sum, item) => {
    const productPrice = marketPrices[item.productId] || 0;
    return sum + productPrice * item.quantity;
  }, 0);

  return {
    marketPrices,
    marketStock,
    buyAmounts,
    defaultBuyAmount,
    setBuyAmounts,
    setDefaultBuyAmount,
    handleNextTurn,
    handleBuy,
    handleSellAmount,
    handleSellAll,
    totalStorageValue,
  };
}
