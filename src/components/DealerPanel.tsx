import {
  Box,
  Flex,
  VStack,
  Progress,
  Text,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { DealerState } from "@/types/game";
import { raceIcons } from "@/utils/raceIcons";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface DealerPanelProps {
  dealerState: DealerState;
}

export default function DealerPanel({ dealerState }: DealerPanelProps) {
  const animatedGold = useAnimatedNumber(dealerState.stats.gold);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = monthNames[dealerState.time.month];

  return (
    <Flex
      direction="column"
      bg="brand.surface"
      p={4}
      borderRadius="md"
      w="full"
      maxW={{ base: "100%", md: "300px" }}
      align="center"
      overflow="hidden"
      flexShrink={0}
      gap={3}
    >
      {/* Top Row */}
      <Flex
        w="100%"
        direction="row"
        align="center"
        justify="space-between"
        gap={3}
      >
        <Box
          boxSize="80px"
          borderRadius="full"
          bg="gray.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="3xl"
        >
          {raceIcons[dealerState.race]}
        </Box>

        <VStack spacing={1} align="end">
          <Text fontSize="lg" fontWeight="bold" color="brand.text">
            💰 {animatedGold} $
          </Text>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<SettingsIcon />}
              variant="outline"
              size="sm"
              colorScheme="gray"
              aria-label="Settings"
            />
            <MenuList>
              <MenuItem onClick={() => alert("Save Game coming soon!")}>
                Save Game
              </MenuItem>
              <MenuItem onClick={() => alert("Load Game coming soon!")}>
                Load Game
              </MenuItem>
              <MenuItem onClick={() => alert("Exit to Main Menu!")}>
                Exit to Main Menu
              </MenuItem>
            </MenuList>
          </Menu>
        </VStack>
      </Flex>

      {/* Name and Info */}
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="brand.text"
        textAlign="center"
      >
        {dealerState.name}
      </Text>
      <Text fontSize="sm" color="brand.text" textAlign="center">
        Age {dealerState.time.age} · {dealerState.gender} · {currentMonth}
      </Text>

      {/* Life and Sanity Bars */}
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

      {/* Stats */}
      <HStack spacing={4} mt={4} flexWrap="wrap" justify="center">
        <HStack spacing={1}>
          <Text fontSize="2xl" color="brand.text">
            💪
          </Text>
          <Text color="brand.text">{dealerState.stats.strength}</Text>
        </HStack>

        <HStack spacing={1}>
          <Text fontSize="2xl" color="brand.text">
            🏃
          </Text>
          <Text color="brand.text">{dealerState.stats.speed}</Text>
        </HStack>
      </HStack>
    </Flex>
  );
}
