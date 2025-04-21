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
    const random = generateRandomDealerData();
    setName(random.name);
    setRace(random.race);
    setGender(random.gender);

    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 800);
  };

  const sparklePositions = Array.from({ length: 8 }).map(() => ({
    top: `${Math.random() * 60 - 30}px`,
    left: `${Math.random() * 60 - 30}px`,
  }));

  const selectedRaceInfo = races.find((r) => r.label === race);

  const genderIcons = {
    Male: "🚹",
    Female: "🚺",
    Other: "🧿",
  };

  return (
    <MotionBox
      p={0}
      w="100vw"
      h="100dvh"
      bg="brand.background"
      color="brand.text"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Top Bar */}
      <Flex bg="#2A2A2A" p={4} align="center" justify="center" flexShrink={0}>
        <Heading size="lg" color="white">
          Dealer Life Simulator
        </Heading>
      </Flex>

      {/* Scrollable Content */}
      <VStack
        spacing={8}
        justify="center"
        align="center"
        flex="1"
        overflowY="auto"
        p={4}
      >
        <Heading size="xl" textAlign="center">
          Summon Your Dealer
        </Heading>

        <Input
          placeholder="Enter your true name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxW="300px"
          bg="brand.surface"
          borderColor="gray.600"
          _placeholder={{ color: "gray.400" }}
        />

        {/* Lineage (Race) Picker */}
        <Box
          textAlign="center"
          bg="brand.surface"
          p={6}
          borderRadius="md"
          shadow="md"
        >
          <Text mb={2} fontWeight="bold">
            Select Your Lineage:
          </Text>
          <HStack wrap="wrap" spacing={4} justify="center">
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
                  p={2}
                  borderRadius="full"
                  w="96px"
                  h="96px"
                  bg={race === r.label ? "purple.600" : "gray.700"}
                  border={
                    race === r.label
                      ? "3px solid #9F7AEA" // Thicker border for active race
                      : "2px solid transparent"
                  }
                  _hover={{
                    bg: race === r.label ? "purple.500" : "gray.600",
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Box w="80px" h="80px">
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
              mt={4}
              fontSize="lg"
              color="gray.300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              ✨ {selectedRaceInfo.label}: {selectedRaceInfo.description}
            </MotionText>
          )}
        </Box>

        {/* Form (Gender) Picker */}
        <Box
          textAlign="center"
          bg="brand.surface"
          p={6}
          borderRadius="md"
          shadow="md"
        >
          <Text mb={2} fontWeight="bold">
            Select Your Form:
          </Text>
          <HStack wrap="wrap" spacing={4} justify="center">
            {genders.map((g) => (
              <Button
                key={g.label}
                onClick={() => setGender(g.label as Gender)}
                colorScheme={gender === g.label ? "purple" : "gray"}
                size="sm"
                fontSize="2xl"
              >
                {genderIcons[g.label as keyof typeof genderIcons]}
              </Button>
            ))}
          </HStack>
        </Box>

        {/* Confirm + Random Buttons with Sparkles */}
        <HStack
          spacing={4}
          position="relative"
          flexWrap="wrap"
          justify="center"
        >
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleConfirm}
            isDisabled={!name}
          >
            Bind the Pact
          </Button>
          <Button
            colorScheme="purple"
            variant="outline"
            size="lg"
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
