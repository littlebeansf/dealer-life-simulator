// src/components/DealerPanel/DealerInfo.tsx

import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { DealerState } from "@/types/game";

interface DealerInfoProps {
  dealerState: DealerState;
}

export default function DealerInfo({ dealerState }: DealerInfoProps) {
  const startingAge = 18;
  const startYear = 2025;
  const startMonth = 3;

  const monthsPassed =
    (dealerState.time.year - startYear) * 12 +
    (dealerState.time.month - startMonth);

  const currentAge = startingAge + Math.floor(monthsPassed / 12);
  const monthOfYear = (monthsPassed % 12) + 1;

  const nameColor = useColorModeValue("lightbrand.heading", "brand.text");
  const infoColor = useColorModeValue("lightbrand.muted", "gray.400");

  return (
    <VStack spacing={1} align="center" mt={2}>
      <Text fontSize="lg" fontWeight="bold" color={nameColor} noOfLines={1}>
        {dealerState.name}
      </Text>

      <Text fontSize="sm" color={infoColor} noOfLines={1}>
        {dealerState.race} / {dealerState.gender}
      </Text>

      <Text fontSize="sm" color={infoColor} noOfLines={1}>
        Age {currentAge} ({monthOfYear})
      </Text>

      <Text fontSize="sm" color={infoColor} noOfLines={1}>
        {dealerState.location}
      </Text>
    </VStack>
  );
}
