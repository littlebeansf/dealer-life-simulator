import { useAudio } from '../hooks/useAudio';
import { useTheme } from '../hooks/useTheme';

const PX = { fontFamily: 'Press Start 2P, monospace' };

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const { musicEnabled, volume, toggleMusic, setVolume } = useAudio();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xs mx-4 bg-card border-2 border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
          <h2 className="text-[8px] text-accent" style={PX}>SETTINGS</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-[8px]"
            style={PX}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5">

          {/* Music toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[7px] text-foreground mb-0.5" style={PX}>MUSIC</p>
              <p className="text-[5px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>
                Ambient RPG soundtrack
              </p>
            </div>
            <button
              data-testid="btn-toggle-music"
              onClick={toggleMusic}
              className={`w-12 h-6 border-2 relative transition-colors ${
                musicEnabled ? 'border-primary bg-primary/20' : 'border-border bg-card'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 transition-all ${
                  musicEnabled ? 'left-6 bg-primary' : 'left-0.5 bg-muted-foreground'
                }`}
              />
            </button>
          </div>

          {/* Volume slider */}
          <div className={`space-y-2 transition-opacity ${musicEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <p className="text-[7px] text-foreground" style={PX}>VOLUME</p>
              <p className="text-[7px] text-muted-foreground" style={PX}>{Math.round(volume * 100)}%</p>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-full accent-primary h-1"
              data-testid="slider-volume"
            />
          </div>

          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[7px] text-foreground mb-0.5" style={PX}>THEME</p>
              <p className="text-[5px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>
                {theme === 'dark' ? 'Dark fantasy mode' : 'Parchment light mode'}
              </p>
            </div>
            <button
              data-testid="btn-toggle-theme"
              onClick={toggleTheme}
              className="text-[10px] w-10 h-10 flex items-center justify-center border-2 border-border bg-card hover:border-primary transition-colors"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <div className="border-t-2 border-border" />

          <p className="text-[5px] text-muted-foreground text-center" style={{ fontFamily: 'Courier New, monospace' }}>
            v1.0-poc · built with perplexity computer
          </p>
        </div>
      </div>
    </div>
  );
}
