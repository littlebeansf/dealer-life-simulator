import type { GameState } from '../game/types';
import { RACES } from '../game/data/races';
import { LOCATIONS } from '../game/data/locations';
import { doPersonAction } from '../game/engine';
import { RACE_IMAGES } from '../assets/pixel';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import StatBar from '../components/StatBar';
import { useBanner } from '../hooks/useBanner';

interface Props {
  gameState: GameState;
  personId: string | null;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

const ACTIONS = [
  { id: 'talk', label: 'TALK', emoji: '💬', cost: '', desc: 'Have a conversation. Small rel boost.' },
  { id: 'compliment', label: 'COMPLIMENT', emoji: '😊', cost: '', desc: 'Flatter them. Boosts rel & trust.' },
  { id: 'give_gift', label: 'GIVE GIFT', emoji: '🎁', cost: '25g', desc: 'Spend 25g. Big rel & trust boost.' },
  { id: 'apologize', label: 'APOLOGIZE', emoji: '🙏', cost: '', desc: 'Say sorry. Minor rel boost.' },
  { id: 'ask_rumor', label: 'ASK RUMOR', emoji: '👂', cost: 'Trust≥40', desc: 'Get a market rumor. Needs trust.' },
  { id: 'bribe', label: 'BRIBE', emoji: '💰', cost: '30g', desc: 'Pay 30g. Risky rel change.' },
  { id: 'insult', label: 'INSULT', emoji: '😤', cost: '', desc: 'Damage rel. Gain fear.' },
  { id: 'threaten', label: 'THREATEN', emoji: '😠', cost: '', desc: 'Intimidate. Hurts public rep.' },
];

export default function PersonDetailScreen({ gameState: gs, personId, onUpdate, onNavigate }: Props) {
  const { showBanner } = useBanner();

  if (!personId || !gs.people[personId]) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-16 items-center justify-center">
        <p className="text-[6px] text-muted-foreground" style={PX}>PERSON NOT FOUND</p>
        <button onClick={() => onNavigate('people')} className="mt-4 text-[6px] text-primary" style={PX}>← BACK</button>
        <BottomNav current="people" onNavigate={onNavigate} />
      </div>
    );
  }

  const person = gs.people[personId];
  const race = RACES[person.raceId];
  const location = person.locationId ? LOCATIONS[person.locationId] : null;
  const raceImg = RACE_IMAGES[person.raceId];

  const relLabel = person.relationship >= 60 ? 'Beloved' :
    person.relationship >= 30 ? 'Friendly' :
    person.relationship >= 10 ? 'Neutral' :
    person.relationship >= -20 ? 'Suspicious' :
    person.relationship >= -50 ? 'Hostile' : 'Enemy';

  const relColor = person.relationship >= 30 ? 'text-primary' :
    person.relationship >= 0 ? 'text-muted-foreground' : 'text-destructive';

  const handleAction = (actionId: string) => {
    const newState = doPersonAction(gs, personId, actionId);
    onUpdate(newState);
    const action = ACTIONS.find(a => a.id === actionId);
    showBanner(`${action?.emoji} ${action?.label} done!`, 'info');
  };

  return (
    <GameLayout
      gameState={gs}
      panelExtra={
        <p className="text-[5px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
          Tap an action to interact
        </p>
      }
    >
      {/* Person header */}
      <div className="bg-card border-b border-border px-3 py-3">
        <button
          onClick={() => onNavigate('people')}
          className="text-[5px] text-muted-foreground hover:text-foreground mb-2 block"
          style={PX}
        >
          ← BACK TO PEOPLE
        </button>
        <div className="flex items-center gap-3">
          {raceImg ? (
            <img src={raceImg} alt={race.name} className="w-14 h-14 object-contain flex-shrink-0" style={{imageRendering:"pixelated"}} loading="lazy" />
          ) : (
            <span className="text-4xl">{person.emoji}</span>
          )}
          <div>
            <p className="text-[8px] font-bold text-foreground" style={PX}>{person.name}</p>
            <p className="text-[5px] text-muted-foreground ui-text">
              {race.name} · Age {person.age} · {person.role.toUpperCase()}
            </p>
            {location && <p className="text-[5px] text-muted-foreground ui-text">{location.name}</p>}
            <p className={`text-[6px] font-bold mt-1 ui-text ${relColor}`}>{relLabel}</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 space-y-3 pb-20">
        {/* Relationship meters */}
        <div className="bg-card border border-border p-3 space-y-2">
          <p className="text-[5px] text-muted-foreground mb-1" style={PX}>RELATIONSHIP</p>
          <StatBar label={`REL (${person.relationship > 0 ? '+' : ''}${person.relationship})`} value={Math.max(0, Math.min(100, ((person.relationship + 100) / 200) * 100))} color="hsl(142 60% 45%)" showValue={false} />
          <StatBar label={`TRUST ${person.trust}`} value={person.trust} color="hsl(200 70% 55%)" showValue={false} />
          <StatBar label={`FEAR ${person.fear}`} value={person.fear} color="hsl(0 70% 50%)" showValue={false} />
          <StatBar label={`RESPECT ${person.respect}`} value={person.respect} color="hsl(270 60% 60%)" showValue={false} />
        </div>

        {/* Traits + status */}
        <div className="bg-card border border-border p-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {person.traits.map(t => (
              <span key={t} className="text-[5px] px-1 bg-secondary text-secondary-foreground ui-text">{t}</span>
            ))}
          </div>
          {(person.debtToPlayer > 0 || person.playerDebtToThem > 0) && (
            <div>
              {person.debtToPlayer > 0 && <p className="text-[5px] text-primary ui-text">Owes you: {person.debtToPlayer}g</p>}
              {person.playerDebtToThem > 0 && <p className="text-[5px] text-destructive ui-text">You owe: {person.playerDebtToThem}g</p>}
            </div>
          )}
        </div>

        {/* Actions — tap to fire immediately */}
        <div>
          <p className="text-[5px] text-muted-foreground mb-2" style={PX}>ACTIONS</p>
          <div className="grid grid-cols-2 gap-1">
            {ACTIONS.map(action => (
              <button
                key={action.id}
                data-testid={`action-${action.id}`}
                onClick={() => handleAction(action.id)}
                className="bg-card border border-border p-2 text-left hover:border-primary/50 transition-all active:bg-primary/10"
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">{action.emoji}</span>
                  <span className="text-[5px] font-bold text-foreground truncate" style={PX}>{action.label}</span>
                </div>
                <p className="text-[8px] text-muted-foreground ui-text leading-tight">{action.desc}</p>
                {action.cost && (
                  <span className="text-[4px] text-accent ui-text mt-0.5 block">{action.cost}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Memories */}
        {person.memories.length > 0 && (
          <div className="bg-card border border-border p-3">
            <p className="text-[5px] text-muted-foreground mb-2" style={PX}>MEMORIES</p>
            <div className="space-y-1">
              {person.memories.slice(0, 5).map((mem, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[5px] text-muted-foreground ui-text w-12 flex-shrink-0">Age {mem.age}</span>
                  <p className="text-[9px] text-muted-foreground ui-text italic">"{mem.description}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav current="people" onNavigate={onNavigate} />
    </GameLayout>
  );
}
