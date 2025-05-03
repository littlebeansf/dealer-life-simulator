// src/components/DealerEntryPanel.tsx

import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { JournalEntry } from "@/types/game";

interface DealerEntryPanelProps {
  entry: JournalEntry;
}

export default function DealerEntryPanel({ entry }: DealerEntryPanelProps) {
  const bg = useColorModeValue("lightbrand.surface", "whiteAlpha.100");
  const text = useColorModeValue("lightbrand.muted", "gray.400");

  return (
    <Box p={3} bg={bg} borderRadius="md" w="full">
      <Text fontSize="sm" color={text}>
        {entry.date} - {entry.text}
      </Text>
    </Box>
  );
}
