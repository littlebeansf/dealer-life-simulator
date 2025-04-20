import { Flex, Heading, IconButton, Text, Tooltip } from "@chakra-ui/react";

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
      width="100%"
      direction="column"
    >
      <Heading size="lg" color="white">
        Dealer Life Simulator
      </Heading>

      <Flex mt={4} align="center" gap={4}>
        <Tooltip label="Next Month" hasArrow>
          <IconButton
            aria-label="Next Month"
            icon={<span style={{ fontSize: "36px" }}>📅</span>}
            size="xl"
            isRound
            variant="solid"
            colorScheme="gray"
            onClick={onNextTurn}
          />
        </Tooltip>
        <Text fontSize="xl" fontWeight="bold" color="white">
          {month} {year}
        </Text>
      </Flex>
    </Flex>
  );
}
