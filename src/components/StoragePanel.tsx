import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { DealerState } from "@/types/game";
import { products } from "@/data/products";

interface StoragePanelProps {
  dealerState: DealerState;
  marketPrices: Record<string, number>;
  handleSellAmount: (productId: string, amount: number) => void;
  handleSellAll: (productId: string) => void;
  totalStorageValue: number;
}

export default function StoragePanel({
  dealerState,
  marketPrices,
  handleSellAmount,
  handleSellAll,
  totalStorageValue,
}: StoragePanelProps) {
  const findProduct = (id: string) => products.find((p) => p.id === id);

  const sortedStorage = dealerState.storage.slice().sort((a, b) => {
    const productA = findProduct(a.productId);
    const productB = findProduct(b.productId);
    return (productA?.name || "").localeCompare(productB?.name || "");
  });

  return (
    <Box flex="1" bg="brand.surface" p={4} borderRadius="md" overflowY="auto">
      <Heading size="md" color="brand.text" textAlign="center" mb={4}>
        Your Storage
      </Heading>

      <Table variant="simple" colorScheme="gray" size="sm">
        <Thead>
          <Tr>
            <Th color="brand.text">Product</Th>
            <Th color="brand.text">Qty</Th>
            <Th color="brand.text">Avg Buy</Th>
            <Th color="brand.text">Sell Price</Th>
            <Th color="brand.text">Sell</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedStorage.map((item) => {
            const product = findProduct(item.productId);
            const quantityOwned = item.quantity;
            const totalSpent = item.totalSpent || 0;
            const avgBuyPrice =
              quantityOwned > 0 ? (totalSpent / quantityOwned).toFixed(1) : "-";
            const currentSellPrice = marketPrices[item.productId] || "-";

            return (
              <Tr key={item.productId}>
                <Td color="brand.text">
                  <HStack spacing={2}>
                    <Box fontSize="lg">{product?.icon}</Box>
                    <Text fontSize="sm">{product?.name}</Text>
                  </HStack>
                </Td>

                <Td color="brand.text">{quantityOwned}</Td>
                <Td color="brand.text">${avgBuyPrice}</Td>
                <Td color="brand.text">${currentSellPrice}</Td>

                <Td>
                  <Flex direction="column" align="center" gap={1}>
                    <HStack spacing={1}>
                      <Button
                        size="xs"
                        onClick={() => handleSellAmount(item.productId, 1)}
                        isDisabled={quantityOwned < 1}
                      >
                        1
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleSellAmount(item.productId, 10)}
                        isDisabled={quantityOwned < 10}
                      >
                        10
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleSellAmount(item.productId, 100)}
                        isDisabled={quantityOwned < 100}
                      >
                        100
                      </Button>
                    </HStack>

                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleSellAll(item.productId)}
                      isDisabled={quantityOwned <= 0}
                    >
                      All
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            );
          })}

          <Tr>
            <Td fontWeight="bold" color="brand.text">
              Total
            </Td>
            <Td fontWeight="bold" color="brand.text" colSpan={4}>
              {totalStorageValue}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
