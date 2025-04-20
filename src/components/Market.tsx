// src/components/Market.tsx

import { Button, Flex, HStack, Text, VStack, Tooltip } from "@chakra-ui/react";
import { DealerState, Product } from "@/types/game";
import { products } from "@/data/products"; // ✅ Use real products list
import { useState } from "react";

interface MarketProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

export default function Market({ dealerState, setDealerState }: MarketProps) {
  const handleBuy = (product: Product) => {
    if (dealerState.stats.gold < product.basePrice) {
      alert("You don't have enough gold!");
      return;
    }

    const newGold = dealerState.stats.gold - product.basePrice;
    const existingItem = dealerState.storage.find(
      (item) => item.productId === product.id
    );

    let newStorage = [...dealerState.storage];
    if (existingItem) {
      newStorage = newStorage.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newStorage.push({ productId: product.id, quantity: 1 });
    }

    setDealerState({
      ...dealerState,
      stats: {
        ...dealerState.stats,
        gold: newGold,
      },
      storage: newStorage,
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      {products.map((product) => (
        <Flex
          key={product.id}
          justify="space-between"
          align="center"
          p={3}
          bg="gray.700"
          borderRadius="md"
        >
          <HStack>
            <Text fontSize="lg">
              {product.icon} {product.name}
            </Text>
            <Tooltip label={product.rarity} bg="purple.600">
              <Text fontSize="sm" color="gray.300">
                ({product.rarity})
              </Text>
            </Tooltip>
          </HStack>
          <HStack spacing={4}>
            <Text>💰 {product.basePrice}g</Text>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={() => handleBuy(product)}
            >
              Buy
            </Button>
          </HStack>
        </Flex>
      ))}
    </VStack>
  );
}
