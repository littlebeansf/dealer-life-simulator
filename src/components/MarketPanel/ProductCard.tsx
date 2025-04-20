import { Flex, Text, HStack, Input, Button } from "@chakra-ui/react";
import { Product } from "@/types/game";

interface ProductCardProps {
  product: Product;
  price: number;
  stock: number;
  quantity: number;
  canAfford: boolean;
  handleBuy: (productId: string) => void;
  setBuyAmounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export default function ProductCard({
  product,
  price,
  stock,
  quantity,
  canAfford,
  handleBuy,
  setBuyAmounts,
}: ProductCardProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      p={3}
      bg="gray.700"
      borderRadius="md"
      minW="0"
      flexShrink={0}
      h="full"
    >
      <Flex
        borderRadius="full"
        bg="gray.600"
        boxSize="48px"
        align="center"
        justify="center"
        fontSize="2xl"
      >
        {product.icon}
      </Flex>

      <Text
        color="brand.text"
        mt={3}
        fontSize="lg"
        fontWeight="extrabold"
        textAlign="center"
        noOfLines={1}
      >
        {product.name}
      </Text>

      <Text fontSize="md" fontWeight="bold" color="white" mt={1}>
        ${price}
      </Text>

      <Text fontSize="xs" color="gray.300" lineHeight="1">
        Stock: {stock}
      </Text>

      {/* Buy Controls */}
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
              [product.id]: Math.max(
                1,
                Math.min(stock, parseInt(e.target.value) || 1)
              ),
            }))
          }
          w="50px"
          textAlign="center"
        />
        <Button
          size="xs"
          colorScheme="teal"
          onClick={() => handleBuy(product.id)}
          isDisabled={!canAfford || stock <= 0}
        >
          Buy
        </Button>
      </HStack>
    </Flex>
  );
}
