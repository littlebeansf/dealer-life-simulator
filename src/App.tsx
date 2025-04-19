import { useState } from "react";
import StartScreen from "./components/StartScreen";
import CharacterCreation from "./components/CharacterCreation";
import MainGame from "./components/MainGame";
import { DealerState } from "./types/game";
import { createDealerState } from "./utils/createDealerState"; // ✅ Correct import

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [dealerState, setDealerState] = useState<DealerState | null>(null);

  if (!gameStarted) {
    return <StartScreen onStart={() => setGameStarted(true)} />;
  }

  if (!dealerState) {
    return (
      <CharacterCreation
        onConfirm={(newDealer) => {
          const dealerState = createDealerState(newDealer); // ✅ Convert Dealer ➔ DealerState here
          setDealerState(dealerState);
        }}
      />
    );
  }

  return <MainGame dealerState={dealerState} setDealerState={setDealerState} />;
}

export default App;
