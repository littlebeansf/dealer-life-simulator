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

const TYPE_COLOR: Record<TickerItem['type'], string> = {
  action: 'hsl(var(--primary))',
  news:   'hsl(var(--foreground))',
  warn:   'hsl(var(--destructive))',
  event:  'hsl(var(--accent))',
};

const TYPE_ICON: Record<TickerItem['type'], string> = {
  action: '▶',
  news:   '📰',
  warn:   '⚠',
  event:  '★',
};

// The marquee CSS — injected once
const MARQUEE_CSS = `
@keyframes ticker-scroll {
  0%   { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}
.ticker-marquee {
  display: inline-block;
  white-space: nowrap;
  animation: ticker-scroll 14s linear 1 forwards;
  will-change: transform;
}
`;

let cssInjected = false;
function ensureMarqueeCSS() {
  if (cssInjected) return;
  cssInjected = true;
  const style = document.createElement('style');
  style.textContent = MARQUEE_CSS;
  document.head.appendChild(style);
}

// Exported standalone — used inside GameLayout
export function TickerBar({ gameState }: { gameState: GameState }) {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const yearRef = useRef(gameState.currentYear);
  const [key, setKey] = useState(0); // force re-animate on item change

  // Inject CSS once
  useEffect(() => { ensureMarqueeCSS(); }, []);

  // Seed from recent log entries
  useEffect(() => {
    const recent = [...gameState.eventLog].reverse().slice(0, 5).map((e, i) => ({
      id: i,
      text: e.description ?? e.text ?? '',
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

  // Rotate item after animation completes (14s scroll + 2s pause)
  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setActiveIdx(i => (i + 1) % items.length);
      setKey(k => k + 1); // restart animation on new item
    }, 16000);
    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[activeIdx] ?? null;
  if (!item) return null;

  const color = TYPE_COLOR[item.type];
  const icon = TYPE_ICON[item.type];

  return (
    <div
      className="flex items-center bg-card/90 border-b border-border overflow-hidden"
      style={{ minHeight: '26px', maxHeight: '26px' }}
    >
      {/* Static left label */}
      <span
        className="flex-shrink-0 px-2 text-[7px] font-bold border-r border-border"
        style={{ fontFamily: 'Press Start 2P, monospace', color, lineHeight: '26px' }}
      >
        {icon}
      </span>

      {/* Scrolling marquee area */}
      <div className="flex-1 overflow-hidden relative" style={{ height: '26px' }}>
        <span
          key={key}
          className="ticker-marquee absolute top-0"
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '9px',
            color,
            lineHeight: '26px',
          }}
        >
          {item.text}
        </span>
      </div>
    </div>
  );
}
