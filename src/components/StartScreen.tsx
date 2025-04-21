import { useState } from "react";
import { Button, Box, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

const MotionBox = motion(Box);

export default function StartScreen({ onStart }: StartScreenProps) {
  const [portalOpen, setPortalOpen] = useState(false);

  const handleStartClick = () => {
    setPortalOpen(true);
    setTimeout(() => {
      onStart();
    }, 2000); // After the portal animation
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      w="100vw"
      h="100vh"
      backgroundImage={`url(${
        import.meta.env.BASE_URL
      }assets/start-screen.png)`}
      bgPosition="center"
      bgSize="cover"
      bgRepeat="no-repeat"
      position="relative"
      overflow="hidden"
    >
      <VStack justify="center" align="center" h="100%">
        <Button colorScheme="teal" size="lg" onClick={handleStartClick}>
          Start Dealing
        </Button>
      </VStack>

      {/* Black screen with magical circular opening */}
      <AnimatePresence>
        {portalOpen && (
          <MotionBox
            initial={{
              clipPath: "circle(0% at 50% 50%)",
              backgroundColor: "black",
            }}
            animate={{
              clipPath: "circle(150% at 50% 50%)",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            zIndex="20"
          />
        )}
      </AnimatePresence>
    </MotionBox>
  );
}
