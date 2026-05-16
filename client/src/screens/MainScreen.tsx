import type { GameState } from '../game/types';
import { ageUp } from '../game/engine';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import { useBanner } from '../hooks/useBanner';

interface Props {
  gameState: GameState;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

const LOG_COLORS: Record<string, string> = {
  birth: 'text-yellow-300',
  travel: 'text-sky-300',
  trade: 'text-emerald-300',
  event: 'text-amber-300',
  activity: 'text-emerald-300',
  relationship: 'text-violet-300',
  age_up: 'text-yellow-300',
  death: 'text-red-400',
  rumor: 'text-purple-300',
};

export default function MainScreen({ gameState: gs, onUpdate, onNavigate }: Props) {
  const { player } = gs;
  const { showBanner } = useBanner();

  const handleAgeUp = () => {
    if (gs.pendingEvent) {
      showBanner('Resolve the event first!', 'warning');
      return;
    }
    const newState = ageUp(gs);
    onUpdate(newState);
  };

  // Rumors strip content for the panel
  const panelExtra = gs.rumors && gs.rumors.length > 0 ? (
    <p className="text-[5px] text-purple-300 mt-1 truncate" style={{ fontFamily: 'Courier New, monospace' }}>
      👂 {gs.rumors[0]}
    </p>
  ) : null;

  return (
    <GameLayout gameState={gs} panelExtra={panelExtra}>
      {/* Age-up button */}
      <div className="px-3 pt-3 pb-1 border-b border-border">
        <button
          data-testid="btn-age-up"
          onClick={handleAgeUp}
          disabled={!!gs.pendingEvent}
          className="w-full py-2 px-4 pixel-border-accent bg-accent/20 text-accent text-[8px] font-bold hover:bg-accent/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={PX}
        >
          🎂 +1 YEAR → Age {player.age + 1}
        </button>
        {gs.pendingEvent && (
          <p className="text-[5px] text-destructive text-center mt-1 ui-text">Resolve the event first!</p>
        )}
      </div>

      {/* Event log */}
      <div className="px-3 py-2 space-y-1 pb-20">
        {gs.eventLog.length === 0 && (
          <p className="text-[6px] text-muted-foreground ui-text py-2">Your life begins here...</p>
        )}
        {gs.eventLog.slice(0, 50).map(entry => (
          <div key={entry.id} className="fade-in">
            <div className="flex items-start gap-1 py-0.5">
              <span className="text-sm flex-shrink-0 leading-none mt-0.5">{entry.emoji ?? '•'}</span>
              <div>
                <span className="text-[5px] text-muted-foreground ui-text mr-2">Age {entry.age}</span>
                <span className={`text-[10px] ui-text leading-relaxed ${LOG_COLORS[entry.type] ?? 'text-foreground'}`}>
                  {entry.text}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav current="main" onNavigate={onNavigate} />
    </GameLayout>
  );
}
