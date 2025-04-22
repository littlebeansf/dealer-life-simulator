import {
  VStack,
  Heading,
  Input,
  Button,
  HStack,
  Text,
  Box,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";

import { races, genders, Gender, Race, Dealer } from "@/types/character";
import { generateRandomDealerData } from "@/utils/helpers";
import { raceImages } from "@/data/raceImages";
import { icons } from "@/data/icons";

const MotionBox = motion(Box);
const MotionText = motion(Text);

interface CharacterCreationProps {
  onConfirm: (dealer: Dealer) => void;
}

export default function CharacterCreation({
  onConfirm,
}: CharacterCreationProps) {
  const [name, setName] = useState("");
  const [race, setRace] = useState<Race>("Human");
  const [gender, setGender] = useState<Gender>("Male");
  const [showSparkles, setShowSparkles] = useState(false);

  const handleConfirm = () => {
    const newDealer: Dealer = {
      name,
      race,
      gender,
      stats: {
        strength: 10,
        speed: 10,
        sanity: 100,
        life: 100,
        gold: 0,
        totalTrades: 0,
        totalGoldEarned: 0,
        totalGoldSpent: 0,
        reputation: 0,
      },
    };
    onConfirm(newDealer);
  };

  const handleRandomDealer = () => {
    let random: { name: string; race: Race; gender: Gender };
    do {
      random = generateRandomDealerData();
    } while (!races.find((r) => r.label === random.race));

    const newDealer: Dealer = {
      name: random.name,
      race: random.race,
      gender: random.gender,
      stats: {
        strength: 10,
        speed: 10,
        sanity: 100,
        life: 100,
        gold: 0,
        totalTrades: 0,
        totalGoldEarned: 0,
        totalGoldSpent: 0,
        reputation: 0,
      },
    };

    setName(newDealer.name);
    setRace(newDealer.race);
    setGender(newDealer.gender);

    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 800);
  };

  const sparklePositions = Array.from({ length: 8 }).map(() => ({
    top: `${Math.random() * 60 - 30}px`,
    left: `${Math.random() * 60 - 30}px`,
  }));

  const selectedRaceInfo = races.find((r) => r.label === race);

  return (
    <MotionBox
      p={0}
      w="100vw"
      h="100vh"
      bg="brand.background"
      color="brand.text"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      //fontFamily="'IM Fell English SC', serif"
    >
      {/* Top Bar */}
      <Flex bg="#2A2A2A" p={3} align="center" justify="center" flexShrink={0}>
        <Heading size="xl" color="white">
          Dealer Life Simulator
        </Heading>
      </Flex>

      {/* Content */}
      <VStack
        spacing={4}
        justify="space-around"
        align="center"
        flex="1"
        overflow="hidden"
        p={3}
        minH="0"
      >
        <Heading size="2xl" textAlign="center" mt={2}>
          Summon Your Dealer
        </Heading>

        <Input
          placeholder="Enter your true name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxW="280px"
          bg="brand.surface"
          borderColor="gray.600"
          fontSize="md"
          _placeholder={{ color: "gray.400" }}
        />

        {/* Lineage Picker */}
        <Box
          textAlign="center"
          bg="brand.surface"
          p={3}
          borderRadius="md"
          shadow="md"
          w="full"
          maxW="800px"
        >
          <Text mb={3} fontSize="lg" fontWeight="bold">
            Select Your Lineage:
          </Text>
          <HStack wrap="wrap" spacing={3} justify="center">
            {races.map((r) => (
              <Tooltip
                key={r.label}
                label={r.description}
                fontSize="sm"
                bg="gray.600"
                color="white"
              >
                <Button
                  onClick={() => setRace(r.label as Race)}
                  size="sm"
                  p={1}
                  borderRadius="full"
                  w="80px"
                  h="80px"
                  bg={race === r.label ? "purple.600" : "gray.700"}
                  border={
                    race === r.label
                      ? "2px solid #9F7AEA"
                      : "1px solid transparent"
                  }
                  _hover={{
                    bg: race === r.label ? "purple.500" : "gray.600",
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Box w="64px" h="64px">
                    <img
                      src={raceImages[r.label] || raceImages["default"]}
                      alt={r.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        imageRendering: "pixelated",
                      }}
                    />
                  </Box>
                </Button>
              </Tooltip>
            ))}
          </HStack>

          {selectedRaceInfo && (
            <MotionText
              mt={3}
              fontSize="md"
              color="gray.300"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {selectedRaceInfo.label}: {selectedRaceInfo.description}
            </MotionText>
          )}
        </Box>

        {/* Gender Picker */}
        <Box
          textAlign="center"
          bg="brand.surface"
          p={3}
          borderRadius="md"
          shadow="md"
          w="full"
          maxW="600px"
        >
          <Text mb={2} fontSize="lg" fontWeight="bold">
            Select Your Form:
          </Text>

          <HStack wrap="wrap" spacing={3} justify="center">
            {genders.map((g) => (
              <Button
                key={g.label}
                onClick={() => setGender(g.label as Gender)}
                colorScheme={gender === g.label ? "purple" : "gray"}
                size="md"
                p={2}
                w="80px"
                h="80px"
                borderRadius="full"
                bg={gender === g.label ? "purple.600" : "gray.700"}
                _hover={{
                  bg: gender === g.label ? "purple.500" : "gray.600",
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  w="48px"
                  h="48px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img
                    src={icons.gender[g.label as keyof typeof icons.gender]}
                    alt={g.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      imageRendering: "pixelated",
                    }}
                  />
                </Box>
              </Button>
            ))}
          </HStack>

          {/* Selected Gender Text */}
          <Text
            mt={3}
            fontSize="md"
            color="gray.300"
            fontWeight="bold"
            textAlign="center"
          >
            ✨ {gender} ✨
          </Text>
        </Box>

        {/* Action Buttons */}
        <HStack
          spacing={4}
          position="relative"
          flexWrap="wrap"
          justify="center"
          pt={2}
        >
          <Button
            colorScheme="teal"
            size="md"
            fontSize="lg"
            px={5}
            onClick={handleConfirm}
            isDisabled={!name}
          >
            Bind the Pact
          </Button>
          <Button
            colorScheme="purple"
            variant="outline"
            size="md"
            fontSize="lg"
            px={5}
            onClick={handleRandomDealer}
          >
            🎲 Roll Random Dealer
          </Button>

          {showSparkles &&
            sparklePositions.map((pos, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#E0E0E0",
                  borderRadius: "50%",
                  top: pos.top,
                  left: pos.left,
                  pointerEvents: "none",
                }}
              />
            ))}
        </HStack>
      </VStack>
    </MotionBox>
  );
}
