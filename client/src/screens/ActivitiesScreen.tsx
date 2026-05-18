import { useState, useCallback } from 'react';
import type { GameState } from '../game/types';
import { ACTIVITIES } from '../game/data/activities';
import { doActivity } from '../game/engine';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import { useBanner } from '../hooks/useBanner';
import { useAudio } from '../hooks/useAudio';

interface Props {
  gameState: GameState;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

export default function ActivitiesScreen({ gameState: gs, onUpdate, onNavigate }: Props) {
  const { showBanner } = useBanner();
  const { playSfx } = useAudio();
  const [shakingId, setShakingId] = useState<string | null>(null);

  const triggerShake = useCallback((id: string) => {
    setShakingId(id);
    setTimeout(() => setShakingId(null), 400);
  }, []);

  const locationActivities = ACTIVITIES.filter(a => a.locationId === gs.currentLocationId);
  const alwaysActivities = ACTIVITIES.filter(a => !a.locationId);
  const displayList = [...locationActivities, ...alwaysActivities];

  const handleDo = (activityId: string) => {
    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (!activity) return;
    if (activity.requiresStat) {
      const { stat, min } = activity.requiresStat;
      if ((gs.player.stats[stat] ?? 0) < min) {
        triggerShake(activityId); playSfx('error');
        showBanner(`Need ${stat} ≥ ${min} to do this.`, 'error');
        return;
      }
    }
    if (activity.requiresMinAge && gs.player.age < activity.requiresMinAge) {
      triggerShake(activityId); playSfx('error');
      showBanner(`Must be at least age ${activity.requiresMinAge}.`, 'error');
      return;
    }
    // Enforce cooldownPerYear limit
    const count = gs.player.activityCounts[activityId] ?? 0;
    if (activity.cooldownPerYear > 0 && count >= activity.cooldownPerYear) {
      triggerShake(activityId); playSfx('error');
      showBanner(`${activity.name} — max uses this year reached!`, 'warning');
      return;
    }
    const newState = doActivity(gs, activity);
    onUpdate(newState);
    playSfx('coin'); showBanner(`${activity.name} — done!`, 'success');
  };

  const getUsageInfo = (activityId: string) => {
    const count = gs.player.activityCounts[activityId] ?? 0;
    const activity = ACTIVITIES.find(a => a.id === activityId)!;
    const diminished = count >= 2;
    const maxUses = activity.cooldownPerYear;
    const exhausted = maxUses > 0 && count >= maxUses;
    const remaining = maxUses > 0 ? Math.max(0, maxUses - count) : null;
    return { count, diminished, exhausted, remaining, maxUses };
  };

  return (
    <GameLayout
      gameState={gs}
      panelExtra={
        <p className="text-[9px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
          Tap an activity to do it instantly
        </p>
      }
    >
      <div className="px-3 py-2 pb-20 space-y-1">
        {locationActivities.length > 0 && (
          <p className="text-[9px] text-accent mb-1" style={PX}>── LOCAL ──</p>
        )}

        {displayList.map(activity => {
          const { count, diminished, exhausted, remaining, maxUses } = getUsageInfo(activity.id);
          const isLocal = activity.locationId === gs.currentLocationId;
          const isOtherLocation = activity.locationId && activity.locationId !== gs.currentLocationId;
          const statFail = activity.requiresStat && (gs.player.stats[activity.requiresStat.stat] ?? 0) < activity.requiresStat.min;
          const ageFail = activity.requiresMinAge && gs.player.age < activity.requiresMinAge;
          const blocked = isOtherLocation || statFail || ageFail || exhausted;

          // Add separator before "always" activities section
          const isFirstAlways = !activity.locationId && displayList.indexOf(activity) === locationActivities.length;

          return (
            <div key={activity.id}>
              {isFirstAlways && locationActivities.length > 0 && (
                <p className="text-[9px] text-muted-foreground my-1" style={PX}>── UNIVERSAL ──</p>
              )}
              <button
                data-testid={`activity-${activity.id}`}
                onClick={() => handleDo(activity.id)}
                className={`w-full bg-card border text-left transition-all px-3 py-2 ${
                  ageFail
                    ? 'border-yellow-600/50 opacity-70 cursor-not-allowed'
                    : isLocal ? 'border-accent/40' : 'border-border'
                } ${
                  blocked ? (ageFail ? '' : 'opacity-50 cursor-not-allowed') : 'hover:border-primary/50 active:bg-primary/10 cursor-pointer'
                } ${
                  shakingId === activity.id ? 'action-blocked-shake' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0 leading-none mt-0.5">{activity.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[9px] font-bold text-foreground" style={PX}>{activity.name.toUpperCase()}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isLocal && <span className="text-[11px] text-accent bg-accent/20 px-1 py-0.5 ui-text">LOCAL</span>}
                        {isOtherLocation && <span className="text-[11px] text-muted-foreground bg-secondary px-1 py-0.5 ui-text">ELSEWHERE</span>}
                        {exhausted && <span className="text-[11px] text-destructive bg-red-900/20 px-1 py-0.5 ui-text">MAX USED</span>}
                        {ageFail && !exhausted && (
                          <span className="text-[9px] font-bold text-yellow-400 bg-yellow-900/40 border border-yellow-600/50 px-1 py-0.5 flex-shrink-0" style={PX}>
                            🔒 Age≥{activity.requiresMinAge}
                          </span>
                        )}
                        {!exhausted && !ageFail && diminished && count > 0 && <span className="text-[11px] text-orange-400 bg-orange-900/20 px-1 py-0.5 ui-text">DIM</span>}
                        {!exhausted && !ageFail && remaining !== null && <span className="text-[11px] text-muted-foreground bg-secondary px-1 py-0.5 ui-text">{remaining}/{maxUses}</span>}
                      </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground ui-text mt-0.5">{activity.description}</p>

                    {/* Effects */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activity.effects.filter(e => e.type !== 'log').map((e, i) => {
                        let label = '';
                        let color = 'text-primary';
                        if (e.type === 'stat') { label = `${e.stat?.slice(0,3).toUpperCase()} +${diminished ? '~' : ''}${e.value}`; color = 'text-blue-400'; }
                        else if (e.type === 'health') { label = `HP ${e.value! >= 0 ? '+' : ''}${e.value}`; color = e.value! >= 0 ? 'text-primary' : 'text-destructive'; }
                        else if (e.type === 'stamina') { label = `STA ${e.value! >= 0 ? '+' : ''}${e.value}`; color = e.value! >= 0 ? 'text-blue-400' : 'text-orange-400'; }
                        else if (e.type === 'money') { label = `${e.value! >= 0 ? '+' : ''}${e.value}g`; color = 'text-accent'; }
                        else if (e.type === 'heat') { label = `HEAT ${e.value! >= 0 ? '+' : ''}${e.value}`; color = e.value! >= 0 ? 'text-destructive' : 'text-primary'; }
                        else if (e.type === 'reputation_underworld') { label = `UW ${e.value! >= 0 ? '+' : ''}${e.value}`; color = 'text-purple-400'; }
                        else if (e.type === 'reputation_public') { label = `REP ${e.value! >= 0 ? '+' : ''}${e.value}`; color = e.value! >= 0 ? 'text-primary' : 'text-destructive'; }
                        if (!label) return null;
                        return (
                          <span key={i} className={`text-[9px] ui-text px-1 bg-secondary ${color}`}>{label}</span>
                        );
                      })}
                    </div>

                    {(statFail || exhausted) && (
                      <p className="text-[9px] text-destructive ui-text mt-1">
                        {exhausted ? `Yearly limit reached. Advance year to reset.` : ''}
                        {!exhausted && statFail ? `Need ${activity.requiresStat?.stat} ≥ ${activity.requiresStat?.min}` : ''}
                      </p>
                    )}
                    {isOtherLocation && (
                      <p className="text-[9px] text-muted-foreground ui-text mt-1">
                        Available at: {activity.locationId?.replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <BottomNav current="activities" onNavigate={onNavigate} />
    </GameLayout>
  );
}
