import { useState } from 'react';
import type { GameState, Gang, GangAction } from '../game/types';
import { doGangAction } from '../game/engine';
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

const ALIGNMENT_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  neutral:  { label: 'NEUTRAL',  color: 'text-muted-foreground', bg: 'bg-secondary/50' },
  friendly: { label: 'FRIENDLY', color: 'text-primary',          bg: 'bg-primary/10' },
  allied:   { label: 'ALLIED',   color: 'text-blue-400',          bg: 'bg-blue-900/20' },
  hostile:  { label: 'HOSTILE',  color: 'text-orange-400',        bg: 'bg-orange-900/20' },
  war:      { label: '⚔ WAR',   color: 'text-destructive',       bg: 'bg-red-900/30' },
};

const TIER_LABEL: Record<number, string> = { 1: 'Street Gang', 2: 'Crew', 3: 'Syndicate', 4: 'Cartel', 5: 'Empire' };

// Actions available to interact with a gang
const GANG_ACTIONS: { id: GangAction; label: string; emoji: string; cost?: string; desc: string }[] = [
  { id: 'approach',         label: 'APPROACH',         emoji: '🤝', desc: 'Make first contact. Gain respect.' },
  { id: 'offer_deal',       label: 'DEAL',             emoji: '📜', cost: 'Respect≥25', desc: 'Propose trade/territory split.' },
  { id: 'hire_soldier',     label: 'HIRE',             emoji: '🪖', cost: 'Gold',       desc: 'Recruit a member into your crew.' },
  { id: 'expand_territory', label: 'EXPAND',           emoji: '🗺️', cost: 'Gold',       desc: 'Fund their growth, gain influence.' },
  { id: 'pay_tribute',      label: 'TRIBUTE',          emoji: '💰', cost: 'Gold',       desc: 'Pay to stay safe. Cools heat.' },
  { id: 'bribe_gang',       label: 'BRIBE',            emoji: '💸', cost: 'Gold',       desc: 'Buy their favour directly.' },
  { id: 'poach_member',     label: 'POACH',            emoji: '🕵️', cost: 'Gold',       desc: 'Steal a member from their ranks.' },
  { id: 'declare_war',      label: 'DECLARE WAR',      emoji: '⚔️', desc: 'Open hostilities. Dangerous.' },
  { id: 'assassinate_boss', label: 'ASSASSINATE',      emoji: '💀', cost: 'War/Hostile', desc: 'Kill their boss. High risk, high reward.' },
];

