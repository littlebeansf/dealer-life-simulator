import { Flex } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { products } from "@/data/products";
import { advanceTime, generateMarketPrices } from "@/utils/gameLogic";
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
    setMarketPrices(prices);
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
    const newPrices = generateMarketPrices(products);
    setMarketPrices(newPrices);
  };

  const handleBuy = (productId: string) => {
    const quantity = buyAmounts[productId] || 1;
    const price = marketPrices[productId];
    const product = products.find((p) => p.id === productId);
    if (!product) return;

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
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newStorage.push({ productId: product.id, quantity: quantity });
    }

    setDealerState({
      ...dealerState,
      stats: { ...dealerState.stats, gold: newGold },
      storage: newStorage,
    });
  };

  const handleSellAmount = (productId: string, amount: number) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    const product = products.find((p) => p.id === productId);

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
    const product = products.find((p) => p.id === productId);

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
      bg="brand.background"
      overflow="hidden"
    >
      {/* Top Bar */}
      <TopBar
        onNextTurn={handleNextTurn}
        month={monthNames[dealerState.time.month]}
        year={dealerState.time.year}
      />

      {/* Main Content */}
      <Flex
        flex="1"
        direction={{ base: "column", md: "row" }}
        overflow="hidden"
      >
        {/* Left Panel: Dealer Stats */}
        <DealerPanel dealerState={dealerState} />

        {/* Right Panel: Market + Storage */}
        <Flex
          direction={{ base: "column", md: "row" }}
          flex="1"
          overflow="hidden"
          gap={6}
          p={6}
        >
          <MarketPanel
            dealerState={dealerState}
            products={products}
            marketPrices={marketPrices}
            buyAmounts={buyAmounts}
            setBuyAmounts={setBuyAmounts}
            handleBuy={handleBuy}
            defaultBuyAmount={defaultBuyAmount}
            setDefaultBuyAmount={setDefaultBuyAmount}
          />

          <StoragePanel
            dealerState={dealerState}
            marketPrices={marketPrices}
            handleSellAmount={handleSellAmount}
            handleSellAll={handleSellAll}
            totalStorageValue={totalStorageValue}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
