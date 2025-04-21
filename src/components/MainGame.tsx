import {
  Flex,
  Box,
  IconButton,
  SimpleGrid,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { DealerState } from "@/types/game";
import { products } from "@/data/products";

import TopBar from "@/components/TopBar";
import DealerPanel from "@/components/DealerPanel";
import DealerStatsPanel from "@/components/DealerStatsPanel";
import MarketPanel from "@/components/MarketPanel";
import StoragePanel from "@/components/StoragePanel";
import PortalRevealOverlay from "@/components/PortalRevealOverlay";

import { useGameActions } from "@/hooks/useGameActions";
import { CloseIcon } from "@chakra-ui/icons";

interface MainGameProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

type AppScreen = "dealer" | "marketplace" | "storage" | null;

export default function MainGame({
  dealerState,
  setDealerState,
}: MainGameProps) {
  const [activeApp, setActiveApp] = useState<AppScreen>(null);

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
    <Flex
      direction="column"
      minH="100dvh"
      bg="brand.background"
      position="relative"
    >
      {/* Portal Reveal Animation */}
      <PortalRevealOverlay />

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

      {/* Main Content */}
      <Flex
        direction={{ base: "column", md: "row" }}
        minW="100vw"
        mx="auto"
        flex="1"
        w="full"
        overflow="hidden"
        align="flex-start"
        gap={6}
        p={4}
      >
        {/* Left: Dealer Info */}
        <Box flexShrink={0}>
          <DealerPanel dealerState={dealerState} />
        </Box>

        {/* Right: Dealer Phone */}
        <Flex
          direction="column"
          flexGrow={1}
          bg="gray.800" // Outer frame
          borderRadius="2xl"
          border="6px solid black"
          p={2} // << tighter outer padding
          boxShadow="0 0 20px rgba(0, 0, 0, 0.7)"
          overflow="hidden"
          minH="600px"
          maxH="calc(100dvh - 100px)"
          justify="flex-start"
        >
          {/* Phone "Screen" */}
          <Box
            bg="black" // Full screen background
            borderRadius="lg"
            flex="1"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            {/* Phone Header */}
            <Heading
              size="md"
              textAlign="center"
              p={4}
              color="gray.300"
              fontFamily="heading"
              bg="brand.surface"
            >
              📱 Dealer Phone
            </Heading>

            {/* Content Area */}
            <Box flex="1" w="full" position="relative" overflow="hidden" mt={4}>
              {!activeApp && (
                <SimpleGrid
                  columns={3}
                  spacing={6}
                  flex="1"
                  alignItems="center"
                >
                  <AppIcon
                    label="Dealer"
                    emoji="🧙"
                    onClick={() => setActiveApp("dealer")}
                  />
                  <AppIcon
                    label="Market"
                    emoji="🛒"
                    onClick={() => setActiveApp("marketplace")}
                  />
                  <AppIcon
                    label="Storage"
                    emoji="📦"
                    onClick={() => setActiveApp("storage")}
                  />
                </SimpleGrid>
              )}

              {activeApp && (
                <Flex
                  direction="column"
                  h="full"
                  position="relative"
                  flex="1"
                  overflow="hidden"
                >
                  <IconButton
                    aria-label="Close App"
                    icon={<CloseIcon />}
                    position="absolute"
                    top={3} // << inset properly
                    right={3}
                    size="sm"
                    onClick={() => setActiveApp(null)}
                    zIndex={10}
                    colorScheme="gray"
                  />

                  {/* Scrollable App Content */}
                  <Box overflowY="auto" flex="1" px={2}>
                    {activeApp === "dealer" && (
                      <DealerStatsPanel
                        dealerState={dealerState}
                        totalStorageValue={totalStorageValue}
                      />
                    )}

                    {activeApp === "marketplace" && (
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
                    )}

                    {activeApp === "storage" && (
                      <StoragePanel
                        dealerState={dealerState}
                        marketPrices={marketPrices}
                        handleSellAmount={handleSellAmount}
                        handleSellAll={handleSellAll}
                        totalStorageValue={totalStorageValue}
                      />
                    )}
                  </Box>
                </Flex>
              )}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

// App Icon Component
function AppIcon({
  label,
  emoji,
  onClick,
}: {
  label: string;
  emoji: string;
  onClick: () => void;
}) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      onClick={onClick}
      cursor="pointer"
      transition="0.2s"
    >
      <Flex
        w="80px"
        h="80px"
        bg="whiteAlpha.300"
        borderRadius="xl"
        align="center"
        justify="center"
        _hover={{ bg: "gray.500" }}
      >
        <Text fontSize="3xl">{emoji}</Text>
      </Flex>
      <Text
        mt={2}
        fontSize="sm"
        color="gray.300"
        textAlign="center"
        fontWeight="bold"
      >
        {label}
      </Text>
    </Flex>
  );
}
