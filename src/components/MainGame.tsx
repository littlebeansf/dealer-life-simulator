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
    setMarketPrices(generateMarketPrices(products));
    setMarketStock(generateMarketStock(products));
  }, []);

  useEffect(() => {
    const updated: Record<string, number> = {};
    products.forEach((product) => {
      updated[product.id] = defaultBuyAmount;
    });
    setBuyAmounts(updated);
  }, [defaultBuyAmount]);

  const handleNextTurn = () => {
    setDealerState(advanceTime(dealerState));
    setMarketPrices(generateMarketPrices(products));
    setMarketStock(generateMarketStock(products));
  };

  const handleBuy = (productId: string) => {
    const quantity = buyAmounts[productId] || 1;
    const price = marketPrices[productId];
    const stock = marketStock[productId];
    const product = products.find((p) => p.id === productId);
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

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: dealerState.stats.gold - totalPrice,
      },
      storage: newStorage,
    });

    setMarketStock((prev) => ({ ...prev, [productId]: stock - quantity }));
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

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: dealerState.stats.gold + price * sellAmount,
      },
      storage: newStorage,
    });
  };

  const handleSellAll = (productId: string) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    if (!existingItem) return;

    const newStorage = dealerState.storage.filter(
      (item) => item.productId !== productId
    );

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: dealerState.stats.gold + price * existingItem.quantity,
      },
      storage: newStorage,
    });
  };

  const totalStorageValue = dealerState.storage.reduce((sum, item) => {
    const productPrice = marketPrices[item.productId] || 0;
    return sum + productPrice * item.quantity;
  }, 0);

  return (
    <Flex direction="column" minH="100dvh" bg="brand.background">
      <TopBar
        onNextTurn={handleNextTurn}
        month={monthNames[dealerState.time.month]}
        year={dealerState.time.year}
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        w="full"
        maxW="1200px"
        mx="auto"
        flex="1"
        minH={{ base: "calc(100dvh - 64px)", md: "auto" }}
        overflow="hidden"
      >
        <Box flexShrink={0}>
          <DealerPanel dealerState={dealerState} />
        </Box>

        <Tabs
          flex="1"
          w="full"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          bg="gray.800"
          borderRadius="lg"
          p={2}
        >
          <TabList>
            <Tab>🛒 Marketplace</Tab>
            <Tab>📦 Storage</Tab>
          </TabList>

          <TabPanels flex="1" overflow="hidden">
            <TabPanel p={0} h="100%" overflowY="auto">
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

            <TabPanel p={0} h="100%" overflowY="auto">
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
  );
}
