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
import { DealerState } from "@/types/game";

interface SettingsMenuProps {
  dealerState: DealerState;
}

export default function SettingsMenu({ dealerState }: SettingsMenuProps) {
  return (
    <VStack spacing={1} align="end">
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
