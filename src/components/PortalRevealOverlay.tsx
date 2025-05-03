import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, useColorModeValue } from "@chakra-ui/react";

const MotionBox = motion(Box);

export default function PortalRevealOverlay() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const bg = useColorModeValue("lightbrand.background", "brand.background");

  return (
    <AnimatePresence>
      {show && (
        <MotionBox
          initial={{
            WebkitMaskImage:
              "radial-gradient(circle at center, transparent 0%, black 0%)",
            maskImage:
              "radial-gradient(circle at center, transparent 0%, black 0%)",
          }}
          animate={{
            WebkitMaskImage:
              "radial-gradient(circle at center, transparent 150%, black 151%)",
            maskImage:
              "radial-gradient(circle at center, transparent 150%, black 151%)",
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          bg={bg}
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          zIndex="9999"
          pointerEvents="none"
        />
      )}
    </AnimatePresence>
  );
}
