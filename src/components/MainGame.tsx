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
import DealerJournalPanel from "@/components/DealerJournalPanel";
import MapPanel from "@/components/MapPanel"; // ✅ NEW MAPPANEL IMPORT

import { useGameActions } from "@/hooks/useGameActions";
import { CloseIcon } from "@chakra-ui/icons";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

import { icons } from "@/data/icons";

interface MainGameProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

type AppScreen =
  | "dealer"
  | "marketplace"
  | "storage"
  | "dealerScrolls"
  | "map"
  | null;

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

  const animatedGold = useAnimatedNumber(dealerState.stats.gold);

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
          bg="gray.800"
          borderRadius="2xl"
          border="6px solid black"
          p={2}
          overflow="hidden"
          minH="600px"
          maxH="680px"
          flex="1"
          flexShrink={0}
        >
          {/* Phone Screen */}
          <Flex
            direction="column"
            bg="black"
            borderRadius="lg"
            flex="1"
            overflow="hidden"
          >
            {/* Phone Header */}
            <Flex
              bg="brand.surface"
              borderTopRadius="lg"
              p={4}
              borderBottom="1px solid #333"
              align="center"
              justify="space-between"
            >
              <Flex align="center" gap={2}>
                <Box w="28px" h="28px">
                  <img
                    src={icons.device.Phone}
                    alt="Phone"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      imageRendering: "pixelated",
                    }}
                  />
                </Box>
                <Heading size="md" color="gray.300">
                  Dealer Phone
                </Heading>
              </Flex>

              <Flex align="center" gap={2}>
                <Box w="28px" h="28px">
                  <img
                    src={icons.status.Gold}
                    alt="Gold"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      imageRendering: "pixelated",
                    }}
                  />
                </Box>
                <Text fontSize="x-large" color="yellow.300" fontWeight="bold">
                  {animatedGold}$
                </Text>
              </Flex>
            </Flex>

            {/* Content Area */}
            <Box flex="1" overflowY="auto" p={4}>
              {!activeApp ? (
                <SimpleGrid columns={3} spacing={6}>
                  <AppIcon
                    label="Dealer"
                    icon={icons.app.Dealer}
                    onClick={() => setActiveApp("dealer")}
                  />
                  <AppIcon
                    label="Market"
                    icon={icons.app.Market}
                    onClick={() => setActiveApp("marketplace")}
                  />
                  <AppIcon
                    label="Storage"
                    icon={icons.app.Storage}
                    onClick={() => setActiveApp("storage")}
                  />
                  <AppIcon
                    label="Scrolls"
                    icon={icons.app.Scroll}
                    onClick={() => setActiveApp("dealerScrolls")}
                  />
                  <AppIcon
                    label="World Map"
                    icon={icons.app.Map}
                    onClick={() => setActiveApp("map")}
                  />
                </SimpleGrid>
              ) : (
                <Box position="relative">
                  <IconButton
                    aria-label="Close App"
                    icon={<CloseIcon />}
                    position="absolute"
                    top={3}
                    right={3}
                    size="sm"
                    onClick={() => setActiveApp(null)}
                    zIndex={10}
                    colorScheme="gray"
                  />
                  <Box mt={10}>
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
                    {activeApp === "dealerScrolls" && (
                      <DealerJournalPanel dealerState={dealerState} />
                    )}
                    {activeApp === "map" && (
                      <MapPanel
                        dealerState={dealerState}
                        setDealerState={setDealerState}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

// App Icon Component
function AppIcon({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <Flex direction="column" align="center" justify="center" transition="0.2s">
      <Box
        as="button"
        onClick={onClick}
        w="80px"
        h="80px"
        bg="whiteAlpha.300"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        _hover={{ bg: "gray.600", transform: "scale(1.05)" }}
        transition="all 0.2s"
      >
        <Box w="48px" h="48px">
          <img
            src={icon}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
            }}
          />
        </Box>
      </Box>
      <Text
        mt={2}
        fontSize="md"
        color="gray.300"
        textAlign="center"
        fontWeight="bold"
      >
        {label}
      </Text>
    </Flex>
  );
}
