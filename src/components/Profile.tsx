import { Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { raceIcons } from "@/utils/raceIcons";

interface ProfileProps {
  dealerState: DealerState;
}

export default function Profile({ dealerState }: ProfileProps) {
  const bg = useColorModeValue("lightbrand.surface", "brand.surface");
  const heading = useColorModeValue("lightbrand.heading", "brand.heading");
  const subtext = useColorModeValue("lightbrand.muted", "brand.muted");

  return (
    <Box bg={bg} p={4} borderRadius="md" shadow="md" w="full">
      <VStack spacing={3} align="center">
        <Text fontSize="5xl">{raceIcons[dealerState.race]}</Text>
        <Text fontSize="2xl" fontWeight="bold" color={heading}>
          {dealerState.name}
        </Text>
        <Text fontSize="md" color={subtext}>
          {dealerState.race} · {dealerState.gender}
        </Text>
        <Text fontSize="lg" mt={2} color={heading}>
          💰 {dealerState.stats.gold}g
        </Text>
      </VStack>
    </Box>
  );
}
