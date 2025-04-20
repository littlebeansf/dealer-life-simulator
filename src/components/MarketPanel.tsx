import {
  Box,
  Flex,
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
  marketStock: Record<string, number>;
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
  marketStock,
  buyAmounts,
  setBuyAmounts,
  handleBuy,
  defaultBuyAmount,
  setDefaultBuyAmount,
}: MarketPanelProps) {
  return (
    <Box flex="1" bg="brand.surface" p={4} borderRadius="md" overflowY="auto">
      <Heading size="md" color="brand.text" textAlign="center" mb={4}>
        Marketplace - {dealerState.location}
      </Heading>

      <HStack justify="center" mb={4} spacing={3}>
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

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
        {products.map((product) => {
          const price = marketPrices[product.id];
          const stock = marketStock[product.id];
          const quantity = buyAmounts[product.id] || 1;
          const canAfford = dealerState.stats.gold >= price * quantity;

          return (
            <Flex
              key={product.id}
              direction="column"
              p={4}
              bg="gray.700"
              borderRadius="md"
              align="center"
              minW="140px"
              minH="190px"
              justify="space-between"
            >
              <Box fontSize="2xl">{product.icon}</Box>
              <Text color="brand.text" mt={2} fontWeight="bold" fontSize="sm">
                {product.name}
              </Text>
              <Text color="gray.300" fontSize="xs">
                Stock: {stock}
              </Text>

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
                mt={2}
                w="60px"
                textAlign="center"
              />

              <Button
                size="xs"
                colorScheme="teal"
                mt={2}
                onClick={() => handleBuy(product.id)}
                isDisabled={!canAfford || stock <= 0}
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
