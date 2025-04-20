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
  Tooltip,
  IconButton,
  SimpleGrid,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { DealerState } from "../types/game";
import { products } from "../data/products";
import { advanceTime, generateMarketPrices } from "../utils/gameLogic";
import { useState, useEffect } from "react";
import { raceIcons } from "../utils/raceIcons";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

interface MainGameProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

export default function MainGame({
  dealerState,
  setDealerState,
}: MainGameProps) {
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [buyAmounts, setBuyAmounts] = useState<Record<string, number>>({});
  const [defaultBuyAmount, setDefaultBuyAmount] = useState<number>(1);
  const toast = useToast();
  const animatedGold = useAnimatedNumber(dealerState.stats.gold);

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

  useEffect(() => {
    const updated: Record<string, number> = {};
    products.forEach((product) => {
      updated[product.id] = defaultBuyAmount;
    });
    setBuyAmounts(updated);
  }, [defaultBuyAmount]);

  const handleNextTurn = () => {
    const newState = advanceTime(dealerState);
    setDealerState(newState);
    const newPrices = generateMarketPrices(products);
    setMarketPrices(newPrices);
  };

  const handleBuy = (productId: string) => {
    const quantity = buyAmounts[productId] || 1;
    const price = marketPrices[productId];
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const totalPrice = price * quantity;

    if (dealerState.stats.gold < totalPrice) {
      alert("You don't have enough gold!");
      return;
    }

    const newGold = dealerState.stats.gold - totalPrice;
    const existingItem = dealerState.storage.find(
      (item) => item.productId === product.id
    );

    let newStorage = [...dealerState.storage];
    if (existingItem) {
      newStorage = newStorage.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newStorage.push({ productId: product.id, quantity: quantity });
    }

    setDealerState({
      ...dealerState,
      stats: { ...dealerState.stats, gold: newGold },
      storage: newStorage,
    });

    toast({
      title: `✅ Bought ${quantity} ${product.name}(s)!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSellAmount = (productId: string, amount: number) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    const product = products.find((p) => p.id === productId);

    if (!existingItem || existingItem.quantity <= 0) return;

    const sellAmount = Math.min(existingItem.quantity, amount);

    const newStorage = dealerState.storage
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - sellAmount }
          : item
      )
      .filter((item) => item.quantity > 0);

    const newGold = dealerState.stats.gold + price * sellAmount;

    setDealerState({
      ...dealerState,
      stats: { ...dealerState.stats, gold: newGold },
      storage: newStorage,
    });

    toast({
      title: `💰 Sold ${sellAmount} ${product?.name}(s)!`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSellAll = (productId: string) => {
    const price = marketPrices[productId];
    const existingItem = dealerState.storage.find(
      (item) => item.productId === productId
    );
    const product = products.find((p) => p.id === productId);

    if (!existingItem) return;

    const sellAmount = existingItem.quantity;

    const newStorage = dealerState.storage.filter(
      (item) => item.productId !== productId
    );

    const newGold = dealerState.stats.gold + price * sellAmount;

    setDealerState({
      ...dealerState,
      stats: { ...dealerState.stats, gold: newGold },
      storage: newStorage,
    });

    toast({
      title: `💰 Sold all ${sellAmount} ${product?.name}(s)!`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const totalStorageValue = dealerState.storage.reduce((sum, item) => {
    const productPrice = marketPrices[item.productId] || 0;
    return sum + productPrice * item.quantity;
  }, 0);

  return (
    <Flex
      direction="column"
      height="100vh"
      bg="brand.background"
      overflow="hidden"
    >
      {/* Top Bar */}
      <Flex
        bg="#2A2A2A"
        p={4}
        align="center"
        justify="center"
        width="100%"
        direction="column"
      >
        <Heading size="lg" color="white">
          Dealer Life Simulator
        </Heading>

        {/* Central Button + Month/Year */}
        <Flex mt={4} align="center" gap={4}>
          <Tooltip label="Next Month" hasArrow>
            <IconButton
              aria-label="Next Month"
              icon={<span style={{ fontSize: "36px" }}>📅</span>}
              size="xl"
              isRound
              variant="solid"
              colorScheme="gray"
              onClick={handleNextTurn}
            />
          </Tooltip>
          <Text fontSize="xl" fontWeight="bold" color="white">
            {monthNames[dealerState.time.month]} {dealerState.time.year}
          </Text>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Flex
        flex="1"
        direction={{ base: "column", md: "row" }}
        overflow="hidden"
      >
        {/* Left Panel: Dealer Stats */}
        <Flex
          direction="column"
          bg="brand.surface"
          p={4}
          borderRadius="md"
          minW={{ base: "100%", md: "300px" }}
          align="center"
          overflow="hidden"
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

          <VStack spacing={3} mt={6} flex="1">
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
                {animatedGold} $
              </Text>
            </HStack>
          </VStack>

          {/* Settings Button */}
          <Box mt={4}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<SettingsIcon />}
                variant="outline"
                colorScheme="gray"
                aria-label="Settings"
              />
              <MenuList>
                <MenuItem onClick={() => alert("Save Game coming soon!")}>
                  Save Game
                </MenuItem>
                <MenuItem onClick={() => alert("Load Game coming soon!")}>
                  Load Game
                </MenuItem>
                <MenuItem onClick={() => alert("Exit to Main Menu!")}>
                  Exit to Main Menu
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>

        {/* Right Panel: Market + Storage */}
        <Flex
          direction={{ base: "column", md: "row" }}
          flex="1"
          overflow="hidden"
          gap={6}
          p={6}
        >
          {/* Market */}
          <Box
            flex="1"
            bg="brand.surface"
            p={6}
            borderRadius="md"
            overflowY="auto"
          >
            <Heading size="md" color="brand.text" textAlign="center" mb={4}>
              Market - {dealerState.location}
            </Heading>

            {/* Buy Multiplier */}
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
                          [product.id]: Math.max(
                            1,
                            parseInt(e.target.value) || 1
                          ),
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

          {/* Storage */}
          <Box
            flex="1"
            bg="brand.surface"
            p={6}
            borderRadius="md"
            overflowY="auto"
          >
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
                  const product = products.find((p) => p.id === item.productId);
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
                              onClick={() =>
                                handleSellAmount(item.productId, 1)
                              }
                              isDisabled={quantityOwned < 1}
                            >
                              Sell 1
                            </Button>
                            <Button
                              size="xs"
                              onClick={() =>
                                handleSellAmount(item.productId, 10)
                              }
                              isDisabled={quantityOwned < 10}
                            >
                              Sell 10
                            </Button>
                            <Button
                              size="xs"
                              onClick={() =>
                                handleSellAmount(item.productId, 100)
                              }
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
        </Flex>
      </Flex>
    </Flex>
  );
}
