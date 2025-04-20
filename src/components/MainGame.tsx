import {
  Flex,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { products } from "@/data/products";
import {
  advanceTime,
  generateMarketPrices,
  generateMarketStock,
} from "@/utils/gameLogic";
import { useState, useEffect } from "react";

import TopBar from "@/components/TopBar";
import DealerPanel from "@/components/DealerPanel";
import MarketPanel from "@/components/MarketPanel";
import StoragePanel from "@/components/StoragePanel";

interface MainGameProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

export default function MainGame({
  dealerState,
  setDealerState,
}: MainGameProps) {
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [marketStock, setMarketStock] = useState<Record<string, number>>({});
  const [buyAmounts, setBuyAmounts] = useState<Record<string, number>>({});
  const [defaultBuyAmount, setDefaultBuyAmount] = useState<number>(1);

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

  useEffect(() => {
    const prices = generateMarketPrices(products);
    const stock = generateMarketStock(products);
    setMarketPrices(prices);
    setMarketStock(stock);
  }, []);

  useEffect(() => {
    const updated: Record<string, number> = {};
    products.forEach((product) => {
      updated[product.id] = defaultBuyAmount;
    });
    setBuyAmounts(updated);
  }, [defaultBuyAmount]);

  const handleNextTurn = () => {
    const newState = advanceTime(dealerState);
    setDealerState(newState);
    setMarketPrices(generateMarketPrices(products));
    setMarketStock(generateMarketStock(products));
  };

  const handleBuy = (productId: string) => {
    const quantity = buyAmounts[productId] || 1;
    const price = marketPrices[productId];
    const stock = marketStock[productId];

    const product = products.find((p) => p.id === productId);
    if (!product || quantity > stock) {
      alert("Not enough stock available!");
      return;
    }

    const totalPrice = price * quantity;

    if (dealerState.stats.gold < totalPrice) {
      alert("You don't have enough gold!");
      return;
    }

    const newGold = dealerState.stats.gold - totalPrice;
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
              totalSpent: item.totalSpent + totalPrice, // ✅ Increase total spent
            }
          : item
      );
    } else {
      newStorage.push({
        productId: product.id,
        quantity: quantity,
        totalSpent: totalPrice, // ✅ New items have initial total spent
      });
    }

    const newMarketStock = {
      ...marketStock,
      [productId]: stock - quantity,
    };

    setDealerState({
      ...dealerState,
      stats: { ...dealerState.stats, gold: newGold },
      storage: newStorage,
    });
    setMarketStock(newMarketStock);
  };

  const handleSellAmount = (productId: string, amount: number) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    if (!existingItem || existingItem.quantity <= 0) return;

    const sellAmount = Math.min(existingItem.quantity, amount);

    const newStorage = dealerState.storage
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - sellAmount }
          : item
      )
      .filter((item) => item.quantity > 0);

    const newGold = dealerState.stats.gold + price * sellAmount;

    setDealerState({
      ...dealerState,
      stats: { ...dealerState.stats, gold: newGold },
      storage: newStorage,
    });
  };

  const handleSellAll = (productId: string) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    if (!existingItem) return;

    const sellAmount = existingItem.quantity;

    const newStorage = dealerState.storage.filter(
      (item) => item.productId !== productId
    );

    const newGold = dealerState.stats.gold + price * sellAmount;

    setDealerState({
      ...dealerState,
      stats: { ...dealerState.stats, gold: newGold },
      storage: newStorage,
    });
  };

  const totalStorageValue = dealerState.storage.reduce((sum, item) => {
    const productPrice = marketPrices[item.productId] || 0;
    return sum + productPrice * item.quantity;
  }, 0);

  return (
    <Flex
      direction="column"
      height="100dvh"
      w="100%"
      maxW="95vw"
      minW="1200px"
      mx="auto"
      p={2}
      bg="brand.background"
      overflow="hidden"
    >
      {/* Top Bar */}
      <TopBar
        onNextTurn={handleNextTurn}
        month={monthNames[dealerState.time.month]}
        year={dealerState.time.year}
      />

      <Flex
        flex="1"
        direction={{ base: "column", md: "row" }}
        overflow="hidden"
        gap={4}
      >
        {/* Dealer Profile Left */}
        <DealerPanel dealerState={dealerState} />

        {/* Tabs for Market + Storage */}
        <Flex flex="1" direction="column" overflow="hidden">
          <Tabs
            variant="enclosed"
            colorScheme="teal"
            isFitted
            size="lg"
            bg="gray.800"
            p={2}
            borderRadius="lg"
          >
            <TabList>
              <Tab>🛒 Marketplace</Tab>
              <Tab>📦 Storage</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} overflowY="auto" maxH="calc(100dvh - 200px)">
                <MarketPanel
                  dealerState={dealerState}
                  products={products}
                  marketPrices={marketPrices}
                  marketStock={marketStock}
                  buyAmounts={buyAmounts}
                  setBuyAmounts={setBuyAmounts}
                  handleBuy={handleBuy}
                  defaultBuyAmount={defaultBuyAmount}
                  setDefaultBuyAmount={setDefaultBuyAmount}
                />
              </TabPanel>

              <TabPanel p={0} overflowY="auto" maxH="calc(100dvh - 200px)">
                <StoragePanel
                  dealerState={dealerState}
                  marketPrices={marketPrices}
                  handleSellAmount={handleSellAmount}
                  handleSellAll={handleSellAll}
                  totalStorageValue={totalStorageValue}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </Flex>
  );
}
