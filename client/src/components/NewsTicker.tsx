import { useState, useEffect, createContext, useContext, useRef, type ReactNode } from 'react';
import type { GameState } from '../game/types';

// ─── Context ────────────────────────────────────────────────────────────────

interface TickerItem {
  id: number;
  text: string;
  type: 'action' | 'news' | 'warn' | 'event';
}

interface TickerContextValue {
  addTick: (text: string, type?: TickerItem['type']) => void;
}

const TickerCtx = createContext<TickerContextValue>({ addTick: () => {} });
let _counter = 0;

export function TickerProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TickerItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addTick = (text: string, type: TickerItem['type'] = 'action') => {
    const item: TickerItem = { id: _counter++, text, type };
    setItems(prev => [...prev.slice(-6), item]); // keep last 7
  };

  return (
    <TickerCtx.Provider value={{ addTick }}>
      {children}
    </TickerCtx.Provider>
  );
}

export function useTicker() {
  return useContext(TickerCtx);
}

// ─── Random yearly news snippets ─────────────────────────────────────────────

const YEARLY_NEWS = [
  'The guards raised patrol rates in the outer districts.',
  'A new contraband shipment arrived at the docks.',
  'Rumour: a rival gang was seen near the market.',
  'The Vampire Court declared a blood tax on merchants.',
  'Fairy dust prices surged after a crop shortage.',
  'Goblin alchemists discovered a new synthesis method.',
  'A merchant was caught with illegal moonleaf extract.',
  'The Orc warband extorted three traders last night.',
  'Elven smugglers were seen crossing the northern border.',
  'A bounty has been posted for an unknown dealer.',
  'The Golem Quarry workers went on strike for two days.',
  'Dragon Peaks erupted — the road east is dangerous.',
  'Ghost Marsh fog thickened — travel time increased.',
  'A new fence opened shop in the underground market.',
  'The dwarf breweries raised prices on all ingredients.',
  'Siren tears supply dropped — prices expected to rise.',
  'Guards found a cache of witchroot in the old quarter.',
  'A buyer is offering double for vampire ash this season.',
  'Werewolf sightings reported near Moonfang Wilds.',
  'The annual Black Market Bazaar starts next month.',
];

export function getRandomNews(): string {
  return YEARLY_NEWS[Math.floor(Math.random() * YEARLY_NEWS.length)];
}

// ─── Ticker Bar Component ─────────────────────────────────────────────────────

const TYPE_STYLES: Record<TickerItem['type'], string> = {
  action: 'text-primary',
  news:   'text-foreground',
  warn:   'text-destructive',
  event:  'text-accent',
};

const TYPE_ICON: Record<TickerItem['type'], string> = {
  action: '▶',
  news:   '📰',
  warn:   '⚠',
  event:  '★',
};

interface TickerBarProps {
  items: TickerItem[];
}

// Exported standalone — used inside GameLayout
export function TickerBar({ gameState }: { gameState: GameState }) {
  const { addTick } = useTicker();
  const [items, setItems] = useState<TickerItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const yearRef = useRef(gameState.currentYear);

  // Subscribe to context — by re-exporting addTick calls from engine integration
  // For now, seed with recent log entries from the game state
  useEffect(() => {
    const recent = [...gameState.eventLog].reverse().slice(0, 5).map((e, i) => ({
      id: i,
      text: e.description,
      type: (e.type === 'trade' ? 'action' : e.type === 'event' ? 'event' : 'news') as TickerItem['type'],
    }));
    if (recent.length > 0) setItems(recent);
  }, [gameState.eventLog.length]);

  // Add yearly news when year changes
  useEffect(() => {
    if (gameState.currentYear !== yearRef.current) {
      yearRef.current = gameState.currentYear;
      const news = getRandomNews();
      setItems(prev => [...prev.slice(-6), { id: _counter++, text: news, type: 'news' }]);
    }
  }, [gameState.currentYear]);

  // Rotate displayed item every 4s
  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setActiveIdx(i => (i + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[activeIdx] ?? null;
  if (!item) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 bg-card/90 border-b border-border overflow-hidden"
      style={{ minHeight: '28px', maxHeight: '28px' }}
    >
      <span
        className="flex-shrink-0 text-[7px] font-bold"
        style={{ fontFamily: 'Press Start 2P, monospace', color: 'hsl(var(--accent))' }}
      >
        {TYPE_ICON[item.type]}
      </span>
      <div className="flex-1 overflow-hidden">
        <p
          className={`text-[9px] truncate ${TYPE_STYLES[item.type]}`}
          style={{ fontFamily: 'Courier New, monospace' }}
          key={item.id}
        >
          {item.text}
        </p>
      </div>
      {items.length > 1 && (
        <span className="flex-shrink-0 text-[6px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>
          {activeIdx + 1}/{items.length}
        </span>
      )}
    </div>
  );
}
