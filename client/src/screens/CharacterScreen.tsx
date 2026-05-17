import type { GameState } from '../game/types';
import { RACES } from '../game/data/races';
import { LOCATIONS } from '../game/data/locations';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import StatBar from '../components/StatBar';

interface Props {
  gameState: GameState;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

export default function CharacterScreen({ gameState: gs, onNavigate }: Props) {
  const { player } = gs;
  const race = RACES[player.raceId];
  const location = LOCATIONS[gs.currentLocationId];
  const father = gs.people[player.fatherId];
  const mother = gs.people[player.motherId];

  const heatLabel = player.heat < 20 ? 'COLD' : player.heat < 40 ? 'WARM' : player.heat < 60 ? 'HOT' : player.heat < 80 ? 'BURNING' : 'INFAMOUS';
  const heatColor = player.heat < 20 ? 'text-primary' : player.heat < 50 ? 'text-accent' : 'text-destructive';

  return (
    <GameLayout gameState={gs}>
      <div className="px-3 py-2 space-y-3 pb-20">
        {/* Gold & Year */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: 'GOLD', value: `${player.money}g`, color: 'text-accent' },
            { label: 'YEAR', value: String(gs.currentYear), color: 'text-foreground' },
            { label: 'CARRY', value: `${gs.inventory.capacityUsed}/${gs.inventory.capacityMax}`, color: 'text-primary' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-card border border-border p-2 text-center">
              <p className="text-[9px] text-muted-foreground mb-1" style={PX}>{label}</p>
              <p className={`text-[10px] font-bold ${color}`} style={PX}>{value}</p>
            </div>
          ))}
        </div>

        {/* Vitals */}
        <div className="bg-card border border-border p-3 space-y-2">
          <p className="text-[9px] text-muted-foreground mb-1" style={PX}>VITALS</p>
          <StatBar label="HEALTH" value={player.health} color="hsl(142 60% 45%)" showValue />
          <StatBar label="STAMINA" value={player.stamina} color="hsl(200 70% 55%)" showValue />
        </div>

        {/* Stats */}
        <div className="bg-card border border-border p-3 space-y-2">
          <p className="text-[9px] text-muted-foreground mb-1" style={PX}>STATS</p>
          <StatBar label="STR" value={player.stats.strength} max={100} color="hsl(38 80% 50%)" showValue />
          <StatBar label="INT" value={player.stats.intelligence} max={100} color="hsl(200 70% 55%)" showValue />
          <StatBar label="CHA" value={player.stats.charisma} max={100} color="hsl(270 60% 60%)" showValue />
          <StatBar label="LCK" value={player.stats.luck} max={100} color="hsl(60 80% 60%)" showValue />
        </div>

        {/* Reputation */}
        <div className="bg-card border border-border p-3 space-y-1">
          <p className="text-[9px] text-muted-foreground mb-1" style={PX}>REPUTATION</p>
          {[
            { label: 'PUBLIC', value: `${player.reputation.publicLabel} (${player.reputation.public > 0 ? '+' : ''}${player.reputation.public})`, color: 'text-foreground' },
            { label: 'UNDERWORLD', value: player.reputation.underworldRank, color: 'text-purple-400' },
            { label: 'FEAR', value: `${player.reputation.fear}/100`, color: 'text-destructive' },
            { label: 'HEAT', value: `${heatLabel} (${player.heat}/100)`, color: heatColor },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center">
              <span className="text-[9px] text-muted-foreground ui-text">{r.label}</span>
              <span className={`text-[9px] ui-text font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* Race Info */}
        <div className="bg-card border border-border p-3">
          <p className="text-[9px] text-muted-foreground mb-1" style={PX}>RACE: {race.name.toUpperCase()}</p>
          <p className="text-[9px] text-foreground ui-text mb-1">{race.description}</p>
          <p className="text-[9px] text-muted-foreground ui-text italic">{race.flavor}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {race.tags.map(tag => (
              <span key={tag} className="text-[9px] px-1 bg-secondary text-secondary-foreground ui-text">{tag}</span>
            ))}
          </div>
        </div>

        {/* Heritage */}
        {(father || mother) && (
          <div className="bg-card border border-border p-3">
            <p className="text-[9px] text-muted-foreground mb-1" style={PX}>HERITAGE</p>
            <div className="space-y-1">
              {father && (
                <p className="text-[9px] text-foreground ui-text">Father: {father.name} ({RACES[father.raceId].name})</p>
              )}
              {mother && (
                <p className="text-[9px] text-foreground ui-text">Mother: {mother.name} ({RACES[mother.raceId].name})</p>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav current="character" onNavigate={onNavigate} />
    </GameLayout>
  );
}
