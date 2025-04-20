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
import { products } from "@/data/products"; // ✅ Correct: import products directly.

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

  return (
    <Box flex="1" bg="brand.surface" p={6} borderRadius="md" overflowY="auto">
      <Heading size="md" color="brand.text" textAlign="center">
        Your Storage
      </Heading>

      <Table variant="simple" colorScheme="gray" mt={4}>
        <Thead>
          <Tr>
            <Th color="brand.text">Product</Th>
            <Th color="brand.text">Quantity</Th>
            <Th color="brand.text">Sell</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dealerState.storage.map((item) => {
            const product = findProduct(item.productId);
            const quantityOwned = item.quantity;

            return (
              <Tr key={item.productId}>
                <Td color="brand.text">
                  <HStack spacing={3}>
                    <Box fontSize="2xl">{product?.icon}</Box>
                    <Text>{product?.name}</Text>
                  </HStack>
                </Td>

                <Td color="brand.text">{quantityOwned}</Td>

                <Td>
                  <Flex direction="column" align="center" gap={2}>
                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        onClick={() => handleSellAmount(item.productId, 1)}
                        isDisabled={quantityOwned < 1}
                      >
                        Sell 1
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleSellAmount(item.productId, 10)}
                        isDisabled={quantityOwned < 10}
                      >
                        Sell 10
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleSellAmount(item.productId, 100)}
                        isDisabled={quantityOwned < 100}
                      >
                        Sell 100
                      </Button>
                    </HStack>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleSellAll(item.productId)}
                      isDisabled={quantityOwned <= 0}
                    >
                      Sell All
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            );
          })}

          <Tr>
            <Td fontWeight="bold" color="brand.text">
              Total Value
            </Td>
            <Td fontWeight="bold" color="brand.text" colSpan={2}>
              {totalStorageValue} $
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
