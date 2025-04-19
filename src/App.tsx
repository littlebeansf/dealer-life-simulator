import { useState } from "react";
import StartScreen from "./components/StartScreen";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <>
      {!gameStarted ? (
        <StartScreen onStart={() => setGameStarted(true)} />
      ) : (
        <div className="text-white text-center text-2xl">
          Game Started! (Temporary screen)
        </div>
      )}
    </>
  );
}

export default App;
