import type { GameState } from '../game/types';
import { useTheme } from '../hooks/useTheme';

interface Props {
  current: GameState['screen'];
  onNavigate: (s: GameState['screen']) => void;
}

const NAV_ITEMS: { id: GameState['screen']; label: string; emoji: string }[] = [
  { id: 'main', label: 'Home', emoji: '🏠' },
  { id: 'character', label: 'Me', emoji: '👤' },
  { id: 'inventory', label: 'Bag', emoji: '🎒' },
  { id: 'market', label: 'Mkt', emoji: '🏪' },
  { id: 'map', label: 'Map', emoji: '🗺️' },
  { id: 'activities', label: 'Do', emoji: '⚡' },
  { id: 'people', label: 'Ppl', emoji: '👥' },
];

export default function BottomNav({ current, onNavigate }: Props) {
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card border-t-2 border-border z-40">
      <div className="flex">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            data-testid={`nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center py-2 px-0.5 transition-colors text-center ${
              current === item.id
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <span className="text-sm leading-none mb-0.5">{item.emoji}</span>
            <span className="text-[5px] leading-none font-bold uppercase tracking-wide" style={{ fontFamily: 'Press Start 2P, monospace' }}>
              {item.label}
            </span>
          </button>
        ))}
        {/* Theme toggle */}
        <button
          data-testid="btn-theme-toggle-nav"
          onClick={toggle}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          className="flex flex-col items-center py-2 px-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          style={{ minWidth: '36px' }}
        >
          <span className="text-sm leading-none mb-0.5">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span className="text-[4px] leading-none font-bold uppercase tracking-wide" style={{ fontFamily: 'Press Start 2P, monospace' }}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>
    </nav>
  );
}
