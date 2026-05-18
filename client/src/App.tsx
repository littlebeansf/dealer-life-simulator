import { useState, useEffect } from 'react';
import { loadGame, deleteSave, saveGame, listSaves } from './game/engine';
import { MainMenuProvider } from './hooks/useMainMenu';
import type { GameState } from './game/types';
import MainMenuScreen from './screens/MainMenuScreen';
import NewGameScreen from './screens/NewGameScreen';
import MainScreen from './screens/MainScreen';
import CharacterScreen from './screens/CharacterScreen';
import InventoryScreen from './screens/InventoryScreen';
import MarketScreen from './screens/MarketScreen';
import MapScreen from './screens/MapScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import PeopleScreen from './screens/PeopleScreen';
import PersonDetailScreen from './screens/PersonDetailScreen';
import GangsScreen from './screens/GangsScreen';
import DeathScreen from './screens/DeathScreen';
import EventModal from './components/EventModal';

type SaveSlot = { slot: number; exists: boolean; data: GameState | null };

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [screen, setScreen] = useState<'main_menu' | 'new_game' | 'game'>('main_menu');
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSaves = async () => {
    const s = await listSaves();
    setSaves(s);
    return s;
  };

  useEffect(() => {
    async function init() {
      await refreshSaves();
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-[8px] blink" style={{ fontFamily: 'Press Start 2P, monospace' }}>
          LOADING...
        </div>
      </div>
    );
  }

  if (screen === 'main_menu') {
    return (
      <MainMenuScreen
        saves={saves}
        onNewGame={(slot: number) => {
          setActiveSlot(slot);
          setScreen('new_game');
        }}
        onLoad={async (slot: number) => {
          const saved = await loadGame(slot);
          if (saved) {
            setActiveSlot(slot);
            setGameState(saved);
            setScreen('game');
          }
        }}
        onDeleteSave={async (slot: number) => {
          await deleteSave(slot);
          await refreshSaves();
        }}
      />
    );
  }

  if (screen === 'new_game') {
    return (
      <NewGameScreen
        onStart={async (state) => {
          // Save to the chosen slot immediately
          await saveGame(state, activeSlot);
          setGameState(state);
          await refreshSaves();
          setScreen('game');
        }}
        onBack={() => setScreen('main_menu')}
      />
    );
  }

  if (!gameState) return null;

  const gs = gameState;
  const currentScreen = gs.screen;

  const updateState = (newState: GameState) => {
    setGameState(newState);
    void saveGame(newState, activeSlot);
  };

  // Event modal overlay
  const eventOverlay = gs.pendingEvent ? (
    <EventModal
      gameState={gs}
      onResolve={(newState) => {
        updateState({ ...newState, pendingEvent: null });
      }}
    />
  ) : null;

  if (currentScreen === 'death') {
    return (
      <>
        <DeathScreen gameState={gs} onNewGame={async () => {
          await deleteSave(activeSlot);
          setGameState(null);
          await refreshSaves();
          setScreen('new_game');
        }} onMainMenu={async () => {
          await deleteSave(activeSlot);
          setGameState(null);
          await refreshSaves();
          setScreen('main_menu');
        }} />
        {eventOverlay}
      </>
    );
  }

  const navigate = (s: GameState['screen']) => {
    updateState({ ...gs, screen: s });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main':
        return <MainScreen gameState={gs} onUpdate={updateState} onNavigate={navigate} />;
      case 'character':
        return <CharacterScreen gameState={gs} onNavigate={navigate} />;
      case 'inventory':
        return <InventoryScreen gameState={gs} onNavigate={navigate} />;
      case 'market':
        return <MarketScreen gameState={gs} onUpdate={updateState} onNavigate={navigate} />;
      case 'map':
        return <MapScreen gameState={gs} onUpdate={updateState} onNavigate={navigate} />;
      case 'activities':
        return <ActivitiesScreen gameState={gs} onUpdate={updateState} onNavigate={navigate} />;
      case 'people':
        return (
          <PeopleScreen
            gameState={gs}
            onNavigate={navigate}
            onSelectPerson={(id) => {
              setSelectedPersonId(id);
              navigate('person_detail');
            }}
          />
        );
      case 'person_detail':
        return (
          <PersonDetailScreen
            gameState={gs}
            personId={selectedPersonId}
            onUpdate={updateState}
            onNavigate={navigate}
          />
        );
      case 'gangs':
        return <GangsScreen gameState={gs} onUpdate={updateState} onNavigate={navigate} />;
      default:
        return <MainScreen gameState={gs} onUpdate={updateState} onNavigate={navigate} />;
    }
  };

  const goToMainMenu = async () => {
    setGameState(null);
    await refreshSaves();
    setScreen('main_menu');
  };

  return (
    <MainMenuProvider onMainMenu={goToMainMenu}>
      {renderScreen()}
      {eventOverlay}
    </MainMenuProvider>
  );
}
