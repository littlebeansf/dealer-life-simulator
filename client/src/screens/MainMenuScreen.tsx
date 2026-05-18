import { useState } from 'react';
import { startScreen } from '../assets/pixel';
import { useAudio } from '../hooks/useAudio';
import SettingsModal from '../components/SettingsModal';
import type { GameState } from '../game/types';

interface SaveSlot { slot: number; exists: boolean; data: GameState | null; }

interface Props {
  saves: SaveSlot[];
  onNewGame: (slot: number) => void;
  onLoad: (slot: number) => void;
  onDeleteSave: (slot: number) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };
const UI = { fontFamily: 'Courier New, monospace' };

function slotLabel(idx: number) {
  return ['SLOT I', 'SLOT II', 'SLOT III'][idx] ?? `SLOT ${idx + 1}`;
}

function savePreview(data: GameState | null) {
  if (!data) return null;
  return {
    name: data.player.name,
    age: data.player.age,
    year: data.currentYear,
    location: data.player.locationId,
    money: data.player.money,
    race: data.player.raceId,
  };
}

export default function MainMenuScreen({ saves, onNewGame, onLoad, onDeleteSave }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDeleteSlot, setConfirmDeleteSlot] = useState<number | null>(null);
  const { musicEnabled, toggleMusic, playSfx } = useAudio();

  const anySave = saves.some(s => s.exists);

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <img
        src={startScreen}
        alt="Dealer Life Simulator"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 30%' }}
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" style={{ height: '35%' }} />

      {/* Top controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button onClick={toggleMusic} title={musicEnabled ? 'Mute music' : 'Enable music'}
          className="w-9 h-9 flex items-center justify-center border border-white/25 bg-black/50 hover:bg-black/70 transition-colors text-base">
          {musicEnabled ? '🎵' : '🔇'}
        </button>
        <button onClick={() => { playSfx('click'); setShowSettings(true); }}
          className="w-9 h-9 flex items-center justify-center border border-white/25 bg-black/50 hover:bg-black/70 transition-colors text-base" title="Settings">
          ⚙️
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 pb-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-[22px] font-bold text-primary leading-tight drop-shadow-lg" style={PX}>DEALER LIFE</h1>
          <h1 className="text-[22px] font-bold text-accent leading-tight drop-shadow-lg mb-2" style={PX}>SIMULATOR</h1>
          <p style={{ ...UI, fontSize: '12px' }} className="text-white/50">Buy low. Sell high. Don't get caught.</p>
        </div>

        {/* Save slots */}
        <div className="space-y-2 max-w-sm mx-auto w-full mb-4">
          {saves.map((s) => {
            const preview = savePreview(s.data);
            return (
              <div key={s.slot}
                className={`border transition-all ${s.exists ? 'border-primary/40 bg-primary/10' : 'border-white/15 bg-white/5'}`}
              >
                {s.exists && preview ? (
                  <div className="flex items-center">
                    {/* Load button */}
                    <button
                      data-testid={`btn-load-slot-${s.slot}`}
                      onClick={() => { playSfx('click'); onLoad(s.slot); }}
                      className="flex-1 text-left px-3 py-2.5 hover:bg-primary/15 active:bg-primary/25 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[7px] text-primary" style={PX}>{slotLabel(s.slot)}</span>
                        <span className="text-[8px] text-primary font-bold" style={PX}>▶ LOAD</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-[9px] text-white font-bold" style={UI}>{preview.name}</p>
                          <p className="text-[9px] text-white/55" style={UI}>
                            Age {preview.age} · Year {preview.year} · {preview.money}g
                          </p>
                        </div>
                      </div>
                    </button>
                    {/* Delete */}
                    {confirmDeleteSlot === s.slot ? (
                      <div className="flex flex-col gap-1 px-2 py-1 border-l border-white/10">
                        <button onClick={() => { playSfx('error'); onDeleteSave(s.slot); setConfirmDeleteSlot(null); }}
                          className="text-[7px] text-destructive px-2 py-1 border border-destructive/40 hover:bg-destructive/20 transition-colors" style={PX}>
                          CONFIRM
                        </button>
                        <button onClick={() => setConfirmDeleteSlot(null)}
                          className="text-[7px] text-white/40 px-2 py-1 border border-white/10 hover:bg-white/10 transition-colors" style={PX}>
                          CANCEL
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteSlot(s.slot)}
                        className="px-3 py-2 border-l border-white/10 text-white/30 hover:text-destructive hover:bg-destructive/10 transition-colors text-sm"
                        title="Delete save">
                        🗑
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    data-testid={`btn-new-slot-${s.slot}`}
                    onClick={() => { playSfx('click'); onNewGame(s.slot); }}
                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-white/10 active:bg-white/15 transition-colors"
                  >
                    <span className="text-[7px] text-white/40" style={PX}>{slotLabel(s.slot)}</span>
                    <span className="text-[8px] text-accent font-bold" style={PX}>+ NEW GAME</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Settings link */}
        <div className="max-w-sm mx-auto w-full">
          <button onClick={() => { playSfx('click'); setShowSettings(true); }}
            className="w-full py-2 border border-white/10 bg-white/5 text-white/35 text-[8px] hover:bg-white/10 hover:text-white/55 transition-colors"
            style={PX}>
            ⚙ SETTINGS
          </button>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
