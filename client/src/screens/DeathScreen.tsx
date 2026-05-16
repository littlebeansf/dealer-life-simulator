import type { GameState } from '../game/types';
import { RACES } from '../game/data/races';
import { LOCATIONS } from '../game/data/locations';
import { getUnderworldRank, getPublicRepLabel } from '../game/engine';

interface Props {
  gameState: GameState;
  onNewGame: () => void;
  onMainMenu: () => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

export default function DeathScreen({ gameState: gs, onNewGame, onMainMenu }: Props) {
  const { player, eventLog, people } = gs;
  const race = RACES[player.raceId];
  const location = LOCATIONS[gs.currentLocationId];

  // Build legacy stats
  const tradesCount = eventLog.filter(e => e.type === 'trade').length;
  const travelsCount = eventLog.filter(e => e.type === 'travel').length;
  const eventsCount = eventLog.filter(e => e.type === 'event').length;
  const alliesCount = Object.values(people).filter(p => p.relationship >= 50).length;
  const enemiesCount = Object.values(people).filter(p => p.relationship <= -30).length;

  const uwRank = getUnderworldRank(player.reputation.underworld);
  const pubLabel = getPublicRepLabel(player.reputation.public);

  const deathEntry = eventLog.find(e => e.type === 'death');
  const deathReason = deathEntry?.text ?? 'Your health failed you.';

  // Prestige score
  const score = Math.round(
    player.money * 0.01 +
    player.reputation.underworld * 2 +
    Math.abs(player.reputation.public) * 1.5 +
    tradesCount * 3 +
    travelsCount * 5 +
    alliesCount * 10 +
    player.stats.charisma * 0.5 +
    player.stats.intelligence * 0.5
  );

  const rankTitle =
    score >= 1000 ? 'LEGENDARY DEALER' :
    score >= 500 ? 'NOTORIOUS BARON' :
    score >= 200 ? 'SEASONED HUSTLER' :
    score >= 100 ? 'SMALL-TIME RUNNER' :
    'FORGOTTEN NOBODY';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-8 px-4 pb-8 overflow-y-auto">
      {/* Death header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">💀</div>
        <h1 className="text-[10px] font-bold text-destructive mb-2" style={PX}>YOU HAVE DIED</h1>
        <div className="h-px bg-destructive/40 w-48 mx-auto my-3" />
        <p className="text-[7px] text-muted-foreground ui-text italic max-w-xs">
          "{deathReason}"
        </p>
      </div>

      {/* Character summary */}
      <div className="w-full max-w-sm bg-card border-2 border-border p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{race.emoji}</span>
          <div>
            <p className="text-[8px] font-bold text-foreground" style={PX}>{player.name}</p>
            <p className="text-[5px] text-muted-foreground ui-text">{race.name} · Died age {player.age} in {location.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          {[
            { label: 'GOLD LEFT', value: `${player.money}g`, color: 'text-accent' },
            { label: 'YEARS LIVED', value: player.age, color: 'text-foreground' },
            { label: 'TRADES', value: tradesCount, color: 'text-primary' },
            { label: 'TRAVELS', value: travelsCount, color: 'text-blue-400' },
            { label: 'ALLIES', value: alliesCount, color: 'text-primary' },
            { label: 'ENEMIES', value: enemiesCount, color: 'text-destructive' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-secondary/50 p-2">
              <p className="text-[4px] text-muted-foreground mb-1" style={PX}>{label}</p>
              <p className={`text-[8px] font-bold ${color}`} style={PX}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reputation legacy */}
      <div className="w-full max-w-sm bg-card border border-border p-3 mb-4">
        <p className="text-[6px] text-muted-foreground mb-2" style={PX}>FINAL REPUTATION</p>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[5px] text-muted-foreground ui-text">PUBLIC</span>
            <span className="text-[5px] text-foreground ui-text">{pubLabel} ({player.reputation.public > 0 ? '+' : ''}{player.reputation.public})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[5px] text-muted-foreground ui-text">UNDERWORLD</span>
            <span className="text-[5px] text-purple-400 ui-text">{uwRank} ({player.reputation.underworld})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[5px] text-muted-foreground ui-text">FEAR</span>
            <span className="text-[5px] text-destructive ui-text">{player.reputation.fear}/100</span>
          </div>
        </div>
      </div>

      {/* Legacy score */}
      <div className="w-full max-w-sm bg-card border-2 border-accent/50 p-4 mb-6 text-center">
        <p className="text-[5px] text-muted-foreground mb-1" style={PX}>LEGACY SCORE</p>
        <p className="text-[14px] font-bold text-accent mb-1" style={PX}>{score}</p>
        <p className="text-[7px] font-bold text-foreground" style={PX}>{rankTitle}</p>
      </div>

      {/* Last 5 log entries */}
      <div className="w-full max-w-sm mb-6">
        <p className="text-[5px] text-muted-foreground mb-2" style={PX}>FINAL MOMENTS</p>
        <div className="space-y-1">
          {eventLog.slice(0, 5).map(entry => (
            <div key={entry.id} className={`log-entry type-${entry.type} px-2 py-1`}>
              <span className="text-[8px] text-muted-foreground ui-text">{entry.emoji ?? '•'} {entry.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm space-y-2">
        <button
          data-testid="btn-new-life"
          onClick={onNewGame}
          className="w-full py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold hover:bg-primary/30 transition-colors"
          style={PX}
        >
          ▶ NEW LIFE
        </button>
        <button
          data-testid="btn-main-menu"
          onClick={onMainMenu}
          className="w-full py-2 px-4 border-2 border-border bg-card text-muted-foreground text-[7px] hover:text-foreground hover:border-border/80 transition-colors"
          style={PX}
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
}
