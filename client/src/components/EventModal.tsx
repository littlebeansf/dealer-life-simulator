import { useState } from 'react';
import type { GameState, EventChoice, EventOutcome } from '../game/types';
import { applyEffects, pickOutcome, resolveOutcome } from '../game/engine';

interface Props {
  gameState: GameState;
  onResolve: (newState: GameState) => void;
}

export default function EventModal({ gameState, onResolve }: Props) {
  const { pendingEvent } = gameState;
  if (!pendingEvent) return null;

  const { event } = pendingEvent;
  const [resolved, setResolved] = useState<string | null>(null);
  const [outcomeText, setOutcomeText] = useState<string | null>(null);

  const handleChoice = (choice: EventChoice) => {
    if (resolved) return;
    const outcome = pickOutcome(choice.outcomes);
    const newState = resolveOutcome(gameState, outcome);
    setResolved(choice.id);
    setOutcomeText(outcome.description);
    setTimeout(() => {
      onResolve(newState);
    }, 1800);
  };

  const canUseChoice = (choice: EventChoice): boolean => {
    if (!choice.requiresStat) return true;
    const { stat, min } = choice.requiresStat;
    const val =
      stat === 'health' ? gameState.player.health
      : stat === 'stamina' ? gameState.player.stamina
      : stat === 'money' ? gameState.player.money
      : stat === 'heat' ? gameState.player.heat
      : gameState.player.stats[stat] ?? 0;
    return val >= (min ?? 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-sm bg-card pixel-border border-accent/60 rounded-none fade-in">
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center gap-2">
          <span className="text-2xl">{event.emoji}</span>
          <h3 className="text-[9px] font-bold text-accent leading-tight" style={{ fontFamily: 'Press Start 2P, monospace' }}>
            {event.title}
          </h3>
        </div>

        {/* Description */}
        <div className="p-3 border-b border-border">
          <p className="ui-text text-foreground/90 leading-relaxed text-xs">
            {event.description}
          </p>
        </div>

        {/* Outcome display */}
        {outcomeText && (
          <div className="p-3 border-b border-border bg-primary/10">
            <p className="ui-text text-primary text-xs leading-relaxed">→ {outcomeText}</p>
          </div>
        )}

        {/* Choices */}
        {!resolved && (
          <div className="p-3 space-y-2">
            {event.choices.map(choice => {
              const usable = canUseChoice(choice);
              return (
                <button
                  key={choice.id}
                  data-testid={`choice-${choice.id}`}
                  onClick={() => usable && handleChoice(choice)}
                  disabled={!usable}
                  className={`w-full text-left p-2 pixel-border text-xs ui-text transition-colors ${
                    usable
                      ? 'border-border hover:border-primary hover:bg-primary/10 text-foreground cursor-pointer'
                      : 'border-border/30 text-muted-foreground cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="text-accent mr-2">▶</span>
                  {choice.label}
                  {choice.requiresStat && (
                    <span className="text-[9px] text-muted-foreground ml-2">
                      [{choice.requiresStat.stat} ≥ {choice.requiresStat.min}]
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {resolved && !outcomeText && (
          <div className="p-3">
            <p className="ui-text text-muted-foreground text-xs">Resolving...</p>
          </div>
        )}
      </div>
    </div>
  );
}
