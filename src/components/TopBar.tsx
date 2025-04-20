import { Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";

interface TopBarProps {
  onNextTurn: () => void;
  month: string;
  year: number;
}

export default function TopBar({ onNextTurn, month, year }: TopBarProps) {
  return (
    <Flex
      bg="#2A2A2A"
      p={4}
      align="center"
      justify="center"
      direction="column"
      width="100%"
      borderRadius="md"
    >
      {/* Top: Game Title */}
      <Text fontSize="2xl" fontWeight="bold" color="white" mb={2}>
        Dealer Life Simulator
      </Text>

      {/* Bottom: Next Month button + Month Display */}
      <Flex align="center" gap={4}>
        <Tooltip label="Next Month" hasArrow placement="top" bg="gray.600">
          <IconButton
            aria-label="Next Month"
            icon={<span style={{ fontSize: "24px" }}>📅</span>}
            size="lg"
            variant="solid"
            colorScheme="gray"
            p={6}
            onClick={onNextTurn}
          />
        </Tooltip>

        <Text
          fontSize="xl"
          fontWeight="bold"
          color="white"
          minW="150px"
          textAlign="center"
        >
          {month} {year}
        </Text>
      </Flex>
    </Flex>
  );
}
