import { Box, Flex, HStack, useColorModeValue } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { raceImages } from "@/data/raceImages";

import DealerInfo from "./DealerInfo";
import SettingsMenu from "./SettingsMenu";
import StatBars from "./StatBars";

interface DealerPanelProps {
  dealerState: DealerState;
}

export default function DealerPanel({ dealerState }: DealerPanelProps) {
  const panelBg = useColorModeValue("lightbrand.surface", "brand.surface");
  const textColor = useColorModeValue("lightbrand.text", "brand.text");
  const avatarBg = useColorModeValue("gray.300", "gray.600");

  return (
    <Flex
      direction="column"
      bg={panelBg}
      p={4}
      borderRadius="md"
      w="full"
      maxW={{ base: "100%", md: "300px" }}
      align="center"
      overflow="hidden"
      flexShrink={0}
      gap={3}
    >
      <Flex w="100%" align="center" justify="space-between" gap={3}>
        <Box
          boxSize="80px"
          borderRadius="full"
          bg={avatarBg}
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {dealerState.race && (
            <img
              src={raceImages[dealerState.race] || "/assets/races/default.png"}
              alt={dealerState.race}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                imageRendering: "pixelated",
              }}
            />
          )}
        </Box>

        <SettingsMenu dealerState={dealerState} />
      </Flex>

      <DealerInfo dealerState={dealerState} />
      <StatBars dealerState={dealerState} />

      <HStack spacing={4} mt={4} flexWrap="wrap" justify="center">
        <HStack spacing={1}>
          <span role="img" aria-label="strength">
            💪
          </span>
          <Box color={textColor}>{dealerState.stats.strength}</Box>
        </HStack>
        <HStack spacing={1}>
          <span role="img" aria-label="speed">
            🏃
          </span>
          <Box color={textColor}>{dealerState.stats.speed}</Box>
        </HStack>
      </HStack>
    </Flex>
  );
}
