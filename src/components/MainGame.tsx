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

import TopBar from "@/components/TopBar";
import DealerPanel from "@/components/DealerPanel";
import MarketPanel from "@/components/MarketPanel";
import StoragePanel from "@/components/StoragePanel";

import { useGameActions } from "@/hooks/useGameActions";

interface MainGameProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

export default function MainGame({
  dealerState,
  setDealerState,
}: MainGameProps) {
  const {
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
  } = useGameActions(dealerState, setDealerState);

  return (
    <Flex direction="column" minH="100dvh" bg="brand.background">
      <TopBar
        onNextTurn={handleNextTurn}
        month={
          [
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
          ][dealerState.time.month]
        }
        year={dealerState.time.year}
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        minW={{ base: "100vw", md: "80vw" }}
        mx="auto"
        flex="1"
        w="full"
        minH={{ base: "calc(100dvh - 64px)", md: "auto" }}
        overflow="hidden"
      >
        <Box flexShrink={0}>
          <DealerPanel dealerState={dealerState} />
        </Box>

        <Tabs
          flex="1"
          isFitted
          variant="enclosed"
          colorScheme="teal"
          size="lg"
          display="flex"
          flexDirection="column"
          w="full"
          bg="gray.800"
          borderRadius="lg"
          p={2}
          overflow="hidden"
        >
          <TabList>
            <Tab>🛒 Marketplace</Tab>
            <Tab>📦 Storage</Tab>
          </TabList>

          <TabPanels flex="1" overflow="hidden">
            <TabPanel p={0} h="full" overflowY="auto">
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

            <TabPanel p={0} h="full" overflowY="auto">
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
