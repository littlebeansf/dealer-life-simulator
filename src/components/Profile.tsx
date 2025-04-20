import { Box, VStack, Text } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { raceIcons } from "@/utils/raceIcons";

interface ProfileProps {
  dealerState: DealerState;
}

export default function Profile({ dealerState }: ProfileProps) {
  return (
    <Box bg="brand.surface" p={4} borderRadius="md" shadow="md" w="full">
      <VStack spacing={3} align="center">
        <Text fontSize="5xl">{raceIcons[dealerState.race]}</Text>
        <Text fontSize="2xl" fontWeight="bold">
          {dealerState.name}
        </Text>
        <Text fontSize="md" color="gray.400">
          {dealerState.race} · {dealerState.gender}
        </Text>
        <Text fontSize="lg" mt={2}>
          💰 {dealerState.stats.gold}g
        </Text>
      </VStack>
    </Box>
  );
}
