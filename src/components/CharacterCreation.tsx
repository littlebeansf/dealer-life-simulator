import {
  VStack,
  Heading,
  Input,
  Button,
  HStack,
  Text,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import { motion } from "framer-motion";

import { Dealer, races, genders, Race, Gender } from "../types/character";
import { generateRandomDealerData } from "../utils/helpers";

const MotionBox = motion(Box);
const MotionText = motion(Text); // ✨ Motion for animated Race Text

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
      },
    };
    onConfirm(newDealer);
  };

  const handleRandomDealer = () => {
    const random = generateRandomDealerData();
    setName(random.name);
    setRace(random.race as Race);
    setGender(random.gender as Gender);

    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 800);
  };

  const sparklePositions = Array.from({ length: 8 }).map(() => ({
    top: `${Math.random() * 60 - 30}px`,
    left: `${Math.random() * 60 - 30}px`,
  }));

  // Get selected race's description
  const selectedRaceInfo = races.find((r) => r.label === race);

  return (
    <MotionBox
      p={6}
      w="100vw"
      h="100vh"
      bgGradient="linear(to-b, gray.900, black)"
      color="white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      position="relative"
      overflow="hidden"
    >
      <VStack spacing={8} justify="center" align="center" h="100%">
        <Heading size="xl" textShadow="0 0 10px #00FFD1">
          Summon Your Dealer
        </Heading>

        <Input
          placeholder="Enter your true name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxW="300px"
          bg="gray.700"
          _placeholder={{ color: "gray.400" }}
        />

        <Box textAlign="center">
          <Text mb={2} fontWeight="bold">
            Select Your Lineage:
          </Text>
          <HStack wrap="wrap" spacing={3} justify="center">
            {races.map((r) => (
              <Tooltip
                key={r.label}
                label={r.description}
                fontSize="sm"
                bg="purple.700"
              >
                <Button
                  onClick={() => setRace(r.label)}
                  colorScheme={race === r.label ? "purple" : "gray"}
                  fontSize="2xl"
                >
                  {r.icon}
                </Button>
              </Tooltip>
            ))}
          </HStack>

          {/* 🪄 Selected Race Display */}
          {selectedRaceInfo && (
            <MotionText
              mt={4}
              fontSize="lg"
              color="purple.300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              ✨ {selectedRaceInfo.label}: {selectedRaceInfo.description}
            </MotionText>
          )}
        </Box>

        <Box>
          <Text mb={2} fontWeight="bold">
            Select Your Form:
          </Text>
          <HStack>
            {genders.map((g) => (
              <Button
                key={g.label}
                onClick={() => setGender(g.label)}
                colorScheme={gender === g.label ? "purple" : "gray"}
              >
                {g.icon}
              </Button>
            ))}
          </HStack>
        </Box>

        <HStack spacing={4} position="relative">
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

          {/* Sparkles */}
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
                  backgroundColor: "#00FFD1",
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
