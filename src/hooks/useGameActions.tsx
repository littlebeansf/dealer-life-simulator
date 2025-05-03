import { useState, useEffect } from "react";
import { useToast, Box, useColorModeValue, Text, Flex } from "@chakra-ui/react";
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
    const initialBuyAmounts: Record<string, number> = {};
    products.forEach((product) => {
      initialBuyAmounts[product.id] = defaultBuyAmount;
    });
    setBuyAmounts(initialBuyAmounts);
  }, [defaultBuyAmount]);

  const themedToastBox = (
    icon: string,
    title: string,
    description: string,
    bg: string
  ) => (
    <Box
      p={3}
      bg={bg}
      borderRadius="md"
      color={useColorModeValue("lightbrand.surface", "brand.surface")}
    >
      <Flex align="center" gap={2}>
        <Box fontSize="2xl">{icon}</Box>
        <Box>
          <Text fontWeight="bold">{title}</Text>
          <Text fontSize="sm">{description}</Text>
        </Box>
      </Flex>
    </Box>
  );

  const handleNextTurn = () => {
    const nextDealerState = advanceTime(dealerState);
    const startYear = 2025;
    const startMonth = 3;
    const startingAge = 18;

    const monthsPassed = (s: DealerState) =>
      (s.time.year - startYear) * 12 + (s.time.month - startMonth);

    const oldAge = startingAge + Math.floor(monthsPassed(dealerState) / 12);
    const newAge = startingAge + Math.floor(monthsPassed(nextDealerState) / 12);
    const currentDate = `${monthNames[nextDealerState.time.month]} ${
      nextDealerState.time.year
    }`;

    const newJournal = [...dealerState.journal];

    if (newAge > oldAge) {
      newJournal.push({
        date: currentDate,
        text: `${dealerState.name} celebrated their ${newAge}th birthday, and the streets cheered.`,
      });

      toast({
        duration: 4000,
        isClosable: true,
        position: "top-left",
        render: () =>
          themedToastBox(
            "🎉",
            "Happy Birthday!",
            `You are now ${newAge} years old!`,
            "green.500"
          ),
      });
    } else {
      newJournal.push({
        date: currentDate,
        text: `Another month passed. ${dealerState.name} is still hustling...`,
      });

      toast({
        duration: 3000,
        isClosable: true,
        position: "top-left",
        render: () =>
          themedToastBox(
            "⏳",
            "Month Advanced",
            `Welcome to ${currentDate}`,
            "blue.500"
          ),
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
    if (
      !product ||
      quantity > stock ||
      dealerState.stats.gold < price * quantity
    )
      return;

    const totalPrice = price * quantity;
    const existingItem = dealerState.storage.find(
      (i) => i.productId === product.id
    );
    const newStorage = existingItem
      ? dealerState.storage.map((i) =>
          i.productId === product.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                totalSpent: i.totalSpent + totalPrice,
              }
            : i
        )
      : [
          ...dealerState.storage,
          { productId: product.id, quantity, totalSpent: totalPrice },
        ];

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
      render: () =>
        themedToastBox(
          product.icon,
          `Bought ${quantity}x ${product.name}`,
          `Spent ${totalPrice} gold`,
          "red.500"
        ),
    });
  };

  const handleSellAmount = (productId: string, amount: number) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (i) => i.productId === productId
    );
    const product = getProductById(productId);
    if (!existingItem || existingItem.quantity <= 0 || !product) return;

    const sellAmount = Math.min(existingItem.quantity, amount);
    const newStorage = dealerState.storage
      .map((i) =>
        i.productId === productId
          ? { ...i, quantity: i.quantity - sellAmount }
          : i
      )
      .filter((i) => i.quantity > 0);

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
      render: () =>
        themedToastBox(
          product.icon,
          `Sold ${sellAmount}x ${product.name}`,
          `Gained ${price * sellAmount} gold`,
          "green.500"
        ),
    });
  };

  const handleSellAll = (productId: string) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (i) => i.productId === productId
    );
    const product = getProductById(productId);
    if (!existingItem || !product) return;

    const total = price * existingItem.quantity;

    const newJournal = [
      ...dealerState.journal,
      {
        date: `${monthNames[dealerState.time.month]} ${dealerState.time.year}`,
        text: `${dealerState.name} sold ALL of their ${product.name} stash for ${total} gold.`,
      },
    ];

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: dealerState.stats.gold + total,
        totalTrades: dealerState.stats.totalTrades + 1,
        totalGoldEarned: dealerState.stats.totalGoldEarned + total,
      },
      storage: dealerState.storage.filter((i) => i.productId !== productId),
      journal: newJournal,
    });

    toast({
      duration: 3000,
      isClosable: true,
      position: "top-left",
      render: () =>
        themedToastBox(
          product.icon,
          `Sold all ${product.name}`,
          `Gained ${total} gold`,
          "green.500"
        ),
    });
  };

  const totalStorageValue = dealerState.storage.reduce((sum, item) => {
    const price = marketPrices[item.productId] || 0;
    return sum + price * item.quantity;
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
