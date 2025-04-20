import {
  Box,
  Flex,
  VStack,
  Heading,
  HStack,
  Text,
  Button,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { DealerState, Product } from "@/types/game";

interface MarketPanelProps {
  dealerState: DealerState;
  products: Product[];
  marketPrices: Record<string, number>;
  buyAmounts: Record<string, number>;
  setBuyAmounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  handleBuy: (productId: string) => void;
  defaultBuyAmount: number;
  setDefaultBuyAmount: React.Dispatch<React.SetStateAction<number>>;
}

export default function MarketPanel({
  dealerState,
  products,
  marketPrices,
  buyAmounts,
  setBuyAmounts,
  handleBuy,
  defaultBuyAmount,
  setDefaultBuyAmount,
}: MarketPanelProps) {
  return (
    <Box flex="1" bg="brand.surface" p={6} borderRadius="md" overflowY="auto">
      <Heading size="md" color="brand.text" textAlign="center" mb={4}>
        Market - {dealerState.location}
      </Heading>

      <HStack justify="center" mb={6} spacing={4}>
        <Button size="sm" onClick={() => setDefaultBuyAmount(1)}>
          Buy 1
        </Button>
        <Button size="sm" onClick={() => setDefaultBuyAmount(10)}>
          Buy 10
        </Button>
        <Button size="sm" onClick={() => setDefaultBuyAmount(100)}>
          Buy 100
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {products.map((product) => {
          const price = marketPrices[product.id];
          const quantity = buyAmounts[product.id] || 1;
          const totalPrice = price * quantity;
          const canAfford = dealerState.stats.gold >= totalPrice;

          return (
            <Flex
              key={product.id}
              direction="column"
              p={4}
              bg="gray.700"
              borderRadius="md"
              align="center"
            >
              <Box fontSize="2xl">{product.icon}</Box>
              <Text color="brand.text" mt={2}>
                {product.name}
              </Text>
              <Text fontWeight="bold" color="brand.text" fontSize="sm">
                {price} $
              </Text>

              <Input
                type="number"
                size="sm"
                value={quantity}
                min={1}
                onChange={(e) =>
                  setBuyAmounts((prev) => ({
                    ...prev,
                    [product.id]: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                mt={3}
                w="80px"
                textAlign="center"
              />

              <Button
                size="sm"
                colorScheme="teal"
                mt={3}
                onClick={() => handleBuy(product.id)}
                isDisabled={!canAfford}
              >
                Buy
              </Button>
            </Flex>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
