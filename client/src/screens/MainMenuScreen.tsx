import { useState } from 'react';
import { startScreen } from '../assets/pixel';
import { useAudio } from '../hooks/useAudio';
import SettingsModal from '../components/SettingsModal';

interface Props {
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
  onDeleteSave: () => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

export default function MainMenuScreen({ hasSave, onNewGame, onContinue, onDeleteSave }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const { musicEnabled, toggleMusic, playSfx } = useAudio();

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* Full-screen pixel art background */}
      <img
        src={startScreen}
        alt="Dealer Life Simulator"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 30%' }}
        loading="eager"
      />
      {/* Strong bottom gradient so menu is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/55 to-transparent" />
      {/* Slight top vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" style={{ height: '35%' }} />

      {/* Top-right controls (small, unobtrusive) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          data-testid="btn-music-toggle"
          onClick={toggleMusic}
          title={musicEnabled ? 'Mute music' : 'Enable music'}
          className="w-9 h-9 flex items-center justify-center border border-white/25 bg-black/50 hover:bg-black/70 transition-colors text-base"
        >
          {musicEnabled ? '🎵' : '🔇'}
        </button>
        <button
          data-testid="btn-settings"
          onClick={() => { playSfx('click'); setShowSettings(true); }}
          className="w-9 h-9 flex items-center justify-center border border-white/25 bg-black/50 hover:bg-black/70 transition-colors text-base"
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* ── Content anchored at bottom ─────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 pb-10">
        {/* Title block — centered */}
        <div className="text-center mb-10">
          <h1 className="text-[22px] font-bold text-primary leading-tight drop-shadow-lg" style={PX}>
            DEALER LIFE
          </h1>
          <h1 className="text-[22px] font-bold text-accent leading-tight drop-shadow-lg mb-3" style={PX}>
            SIMULATOR
          </h1>
          <p
            style={{ fontFamily: 'Courier New, monospace', fontSize: '13px' }}
            className="text-white/55"
          >
            Buy low. Sell high. Don't get caught.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 max-w-sm mx-auto w-full">
          {hasSave && (
            <button
              data-testid="btn-continue"
              onClick={() => { playSfx('click'); onContinue(); }}
              className="w-full py-4 px-4 pixel-border-green bg-primary/25 text-primary text-[11px] font-bold hover:bg-primary/40 active:bg-primary/50 transition-colors"
              style={PX}
            >
              ▶ CONTINUE GAME
            </button>
          )}
          <button
            data-testid="btn-new-game"
            onClick={() => { playSfx('click'); onNewGame(); }}
            className="w-full py-4 px-4 pixel-border-accent bg-accent/20 text-accent text-[11px] font-bold hover:bg-accent/35 active:bg-accent/45 transition-colors"
            style={PX}
          >
            + NEW GAME
          </button>
          {hasSave && (
            <button
              data-testid="btn-delete-save"
              onClick={() => {
                if (confirm('Delete your save? This cannot be undone.')) {
                  playSfx('error');
                  onDeleteSave();
                }
              }}
              className="w-full py-3 px-4 pixel-border-red bg-destructive/10 text-destructive text-[9px] hover:bg-destructive/20 transition-colors"
              style={PX}
            >
              🗑 DELETE SAVE
            </button>
          )}
          <button
            onClick={() => { playSfx('click'); setShowSettings(true); }}
            className="w-full py-3 px-4 border border-white/15 bg-white/5 text-white/45 text-[9px] hover:bg-white/10 hover:text-white/65 transition-colors"
            style={PX}
          >
            ⚙ SETTINGS
          </button>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
