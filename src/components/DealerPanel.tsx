import {
  Box,
  Flex,
  VStack,
  Text,
  Progress,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { raceIcons } from "@/utils/raceIcons";
import { SettingsIcon } from "@chakra-ui/icons";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface DealerPanelProps {
  dealerState: DealerState;
}

export default function DealerPanel({ dealerState }: DealerPanelProps) {
  const animatedGold = useAnimatedNumber(dealerState.stats.gold);

  return (
    <Flex
      direction="column"
      bg="brand.surface"
      p={4}
      borderRadius="md"
      minW={{ base: "100%", md: "300px" }}
      align="center"
      overflow="hidden"
    >
      <Box
        boxSize="120px"
        borderRadius="full"
        bg="gray.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="5xl"
      >
        {raceIcons[dealerState.race]}
      </Box>

      <Text fontSize="2xl" fontWeight="bold" color="brand.text" mt={4}>
        {dealerState.name}
      </Text>
      <Text color="brand.text">
        Age {dealerState.time.age} · {dealerState.gender}
      </Text>

      <Box mt={4} w="100%">
        <Text fontSize="sm" color="brand.text">
          ❤️ Life
        </Text>
        <Progress
          value={dealerState.stats.life}
          colorScheme="red"
          size="sm"
          borderRadius="md"
        />
        <Text fontSize="sm" color="brand.text" mt={2}>
          🧠 Sanity
        </Text>
        <Progress
          value={dealerState.stats.sanity}
          colorScheme="blue"
          size="sm"
          borderRadius="md"
        />
      </Box>

      <VStack spacing={3} mt={6} flex="1">
        <HStack spacing={2}>
          <Text fontSize="2xl" color="brand.text">
            💪
          </Text>
          <Text color="brand.text">{dealerState.stats.strength}</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontSize="2xl" color="brand.text">
            🏃
          </Text>
          <Text color="brand.text">{dealerState.stats.speed}</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontSize="2xl" color="brand.text">
            💰
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="brand.text">
            {animatedGold} $
          </Text>
        </HStack>
      </VStack>

      <Box mt={4}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<SettingsIcon />}
            variant="outline"
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
      </Box>
    </Flex>
  );
}
