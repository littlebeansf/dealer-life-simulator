import { Box, Progress, Text } from "@chakra-ui/react";
import { DealerState } from "@/types/game";

interface StatBarsProps {
  dealerState: DealerState;
}

export default function StatBars({ dealerState }: StatBarsProps) {
  return (
    <Box mt={2} w="100%">
      <Text fontSize="sm" color="brand.text">
        ❤️ Life
      </Text>
      <Progress
        value={dealerState.stats.life}
        colorScheme="red"
        size="sm"
        borderRadius="md"
      />
      <Text fontSize="sm" color="brand.text" mt={1}>
        🧠 Sanity
      </Text>
      <Progress
        value={dealerState.stats.sanity}
        colorScheme="blue"
        size="sm"
        borderRadius="md"
      />
    </Box>
  );
}
