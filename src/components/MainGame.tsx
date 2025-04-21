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
      {/* 🔥 Add PortalRevealOverlay at the top */}
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
        minW={{ base: "100vw", md: "80vw" }}
        mx="auto"
        flex="1"
        w="full"
        minH={{ base: "calc(100dvh - 64px)", md: "auto" }}
        overflow="hidden"
      >
        {/* Left: Dealer Info */}
        <Box flexShrink={0}>
          <DealerPanel dealerState={dealerState} />
        </Box>

        {/* Right: Dealer Phone */}
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          bg="gray.800"
          borderRadius="lg"
          p={4}
          overflow="hidden"
          minH="full"
        >
          {/* Phone Header */}
          <Heading
            size="md"
            textAlign="center"
            mb={4}
            color="gray.300"
            fontFamily="heading"
          >
            Dealer Phone
          </Heading>

          {/* Dealer Phone Content */}
          <Box flex="1" position="relative" overflow="hidden">
            {!activeApp && (
              <SimpleGrid columns={3} spacing={6} flex="1">
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
              <Flex direction="column" h="full" position="relative" flex="1">
                <IconButton
                  aria-label="Close App"
                  icon={<CloseIcon />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  onClick={() => setActiveApp(null)}
                  zIndex={10}
                  colorScheme="gray"
                />

                <Box mt={8} overflowY="auto" flex="1" px={2}>
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
      bg="gray.700"
      borderRadius="xl"
      p={4}
      cursor="pointer"
      _hover={{ bg: "gray.600" }}
      onClick={onClick}
      transition="0.2s"
    >
      <Text fontSize="2xl">{emoji}</Text>
      <Text mt={2} fontSize="sm" color="gray.200">
        {label}
      </Text>
    </Flex>
  );
}
