import { Button, Box, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

// Motion wrapper for animation
const MotionBox = motion(Box);

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      w="100vw"
      h="100vh"
      bgImage="url('/assets/start-screen.png')"
      bgPosition="center"
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <VStack justify="center" align="center" h="100%">
        <Button colorScheme="teal" size="lg" onClick={onStart}>
          Start Dealing
        </Button>
      </VStack>
    </MotionBox>
  );
}

export default StartScreen;
