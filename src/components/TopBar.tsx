import {
  Flex,
  IconButton,
  Text,
  Tooltip,
  Box,
  useColorMode,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { icons } from "@/data/icons";

interface TopBarProps {
  onNextTurn: () => void;
  month: string;
  year: number;
}

export default function TopBar({ onNextTurn, month, year }: TopBarProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("lightbrand.surface", "brand.surface");
  const textColor = useColorModeValue("lightbrand.heading", "brand.heading");
  const subText = useColorModeValue("lightbrand.muted", "brand.muted");

  return (
    <Flex
      bg={bg}
      p={4}
      align="center"
      justify="center"
      direction="column"
      width="100%"
      borderRadius="md"
    >
      {/* Top: Game Title */}
      <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
        Dealer Life Simulator
      </Text>

      {/* Bottom: Next Month button + Month/Year Display */}
      <Flex align="center" gap={4}>
        <Tooltip
          label="Next Month"
          hasArrow
          placement="top"
          bg={useColorModeValue("gray.300", "gray.600")}
          color={useColorModeValue("black", "white")}
        >
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
            bg={useColorModeValue("lightbrand.action", "brand.action")}
            color={useColorModeValue("white", "black")}
            _hover={{
              bg: useColorModeValue("lightbrand.accent", "brand.accent"),
            }}
            _active={{
              bg: useColorModeValue("lightbrand.surface", "brand.surface"),
            }}
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
          <Text fontSize="lg" fontWeight="bold" color={textColor} noOfLines={1}>
            {month}
          </Text>
          <Text fontSize="sm" color={subText}>
            {year}
          </Text>
        </Flex>
      </Flex>

      {/* Theme Toggle Button */}
      <Flex justify="flex-end" width="100%" mt={2}>
        <Button onClick={toggleColorMode} size="sm" variant="ghost">
          {colorMode === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
        </Button>
      </Flex>
    </Flex>
  );
}
