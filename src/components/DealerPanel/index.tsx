import { Box, Flex, HStack } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { raceImages } from "@/data/raceImages"; // <<- Now import the pixel images

import DealerInfo from "./DealerInfo";
import SettingsMenu from "./SettingsMenu";
import StatBars from "./StatBars";

interface DealerPanelProps {
  dealerState: DealerState;
}

export default function DealerPanel({ dealerState }: DealerPanelProps) {
  return (
    <Flex
      direction="column"
      bg="brand.surface"
      p={4}
      borderRadius="md"
      w="full"
      maxW={{ base: "100%", md: "300px" }}
      align="center"
      overflow="hidden"
      flexShrink={0}
      gap={3}
    >
      {/* Top Row */}
      <Flex
        w="100%"
        direction="row"
        align="center"
        justify="space-between"
        gap={3}
      >
        <Box
          boxSize="80px"
          borderRadius="full"
          bg="gray.600"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Race Image */}
          {dealerState.race && (
            <img
              src={raceImages[dealerState.race] || "/assets/races/default.png"}
              alt={dealerState.race}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                imageRendering: "pixelated", // important for pixel art
              }}
            />
          )}
        </Box>

        {/* Gold + Settings */}
        <SettingsMenu dealerState={dealerState} />
      </Flex>

      {/* Dealer Name + Info */}
      <DealerInfo dealerState={dealerState} />

      {/* Stat Bars */}
      <StatBars dealerState={dealerState} />

      {/* Strength and Speed */}
      <HStack spacing={4} mt={4} flexWrap="wrap" justify="center">
        <HStack spacing={1}>
          <span role="img" aria-label="strength">
            💪
          </span>
          <Box color="brand.text">{dealerState.stats.strength}</Box>
        </HStack>

        <HStack spacing={1}>
          <span role="img" aria-label="speed">
            🏃
          </span>
          <Box color="brand.text">{dealerState.stats.speed}</Box>
        </HStack>
      </HStack>
    </Flex>
  );
}
