import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  Button,
  Input,
  Grid,
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
    <Box flex="1" bg="brand.surface" p={4} borderRadius="md" overflow="hidden">
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

      {/* Horizontal Scroll Wrapper */}
      <Box
        overflowX="auto"
        overflowY="hidden"
        sx={{
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#555",
            borderRadius: "6px",
          },
        }}
        py={2}
        px={1}
      >
        {/* Inner Grid */}
        <Grid
          templateRows="repeat(3, 1fr)"
          autoFlow="column"
          gap={4}
          w="max-content"
          minH="500px" // Controls how tall the marketplace is
          alignItems="start"
        >
          {products
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => {
              const price = marketPrices[product.id];
              const stock = marketStock[product.id];
              const quantity = buyAmounts[product.id] || 1;
              const canAfford = dealerState.stats.gold >= price * quantity;

              return (
                <Flex
                  key={product.id}
                  direction="column"
                  p={3}
                  bg="gray.700"
                  borderRadius="md"
                  align="center"
                  minW="160px"
                  flexShrink={0}
                >
                  {/* Top Row */}
                  <HStack w="100%" spacing={3} align="center">
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

                    <Flex direction="column" flex="1">
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        color="white"
                        lineHeight="1"
                      >
                        ${price}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.300"
                        lineHeight="1"
                        mt={1}
                      >
                        Stock: {stock}
                      </Text>
                    </Flex>
                  </HStack>

                  {/* Product Name */}
                  <Text
                    color="brand.text"
                    mt={3}
                    fontSize="md"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    textAlign="center"
                    fontFamily="heading"
                    noOfLines={1}
                  >
                    {product.name}
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
            })}
        </Grid>
      </Box>
    </Box>
  );
}
