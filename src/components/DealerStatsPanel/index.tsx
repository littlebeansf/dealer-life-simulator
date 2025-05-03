// src/components/DealerStatsPanel/index.tsx

import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { DealerState } from "@/types/game";

interface DealerStatsPanelProps {
  dealerState: DealerState;
  totalStorageValue: number;
}

export default function DealerStatsPanel({
  dealerState,
  totalStorageValue,
}: DealerStatsPanelProps) {
  const gold = dealerState.stats.gold;
  const totalTrades = dealerState.stats.totalTrades || 0;
  const reputation = dealerState.stats.reputation ?? 0;

  const startYear = 2025;
  const startMonth = 3;
  const monthsSurvived =
    (dealerState.time.year - startYear) * 12 +
    (dealerState.time.month - startMonth) +
    1;

  const favoriteProductId =
    dealerState.storage.sort((a, b) => b.quantity - a.quantity)[0]?.productId ||
    "None";

  const getRank = (gold: number) => {
    if (gold > 100000) return "Legendary Merchant";
    if (gold > 50000) return "Elite Merchant";
    if (gold > 10000) return "Master Trader";
    if (gold > 1000) return "Apprentice Dealer";
    return "Novice Wanderer";
  };

  const dealerTitle = getRank(gold);

  const panelBg = useColorModeValue("lightbrand.surface", "brand.surface");
  const textColor = useColorModeValue("lightbrand.heading", "brand.text");
  const quoteColor = useColorModeValue("lightbrand.muted", "gray.300");

  return (
    <Box p={4} bg={panelBg} borderRadius="md" minH="full">
      <Flex direction="column" align="center" mb={6}>
        <Heading size="lg" color={textColor}>
          🧙 {dealerState.name || "Unknown Dealer"}
        </Heading>
        <Badge colorScheme="purple" fontSize="md" mt={2}>
          {dealerTitle}
        </Badge>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <StatItem label="💰 Gold" value={`$${gold}`} />
        <StatItem label="🏦 Storage Value" value={`$${totalStorageValue}`} />
        <StatItem label="🔄 Total Trades" value={totalTrades} />
        <StatItem label="🌟 Reputation" value={reputation} />
        <StatItem label="📅 Months Survived" value={monthsSurvived} />
        <StatItem label="📦 Favorite Product" value={favoriteProductId} />
      </SimpleGrid>

      <Box mt={8} textAlign="center">
        <Text fontSize="lg" color={quoteColor} fontStyle="italic">
          "A rising star among the underground magic dealers."
        </Text>
      </Box>
    </Box>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  const bg = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("lightbrand.text", "white");

  return (
    <Box p={4} bg={bg} borderRadius="md" textAlign="center" boxShadow="md">
      <Text fontSize="sm" color={labelColor}>
        {label}
      </Text>
      <Text fontSize="xl" fontWeight="bold" color={valueColor} mt={1}>
        {value}
      </Text>
    </Box>
  );
}