export default function GangsScreen({ gameState: gs, onUpdate, onNavigate }: Props) {
  const { showBanner } = useBanner();
  const { playSfx } = useAudio();
  const [selected, setSelected] = useState<string | null>(null);

  const gangList = Object.values(gs.gangs ?? {}).filter(g => g.isAlive);
  const selectedGang = selected ? gs.gangs[selected] : null;

  const totalHired = gangList.reduce((acc, g) => acc + g.playerHireCount, 0);

  const handleAction = (gangId: string, action: string) => {
    playSfx('click');
    const newState = doGangAction(gs, gangId, action);
    onUpdate(newState);
    const lastLog = newState.eventLog[0];
    showBanner(lastLog?.text ?? 'Action done.', 'info');
  };

  if (gs.player.age < 10) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-16">
        <GameLayout gameState={gs}>
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-4xl mb-4">🚫</p>
            <p className="text-[10px] text-muted-foreground mb-2" style={PX}>TOO YOUNG</p>
            <p className="text-[11px] text-muted-foreground ui-text">
              You must be at least age 10 to interact with gangs.
            </p>
          </div>
        </GameLayout>
        <BottomNav current="gangs" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <GameLayout
        gameState={gs}
        panelExtra={
          <p className="text-[9px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
            Crew hired: {totalHired} · Gangs: {gangList.length}
          </p>
        }
      >
        {/* Header */}
        <div className="bg-card border-b border-border px-3 py-3">
          <p className="text-[11px] font-bold text-accent" style={PX}>⚔ GANGS</p>
          <p className="text-[10px] text-muted-foreground ui-text mt-1">
            {gangList.length} active gangs in the realm · {totalHired} soldiers working for you
          </p>
        </div>

        {selectedGang ? (
          /* ── Gang detail panel ── */
          <div className="px-3 py-2 pb-20 space-y-3">
            <button
              onClick={() => setSelected(null)}
              className="text-[9px] text-muted-foreground hover:text-foreground"
              style={PX}
            >
              ← BACK TO GANGS
            </button>

            {/* Gang header */}
            <div className="bg-card border border-border p-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedGang.emoji}</span>
                <div>
                  <p className="text-[11px] font-bold text-foreground" style={PX}>{selectedGang.name}</p>
                  <p className="text-[10px] text-muted-foreground ui-text">
                    {TIER_LABEL[selectedGang.tier]} · {selectedGang.size} members
                  </p>
                </div>
                <span className={`ml-auto text-[9px] px-2 py-1 font-bold ${ALIGNMENT_STYLE[selectedGang.alignment].color} ${ALIGNMENT_STYLE[selectedGang.alignment].bg}`} style={PX}>
                  {ALIGNMENT_STYLE[selectedGang.alignment].label}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground ui-text mb-2">{selectedGang.description}</p>
              <div className="flex gap-1 flex-wrap">
                {selectedGang.traits.map(t => (
                  <span key={t} className="text-[9px] bg-secondary text-secondary-foreground px-1 ui-text">{t}</span>
                ))}
                <span className="text-[9px] bg-accent/20 text-accent px-1 ui-text">{selectedGang.specialty}</span>
              </div>
            </div>

            {/* Respect / Fear bars */}
            <div className="bg-card border border-border p-3 space-y-2">
              <p className="text-[9px] text-muted-foreground" style={PX}>STANDING</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground ui-text w-16 flex-shrink-0">RESPECT</span>
                  <div className="flex-1 h-2 bg-secondary border border-border">
                    <div className="h-full bg-primary transition-all" style={{ width: `${selectedGang.respect}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground ui-text w-8 text-right">{selectedGang.respect}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground ui-text w-16 flex-shrink-0">FEAR</span>
                  <div className="flex-1 h-2 bg-secondary border border-border">
                    <div className="h-full bg-destructive transition-all" style={{ width: `${selectedGang.fear}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground ui-text w-8 text-right">{selectedGang.fear}</span>
                </div>
              </div>
              {selectedGang.playerHireCount > 0 && (
                <p className="text-[10px] text-primary ui-text mt-1">
                  {selectedGang.playerHireCount} soldier{selectedGang.playerHireCount > 1 ? 's' : ''} working for you
                </p>
              )}
            </div>

            {/* Actions */}
            <div>
              <p className="text-[9px] text-muted-foreground mb-2" style={PX}>── ACTIONS ──</p>
              <div className="grid grid-cols-2 gap-1">
                {GANG_ACTIONS.map(act => {
                  // Determine if blocked
                  let reason = '';
                  if (act.id === 'offer_deal' && selectedGang.respect < 25) reason = 'Respect<25';
                  if (act.id === 'assassinate_boss' && selectedGang.alignment !== 'war' && selectedGang.alignment !== 'hostile') reason = 'War/Hostile only';
                  if (act.id === 'poach_member' && selectedGang.alignment === 'allied') reason = 'Allied — no poaching';
                  const isBlocked = !!reason;

                  return (
                    <button
                      key={act.id}
                      data-testid={`gang-action-${act.id}`}
                      onClick={() => !isBlocked && handleAction(selectedGang.id, act.id)}
                      className={`bg-card border text-left p-2 transition-all ${
                        isBlocked
                          ? 'border-border opacity-40 cursor-not-allowed'
                          : 'border-border hover:border-primary/50 active:bg-primary/10 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-sm">{act.emoji}</span>
                        <span className="text-[8px] font-bold text-foreground" style={PX}>{act.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground ui-text leading-tight">{act.desc}</p>
                      {act.cost && !reason && (
                        <span className="text-[9px] text-accent ui-text mt-0.5 block">{act.cost}</span>
                      )}
                      {reason && (
                        <span className="text-[9px] text-destructive ui-text mt-0.5 block">{reason}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── Gang list ── */
          <div className="px-3 py-2 pb-20 space-y-2">
            {gangList.length === 0 && (
              <p className="text-[10px] text-muted-foreground text-center py-8 ui-text">No gangs known yet.</p>
            )}
            {gangList.map(gang => {
              const aStyle = ALIGNMENT_STYLE[gang.alignment];
              return (
                <button
                  key={gang.id}
                  data-testid={`gang-card-${gang.id}`}
                  onClick={() => setSelected(gang.id)}
                  className="w-full bg-card border border-border p-3 text-left hover:border-primary/50 transition-colors active:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{gang.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-[10px] font-bold text-foreground truncate" style={PX}>{gang.name}</p>
                        <span className={`text-[8px] px-1 flex-shrink-0 font-bold ${aStyle.color} ${aStyle.bg}`} style={PX}>
                          {aStyle.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground ui-text">
                        {TIER_LABEL[gang.tier]} · {gang.size} members · {gang.specialty}
                      </p>
                      <div className="flex gap-1 mt-1 items-center">
                        <span className="text-[9px] text-muted-foreground ui-text">Respect:</span>
                        <div className="w-16 h-1.5 bg-secondary border border-border">
                          <div className="h-full bg-primary" style={{ width: `${gang.respect}%` }} />
                        </div>
                        <span className="text-[9px] text-muted-foreground ui-text">{gang.respect}</span>
                        {gang.playerHireCount > 0 && (
                          <span className="ml-2 text-[9px] text-primary ui-text">+{gang.playerHireCount} hired</span>
                        )}
                      </div>
                    </div>
                    <span className="text-muted-foreground text-[10px] flex-shrink-0">›</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </GameLayout>
      <BottomNav current="gangs" onNavigate={onNavigate} />
    </div>
  );
}
