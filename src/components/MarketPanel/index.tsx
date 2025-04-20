import {
  Box,
  Heading,
  HStack,
  Button,
  Grid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { DealerState, Product } from "@/types/game";
import ProductCard from "./ProductCard";

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
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box flex="1" bg="brand.surface" p={4} borderRadius="md" overflow="hidden">
      <Heading size="md" color="brand.text" textAlign="center" mb={4}>
        Marketplace - {dealerState.location}
      </Heading>

      <HStack justify="center" mb={4} spacing={3}>
        {[1, 10, 100].map((amount) => (
          <Button
            key={amount}
            size="sm"
            onClick={() => setDefaultBuyAmount(amount)}
          >
            Buy {amount}
          </Button>
        ))}
      </HStack>

      <Box overflowX="hidden" overflowY="auto" py={2} px={1}>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap={4}
          w="full"
        >
          {products
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => {
              const price = marketPrices[product.id];
              const stock = marketStock[product.id];
              const quantity = buyAmounts[product.id] || defaultBuyAmount;
              const canAfford = dealerState.stats.gold >= price * quantity;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  price={price}
                  stock={stock}
                  quantity={quantity}
                  canAfford={canAfford}
                  handleBuy={handleBuy}
                  setBuyAmounts={setBuyAmounts}
                />
              );
            })}
        </Grid>
      </Box>
    </Box>
  );
}
