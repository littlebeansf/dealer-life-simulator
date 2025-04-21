import { useState } from "react";
import { Button, Box, VStack, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

const MotionBox = motion(Box);
const MotionText = motion(Text);

export default function StartScreen({ onStart }: StartScreenProps) {
  const [portalOpen, setPortalOpen] = useState(false);

  const handleStartClick = () => {
    setPortalOpen(true);
    setTimeout(() => {
      onStart();
    }, 2000); // After portal animation
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
      fontFamily="'Cinzel Decorative', serif"
    >
      {/* Floating Giant Title */}
      <MotionText
        initial={{ opacity: 0, y: -80 }}
        animate={{
          opacity: 1,
          y: 0,
          textShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)",
        }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        fontSize={{ base: "5xl", md: "8xl" }}
        fontWeight="bold"
        color="white"
        textAlign="center"
        mt={16}
        letterSpacing="widest"
        textShadow="0px 0px 15px rgba(0, 255, 255, 0.6)"
        zIndex="10"
      >
        Dealer Life Simulator
      </MotionText>

      {/* Button */}
      <VStack justify="center" align="center" h="full" spacing={8}>
        <Button
          onClick={handleStartClick}
          mt={32}
          size="lg"
          fontSize="2xl"
          px={12}
          py={6}
          bg="blackAlpha.700"
          _hover={{
            bg: "blackAlpha.900",
            textShadow: "0 0 20px cyan",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.7)",
          }}
          color="white"
          border="2px solid white"
          borderRadius="full"
          transition="all 0.4s ease"
          textShadow="0 0 10px rgba(0, 255, 255, 0.8)"
          letterSpacing="wider"
          fontFamily="'Cinzel Decorative', serif"
          zIndex="10"
        >
          Begin the Pact
        </Button>
      </VStack>

      {/* Magical Portal Animation */}
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
