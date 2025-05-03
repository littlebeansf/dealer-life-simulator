import { useState } from "react";
import { Button, Box, VStack, Text, useColorModeValue } from "@chakra-ui/react";
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
    }, 2000);
  };

  const titleColor = useColorModeValue("lightbrand.heading", "brand.heading");
  const buttonBg = useColorModeValue("whiteAlpha.900", "whiteAlpha.200");
  const buttonHover = useColorModeValue("gray.100", "whiteAlpha.300");
  const buttonText = useColorModeValue("black", "white");

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
      {/* Floating Title */}
      <MotionText
        initial={{ opacity: 1, y: 0 }}
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
        }}
        fontSize={{ base: "4xl", md: "7xl" }}
        fontWeight="bold"
        color={titleColor}
        textAlign="center"
        mt={{ base: 40, md: 56 }}
        letterSpacing="wider"
        zIndex="10"
      >
        Dealer Life Simulator
      </MotionText>

      {/* Button */}
      <VStack
        justify="center"
        align="center"
        h="full"
        spacing={8}
        mt={{ base: -24, md: -32 }}
      >
        <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}>
          <Button
            onClick={handleStartClick}
            size="lg"
            fontSize={{ base: "2xl", md: "3xl" }}
            px={{ base: 12, md: 16 }}
            py={{ base: 7, md: 9 }}
            bg={buttonBg}
            color={buttonText}
            borderRadius="full"
            letterSpacing="wide"
            boxShadow="md"
            _hover={{ bg: buttonHover }}
            _focus={{ boxShadow: "none", borderColor: "transparent" }}
            _active={{
              boxShadow: "none",
              borderColor: "transparent",
              bg: buttonHover,
            }}
            zIndex="10"
          >
            Begin the Pact
          </Button>
        </motion.div>
      </VStack>

      {/* Magical Portal Transition */}
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
