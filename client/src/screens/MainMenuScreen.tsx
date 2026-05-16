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
  const { musicEnabled, toggleMusic } = useAudio();

  return (
    <div className="relative h-screen flex flex-col items-center justify-end overflow-hidden">
      {/* Full-screen pixel art background */}
      <img
        src={startScreen}
        alt="Dealer Life Simulator"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        style={{ objectPosition: 'center top' }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10" />

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Music quick-toggle */}
        <button
          data-testid="btn-music-toggle"
          onClick={toggleMusic}
          title={musicEnabled ? 'Mute music' : 'Enable music'}
          className="w-8 h-8 flex items-center justify-center border border-white/20 bg-black/40 hover:bg-black/60 transition-colors text-sm"
        >
          {musicEnabled ? '🎵' : '🔇'}
        </button>
        {/* Settings */}
        <button
          data-testid="btn-settings"
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 flex items-center justify-center border border-white/20 bg-black/40 hover:bg-black/60 transition-colors text-sm"
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm px-4 pb-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-[14px] font-bold text-accent leading-relaxed mb-1" style={PX}>
            DEALER LIFE
          </h1>
          <h1 className="text-[14px] font-bold text-primary leading-relaxed mb-3" style={PX}>
            SIMULATOR
          </h1>
          <p style={{ fontFamily: 'Courier New, monospace' }} className="text-white/50 text-xs">
            Born into a world of magic and crime.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {hasSave && (
            <button
              data-testid="btn-continue"
              onClick={onContinue}
              className="w-full py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[9px] font-bold hover:bg-primary/30 transition-colors"
              style={PX}
            >
              ▶ CONTINUE GAME
            </button>
          )}
          <button
            data-testid="btn-new-game"
            onClick={onNewGame}
            className="w-full py-3 px-4 pixel-border-accent bg-accent/20 text-accent text-[9px] font-bold hover:bg-accent/30 transition-colors"
            style={PX}
          >
            + NEW GAME
          </button>
          {hasSave && (
            <button
              data-testid="btn-delete-save"
              onClick={() => {
                if (confirm('Delete your save? This cannot be undone.')) {
                  onDeleteSave();
                }
              }}
              className="w-full py-2 px-4 pixel-border-red bg-destructive/10 text-destructive text-[7px] hover:bg-destructive/20 transition-colors"
              style={PX}
            >
              🗑 DELETE SAVE
            </button>
          )}
          {/* Settings button (bottom) */}
          <button
            onClick={() => setShowSettings(true)}
            className="w-full py-2 px-4 border border-white/10 bg-white/5 text-white/40 text-[7px] hover:bg-white/10 hover:text-white/60 transition-colors"
            style={PX}
          >
            ⚙ SETTINGS
          </button>
        </div>

        <p className="text-center text-[5px] text-white/30 mt-6" style={PX}>
          Buy low. Sell high. Don't get caught.
        </p>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
