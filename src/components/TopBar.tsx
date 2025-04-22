import {
  Flex,
  IconButton,
  Text,
  Tooltip,
  Box,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { icons } from "@/data/icons";

interface TopBarProps {
  onNextTurn: () => void;
  month: string;
  year: number;
}

export default function TopBar({ onNextTurn, month, year }: TopBarProps) {
  const { colorMode, toggleColorMode } = useColorMode();

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

      {/* Bottom: Next Month button + Month/Year Display */}
      <Flex align="center" gap={4}>
        <Tooltip label="Next Month" hasArrow placement="top" bg="gray.600">
          <IconButton
            aria-label="Next Month"
            icon={
              <Box w="32px" h="32px">
                <img
                  src={icons.navigation.Next}
                  alt="Next Month"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    imageRendering: "pixelated",
                  }}
                />
              </Box>
            }
            size="lg"
            variant="solid"
            colorScheme="gray"
            p={6}
            onClick={onNextTurn}
          />
        </Tooltip>

        <Flex
          direction="column"
          align="center"
          justify="center"
          minW="150px"
          px={2}
        >
          <Text fontSize="lg" fontWeight="bold" color="white" noOfLines={1}>
            {month}
          </Text>
          <Text fontSize="sm" color="gray.300">
            {year}
          </Text>
        </Flex>
      </Flex>
      <Flex align="right">
        <Button onClick={toggleColorMode} size="sm" ml={4}>
          {colorMode === "light" ? "🌙" : "🌞"}
        </Button>
      </Flex>
    </Flex>
  );
}
