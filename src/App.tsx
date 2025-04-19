import { useState } from "react";
import StartScreen from "./components/StartScreen";
import CharacterCreation from "./components/CharacterCreation";
import type { Dealer } from "./types/character";
import { motion, AnimatePresence } from "framer-motion";

const MotionDiv = motion.div;

type ScreenPhase = "start" | "characterCreation" | "game";

function App() {
  const [phase, setPhase] = useState<ScreenPhase>("start");
  const [dealer, setDealer] = useState<Dealer | null>(null);

  const handleStart = () => {
    setPhase("characterCreation");
  };

  const handleDealerConfirm = (newDealer: Dealer) => {
    setDealer(newDealer);
    setPhase("game");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "start" && (
        <MotionDiv
          key="start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <StartScreen onStart={handleStart} />
        </MotionDiv>
      )}

      {phase === "characterCreation" && (
        <MotionDiv
          key="characterCreation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CharacterCreation onConfirm={handleDealerConfirm} />
        </MotionDiv>
      )}

      {phase === "game" && dealer && (
        <MotionDiv
          key="game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white text-center text-2xl"
        >
          Welcome, {dealer.name} the {dealer.race} ({dealer.gender})!
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

export default App;
