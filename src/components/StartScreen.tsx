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
    }, 2000);
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
      //fontFamily="'IM Fell English SC', serif"
    >
      {/* Title */}
      <MotionText
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        fontSize={{ base: "4xl", md: "7xl" }}
        fontWeight="bold"
        color="white"
        textAlign="center"
        mt={{ base: 20, md: 28 }}
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
            bg="blackAlpha.700"
            color="white"
            borderRadius="full"
            letterSpacing="wide"
            //fontFamily="'IM Fell English SC', serif"
            boxShadow="none"
            border="none"
            _hover={{
              bg: "blackAlpha.800",
              boxShadow: "none",
              border: "none",
            }}
            _focus={{
              boxShadow: "none",
              borderColor: "transparent",
              border: "none",
            }}
            _active={{
              boxShadow: "none",
              borderColor: "transparent",
              border: "none",
              bg: "blackAlpha.800",
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
