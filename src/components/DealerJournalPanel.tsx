// src/components/DealerJournalPanel.tsx

import { Box, VStack, Heading, useColorModeValue } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import DealerEntryPanel from "./DealerEntryPanel";

interface DealerJournalPanelProps {
  dealerState: DealerState;
}

export default function DealerJournalPanel({
  dealerState,
}: DealerJournalPanelProps) {
  const headingColor = useColorModeValue("lightbrand.heading", "brand.heading");
  const bg = useColorModeValue("lightbrand.surface", "brand.surface");

  return (
    <Box p={2} bg={bg} borderRadius="md">
      <Heading size="md" mb={4} color={headingColor} textAlign="center">
        📓 Dealer Scrolls
      </Heading>
      <VStack align="start" spacing={3} overflowY="auto" maxH="500px">
        {dealerState.journal.map((entry, index) => (
          <DealerEntryPanel key={index} entry={entry} />
        ))}
      </VStack>
    </Box>
  );
}
