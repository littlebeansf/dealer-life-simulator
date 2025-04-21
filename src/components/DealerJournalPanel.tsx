// src/components/DealerJournalPanel.tsx

import { Box, VStack, Heading } from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import DealerEntryPanel from "./DealerEntryPanel"; // << ✅ Import it!

interface DealerJournalPanelProps {
  dealerState: DealerState;
}

export default function DealerJournalPanel({
  dealerState,
}: DealerJournalPanelProps) {
  return (
    <Box p={2}>
      <Heading size="md" mb={4} color="gray.300" textAlign="center">
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
