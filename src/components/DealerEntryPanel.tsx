// src/components/DealerEntryPanel.tsx

import { Box, Text } from "@chakra-ui/react";
import { JournalEntry } from "@/types/game";

interface DealerEntryPanelProps {
  entry: JournalEntry;
}

export default function DealerEntryPanel({ entry }: DealerEntryPanelProps) {
  return (
    <Box p={3} bg="whiteAlpha.100" borderRadius="md" w="full">
      <Text fontSize="sm" color="gray.400">
        {entry.date} - {entry.text}
      </Text>
    </Box>
  );
}
