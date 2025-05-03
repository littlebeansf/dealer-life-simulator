import { HStack, Input, Button, useColorModeValue } from "@chakra-ui/react";

interface BuyControlsProps {
  productId: string;
  quantity: number;
  stock: number;
  canAfford: boolean;
  handleBuy: (productId: string) => void;
  setBuyAmounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export default function BuyControls({
  productId,
  quantity,
  stock,
  canAfford,
  handleBuy,
  setBuyAmounts,
}: BuyControlsProps) {
  const inputBg = useColorModeValue("white", "gray.700");

  return (
    <HStack mt={3} spacing={2}>
      <Input
        type="number"
        size="xs"
        value={quantity}
        min={1}
        max={stock}
        onChange={(e) =>
          setBuyAmounts((prev) => ({
            ...prev,
            [productId]: Math.max(
              1,
              Math.min(stock, parseInt(e.target.value) || 1)
            ),
          }))
        }
        w="50px"
        textAlign="center"
        bg={inputBg}
      />
      <Button
        size="xs"
        colorScheme="teal"
        onClick={() => handleBuy(productId)}
        isDisabled={!canAfford || stock <= 0}
      >
        Buy
      </Button>
    </HStack>
  );
}
