import { Box, Progress, Text, Flex } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { icons } from "@/data/icons";

interface StatBarsProps {
  dealerState: DealerState;
}

export default function StatBars({ dealerState }: StatBarsProps) {
  return (
    <Box mt={2} w="100%">
      {/* Life */}
      <Flex align="center" gap={2} mb={1}>
        <Box w="20px" h="20px">
          <img
            src={icons.status.Heart}
            alt="Life"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
            }}
          />
        </Box>
        <Text fontSize="sm" color="brand.text">
          Life
        </Text>
      </Flex>
      <Progress
        value={dealerState.stats.life}
        colorScheme="red"
        size="sm"
        borderRadius="md"
      />

      {/* Sanity */}
      <Flex align="center" gap={2} mt={3} mb={1}>
        <Box w="20px" h="20px">
          <img
            src={icons.status.Sanity}
            alt="Sanity"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              imageRendering: "pixelated",
            }}
          />
        </Box>
        <Text fontSize="sm" color="brand.text">
          Sanity
        </Text>
      </Flex>
      <Progress
        value={dealerState.stats.sanity}
        colorScheme="blue"
        size="sm"
        borderRadius="md"
      />
    </Box>
  );
}
