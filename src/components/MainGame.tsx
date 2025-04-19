// /pages/MainGame.tsx

import {
  Box,
  Button,
  Flex,
  HStack,
  VStack,
  Text,
  Progress,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { DealerState } from "../types/game";
import { products } from "../data/products"; // ✅ Now imported correctly
import { advanceTime, generateMarketPrices } from "../utils/gameLogic";
import { useState, useEffect } from "react";
import { raceIcons } from "../utils/raceIcons";
import { AddIcon } from "@chakra-ui/icons";

interface MainGameProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

export default function MainGame({
  dealerState,
  setDealerState,
}: MainGameProps) {
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const prices = generateMarketPrices(products);
    setMarketPrices(prices);
  }, []);

  const handleNextTurn = () => {
    const newState = advanceTime(dealerState);
    setDealerState(newState);
    const newPrices = generateMarketPrices(products);
    setMarketPrices(newPrices);
  };

  const handleBuy = (productId: string) => {
    const price = marketPrices[productId];
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (dealerState.stats.gold < price) {
      alert("You don't have enough gold!");
      return;
    }

    const newGold = dealerState.stats.gold - price;
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

  const handleSell = (productId: string) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );

    if (!existingItem || existingItem.quantity <= 0) {
      return;
    }

    const newStorage = dealerState.storage
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    const newGold = dealerState.stats.gold + price;

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
    <Flex direction="column" minH="100vh" bg="brand.background">
      {/* Top Bar */}
      <Flex bg="#2A2A2A" p={4} align="center" justify="center" width="100%">
        <Heading size="lg" color="white">
          Dealer Life Simulator
        </Heading>
      </Flex>

      {/* Main Content */}
      <Flex flex="1" direction={{ base: "column", md: "row" }} p={6} gap={6}>
        {/* Left Panel: Dealer Stats */}
        <Flex
          direction="column"
          bg="brand.surface"
          p={4}
          borderRadius="md"
          minW={{ base: "100%", md: "300px" }}
          align="center"
        >
          <Box
            boxSize="120px"
            borderRadius="full"
            bg="gray.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="5xl"
          >
            {raceIcons[dealerState.race]}
          </Box>

          <Text fontSize="2xl" fontWeight="bold" color="brand.text" mt={4}>
            {dealerState.name}
          </Text>
          <Text color="brand.text">
            Age {dealerState.time.age} · {dealerState.gender}
          </Text>

          <Box mt={4} w="100%">
            <Text fontSize="sm" color="brand.text">
              ❤️ Life
            </Text>
            <Progress
              value={dealerState.stats.life}
              colorScheme="red"
              size="sm"
              borderRadius="md"
            />
            <Text fontSize="sm" color="brand.text" mt={2}>
              🧠 Sanity
            </Text>
            <Progress
              value={dealerState.stats.sanity}
              colorScheme="blue"
              size="sm"
              borderRadius="md"
            />
          </Box>

          <VStack spacing={3} mt={6}>
            <HStack spacing={2}>
              <Text fontSize="2xl" color="brand.text">
                💪
              </Text>
              <Text color="brand.text">{dealerState.stats.strength}</Text>
            </HStack>
            <HStack spacing={2}>
              <Text fontSize="2xl" color="brand.text">
                🏃
              </Text>
              <Text color="brand.text">{dealerState.stats.speed}</Text>
            </HStack>
            <HStack spacing={2}>
              <Text fontSize="2xl" color="brand.text">
                💰
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="brand.text">
                {dealerState.stats.gold} $
              </Text>
            </HStack>
          </VStack>
        </Flex>

        {/* Right Panel: Market + Storage */}
        <Flex direction={{ base: "column", md: "row" }} flex="1" gap={6}>
          {/* Market */}
          <Box flex="1" bg="brand.surface" p={6} borderRadius="md">
            <Heading size="md" color="brand.text" textAlign="center">
              Market - {dealerState.location}
            </Heading>
            <Text textAlign="center" color="brand.text" fontSize="md" mt={2}>
              {monthNames[dealerState.time.month]} {dealerState.time.year}
            </Text>

            <VStack spacing={4} mt={4}>
              {products.map((product) => (
                <Flex
                  key={product.id}
                  justify="space-between"
                  align="center"
                  p={4}
                  bg="gray.700"
                  borderRadius="md"
                  w="100%"
                >
                  <HStack spacing={3}>
                    <Box fontSize="2xl">{product.icon}</Box>
                    <Text color="brand.text">{product.name}</Text>
                  </HStack>
                  <HStack>
                    <Text color="brand.text">{marketPrices[product.id]} $</Text>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => handleBuy(product.id)}
                    >
                      Buy
                    </Button>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          </Box>

          {/* Storage */}
          <Box flex="1" bg="brand.surface" p={6} borderRadius="md">
            <Heading size="md" color="brand.text" textAlign="center">
              Your Storage
            </Heading>

            <Table variant="simple" colorScheme="gray" mt={4}>
              <Thead>
                <Tr>
                  <Th color="brand.text">Product</Th>
                  <Th color="brand.text">Quantity</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {dealerState.storage.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <Tr key={item.productId}>
                      <Td color="brand.text">
                        <HStack spacing={3}>
                          <Box fontSize="2xl">{product?.icon}</Box>
                          <Text>{product?.name}</Text>
                        </HStack>
                      </Td>
                      <Td color="brand.text">{item.quantity}</Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleSell(item.productId)}
                        >
                          Sell
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Flex>

      {/* Next Turn Button */}
      <Flex justify="center" py={6}>
        <Button
          size="lg"
          colorScheme="purple"
          leftIcon={<AddIcon />}
          onClick={handleNextTurn}
        >
          Next Turn
        </Button>
      </Flex>
    </Flex>
  );
}
