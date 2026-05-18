import { useAudio } from '../hooks/useAudio';
import { useTheme } from '../hooks/useTheme';
import { useFontSize } from '../hooks/useFontSize';

const PX = { fontFamily: 'Press Start 2P, monospace' };

interface Props {
  onClose: () => void;
  onMainMenu?: () => void;
}

export default function SettingsModal({ onClose, onMainMenu }: Props) {
  const { musicEnabled, volume, toggleMusic, setVolume } = useAudio();
  const { theme, toggle: toggleTheme } = useTheme();
  const { level, increase, decrease, canIncrease, canDecrease } = useFontSize();

  const SIZE_LABELS: Record<number, string> = { 1: 'XS', 2: 'SM', 3: 'MD', 4: 'LG', 5: 'XL' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xs mx-4 bg-card border-2 border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
          <h2 className="text-[11px] text-accent" style={PX}>SETTINGS</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-[11px]"
            style={PX}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5">

          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[11px] text-foreground mb-0.5" style={PX}>TEXT SIZE</p>
                <p className="text-[9px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>
                  Adjust in-game font size
                </p>
              </div>
              <span className="text-[10px] text-accent" style={PX}>{SIZE_LABELS[level]}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                data-testid="btn-font-decrease"
                onClick={decrease}
                disabled={!canDecrease}
                className={`flex-1 py-2 border-2 text-[10px] font-bold transition-colors ${
                  canDecrease
                    ? 'border-border text-foreground hover:border-primary active:bg-primary/10'
                    : 'border-border/30 text-muted-foreground/40 cursor-not-allowed'
                }`}
                style={PX}
              >
                A−
              </button>
              {/* Size dots */}
              <div className="flex gap-1 justify-center flex-1">
                {[1, 2, 3, 4, 5].map(l => (
                  <div
                    key={l}
                    className={`w-2 h-2 border ${l === level ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                  />
                ))}
              </div>
              <button
                data-testid="btn-font-increase"
                onClick={increase}
                disabled={!canIncrease}
                className={`flex-1 py-2 border-2 text-[12px] font-bold transition-colors ${
                  canIncrease
                    ? 'border-border text-foreground hover:border-primary active:bg-primary/10'
                    : 'border-border/30 text-muted-foreground/40 cursor-not-allowed'
                }`}
                style={PX}
              >
                A+
              </button>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Music toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-foreground mb-0.5" style={PX}>MUSIC</p>
              <p className="text-[9px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>
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
              <p className="text-[11px] text-foreground" style={PX}>VOLUME</p>
              <p className="text-[11px] text-muted-foreground" style={PX}>{Math.round(volume * 100)}%</p>
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

          <div className="border-t border-border" />

          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-foreground mb-0.5" style={PX}>THEME</p>
              <p className="text-[9px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>
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

          {/* Exit to Main Menu */}
          {onMainMenu && (
            <button
              data-testid="btn-main-menu"
              onClick={() => { onClose(); onMainMenu(); }}
              className="w-full py-3 border border-destructive/30 bg-destructive/10 text-destructive text-[9px] hover:bg-destructive/20 transition-colors"
              style={PX}
            >
              ⬅ MAIN MENU
            </button>
          )}

          <p className="text-[9px] text-muted-foreground text-center" style={{ fontFamily: 'Courier New, monospace' }}>
            v1.1-poc · built with perplexity computer
          </p>
        </div>
      </div>
    </div>
  );
}
