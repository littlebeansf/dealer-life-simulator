import { useState } from 'react';
import type { GameState, PersonRole } from '../game/types';
import { RACES } from '../game/data/races';
import { RACE_IMAGES } from '../assets/pixel';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';

interface Props {
  gameState: GameState;
  onNavigate: (s: GameState['screen']) => void;
  onSelectPerson: (id: string) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

const ROLE_COLORS: Record<PersonRole, string> = {
  family: 'text-yellow-400',
  merchant: 'text-accent',
  dealer: 'text-primary',
  rival: 'text-destructive',
  friend: 'text-primary',
  lover: 'text-pink-400',
  enemy: 'text-destructive',
  contact: 'text-blue-400',
  informant: 'text-purple-400',
};

const REL_BAR_COLOR = (val: number) => {
  if (val >= 60) return 'hsl(142 60% 45%)';
  if (val >= 20) return 'hsl(38 80% 50%)';
  if (val >= -20) return 'hsl(220 15% 55%)';
  return 'hsl(0 70% 50%)';
};

const ROLE_GROUPS: { label: string; roles: PersonRole[] }[] = [
  { label: 'FAMILY', roles: ['family'] },
  { label: 'CRIME', roles: ['merchant', 'dealer', 'contact', 'informant'] },
  { label: 'SOCIAL', roles: ['friend', 'lover'] },
  { label: 'ENEMIES', roles: ['rival', 'enemy'] },
];

export default function PeopleScreen({ gameState: gs, onNavigate, onSelectPerson }: Props) {
  const [filter, setFilter] = useState<'all' | PersonRole>('all');

  const allPeople = Object.values(gs.people).filter(p => p.isAlive);
  const filtered = filter === 'all' ? allPeople : allPeople.filter(p => p.role === filter);
  const sorted = [...filtered].sort((a, b) => b.relationship - a.relationship);

  return (
    <GameLayout
      gameState={gs}
      panelExtra={
        <p className="text-[9px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
          {allPeople.length} contacts · Tap to interact
        </p>
      }
    >
      {/* Filter chips */}
      <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-0.5 text-[9px] border flex-shrink-0 transition-colors ${filter === 'all' ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
          style={PX}
        >ALL</button>
        {ROLE_GROUPS.map(g => (
          <button
            key={g.label}
            onClick={() => setFilter(g.roles[0] as PersonRole)}
            className={`px-2 py-0.5 text-[9px] border flex-shrink-0 transition-colors ${
              g.roles.includes(filter as PersonRole) ? 'border-accent bg-accent/20 text-accent' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
            style={PX}
          >{g.label}</button>
        ))}
      </div>

      <div className="px-3 py-2 space-y-1 pb-20">
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">👻</p>
            <p className="text-[9px] text-muted-foreground" style={PX}>NO ONE HERE</p>
          </div>
        ) : (
          sorted.map(person => {
            const race = RACES[person.raceId];
            const relColor = REL_BAR_COLOR(person.relationship);
            const roleColor = ROLE_COLORS[person.role] ?? 'text-foreground';
            const raceImg = RACE_IMAGES[person.raceId];

            return (
              <button
                key={person.id}
                data-testid={`person-card-${person.id}`}
                className="w-full bg-card border border-border p-2 text-left hover:border-primary/50 transition-all active:bg-primary/10"
                onClick={() => onSelectPerson(person.id)}
              >
                <div className="flex items-center gap-2">
                  {raceImg ? (
                    <img src={raceImg} alt={race.name} className="w-10 h-10 object-contain flex-shrink-0" style={{imageRendering:"pixelated"}} loading="lazy" />
                  ) : (
                    <span className="text-2xl flex-shrink-0">{person.emoji}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-[9px] font-bold text-foreground" style={PX}>{person.name}</p>
                      <span className={`text-[9px] ${roleColor} ui-text uppercase flex-shrink-0 ml-2`}>{person.role}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground ui-text">
                      {race.name} · Age {person.age}{person.locationId ? ` · ${person.locationId.replace(/_/g, ' ')}` : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 stat-bar">
                        <div
                          className="stat-bar-fill"
                          style={{
                            width: `${Math.max(0, Math.min(100, ((person.relationship + 100) / 200) * 100))}%`,
                            background: relColor,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground ui-text w-8 text-right">
                        {person.relationship > 0 ? '+' : ''}{person.relationship}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <BottomNav current="people" onNavigate={onNavigate} />
    </GameLayout>
  );
}
