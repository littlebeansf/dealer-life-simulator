// src/components/DealerStatsPanel/index.tsx

import { Box, Flex, Heading, Text, SimpleGrid, Badge } from "@chakra-ui/react";
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
  const totalTrades = dealerState.stats.totalTrades || 0; // Assuming you track it; else fake it for now
  const reputation =
    dealerState.stats.reputation || Math.floor(Math.random() * 100);

  const monthsSurvived = dealerState.time.year * 12 + dealerState.time.month;

  const favoriteProductId =
    dealerState.storage.sort((a, b) => b.quantity - a.quantity)[0]?.productId ||
    "None";

  // Temporary titles by gold
  const getRank = (gold: number) => {
    if (gold > 100000) return "Legendary Merchant";
    if (gold > 50000) return "Elite Merchant";
    if (gold > 10000) return "Master Trader";
    if (gold > 1000) return "Apprentice Dealer";
    return "Novice Wanderer";
  };

  const dealerTitle = getRank(gold);

  return (
    <Box p={4} bg="brand.surface" borderRadius="md" minH="full">
      <Flex direction="column" align="center" mb={6}>
        <Heading size="lg" color="brand.text">
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
        <Text fontSize="lg" color="gray.300" fontStyle="italic">
          "A rising star among the underground magic dealers."
        </Text>
      </Box>
    </Box>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <Box
      p={4}
      bg="gray.700"
      borderRadius="md"
      textAlign="center"
      boxShadow="md"
    >
      <Text fontSize="sm" color="gray.400">
        {label}
      </Text>
      <Text fontSize="xl" fontWeight="bold" color="white" mt={1}>
        {value}
      </Text>
    </Box>
  );
}
