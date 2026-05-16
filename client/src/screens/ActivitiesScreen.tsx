import type { GameState } from '../game/types';
import { ACTIVITIES } from '../game/data/activities';
import { doActivity } from '../game/engine';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import { useBanner } from '../hooks/useBanner';

interface Props {
  gameState: GameState;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

export default function ActivitiesScreen({ gameState: gs, onUpdate, onNavigate }: Props) {
  const { showBanner } = useBanner();

  const locationActivities = ACTIVITIES.filter(a => a.locationId === gs.currentLocationId);
  const alwaysActivities = ACTIVITIES.filter(a => !a.locationId);
  const displayList = [...locationActivities, ...alwaysActivities];

  const handleDo = (activityId: string) => {
    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (!activity) return;
    if (activity.requiresStat) {
      const { stat, min } = activity.requiresStat;
      if ((gs.player.stats[stat] ?? 0) < min) {
        showBanner(`Need ${stat} ≥ ${min} to do this.`, 'error');
        return;
      }
    }
    if (activity.requiresMinAge && gs.player.age < activity.requiresMinAge) {
      showBanner(`Must be at least age ${activity.requiresMinAge}.`, 'error');
      return;
    }
    const newState = doActivity(gs, activity);
    onUpdate(newState);
    showBanner(`${activity.name} — done!`, 'success');
  };

  const getUsageInfo = (activityId: string) => {
    const count = gs.player.activityCounts[activityId] ?? 0;
    const activity = ACTIVITIES.find(a => a.id === activityId)!;
    const diminished = count >= 2;
    return { count, diminished };
  };

  return (
    <GameLayout
      gameState={gs}
      panelExtra={
        <p className="text-[5px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
          Tap an activity to do it instantly
        </p>
      }
    >
      <div className="px-3 py-2 pb-20 space-y-1">
        {locationActivities.length > 0 && (
          <p className="text-[5px] text-accent mb-1" style={PX}>── LOCAL ──</p>
        )}

        {displayList.map(activity => {
          const { count, diminished } = getUsageInfo(activity.id);
          const isLocal = activity.locationId === gs.currentLocationId;
          const isOtherLocation = activity.locationId && activity.locationId !== gs.currentLocationId;
          const statFail = activity.requiresStat && (gs.player.stats[activity.requiresStat.stat] ?? 0) < activity.requiresStat.min;
          const ageFail = activity.requiresMinAge && gs.player.age < activity.requiresMinAge;
          const blocked = isOtherLocation || statFail || ageFail;

          // Add separator before "always" activities section
          const isFirstAlways = !activity.locationId && displayList.indexOf(activity) === locationActivities.length;

          return (
            <div key={activity.id}>
              {isFirstAlways && locationActivities.length > 0 && (
                <p className="text-[5px] text-muted-foreground my-1" style={PX}>── UNIVERSAL ──</p>
              )}
              <button
                data-testid={`activity-${activity.id}`}
                onClick={() => !blocked && handleDo(activity.id)}
                disabled={!!blocked}
                className={`w-full bg-card border text-left transition-all px-3 py-2 ${
                  isLocal ? 'border-accent/40' : 'border-border'
                } ${
                  blocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 active:bg-primary/10 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0 leading-none mt-0.5">{activity.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[6px] font-bold text-foreground" style={PX}>{activity.name.toUpperCase()}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isLocal && <span className="text-[4px] text-accent bg-accent/20 px-1 py-0.5 ui-text">LOCAL</span>}
                        {isOtherLocation && <span className="text-[4px] text-muted-foreground bg-secondary px-1 py-0.5 ui-text">ELSEWHERE</span>}
                        {diminished && count > 0 && <span className="text-[4px] text-orange-400 bg-orange-900/20 px-1 py-0.5 ui-text">DIMINISHED</span>}
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
                          <span key={i} className={`text-[5px] ui-text px-1 bg-secondary ${color}`}>{label}</span>
                        );
                      })}
                    </div>

                    {(statFail || ageFail) && (
                      <p className="text-[5px] text-destructive ui-text mt-1">
                        {statFail ? `Need ${activity.requiresStat?.stat} ≥ ${activity.requiresStat?.min}` : ''}
                        {ageFail ? ` Age ≥ ${activity.requiresMinAge}` : ''}
                      </p>
                    )}
                    {isOtherLocation && (
                      <p className="text-[5px] text-muted-foreground ui-text mt-1">
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
