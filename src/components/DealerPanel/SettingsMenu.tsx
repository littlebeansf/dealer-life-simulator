import {
  VStack,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { DealerState } from "@/types/game";

interface SettingsMenuProps {
  dealerState: DealerState;
}

export default function SettingsMenu({ dealerState }: SettingsMenuProps) {
  const animatedGold = useAnimatedNumber(dealerState.stats.gold);

  return (
    <VStack spacing={1} align="end">
      <Text
        fontSize="lg"
        fontWeight="bold"
        color="brand.text"
        minW="80px"
        textAlign="right"
      >
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
  );
}
