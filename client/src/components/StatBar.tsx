interface Props {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
  invert?: boolean; // if true, high value = bad (red); low = good (green)
}

export default function StatBar({ label, value, max = 100, color, showValue = true, invert = false }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  let barColor: string;
  if (color) {
    barColor = color;
  } else if (invert) {
    barColor = pct > 60 ? '#ef4444' : pct > 30 ? '#f59e0b' : '#4ade80';
  } else {
    barColor = pct > 60 ? '#4ade80' : pct > 30 ? '#f59e0b' : '#ef4444';
  }

  return (
    <div className="mb-1">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[6px] text-muted-foreground uppercase tracking-wider" style={{ fontFamily: 'Press Start 2P, monospace' }}>{label}</span>
        {showValue && <span className="text-[6px] text-foreground" style={{ fontFamily: 'Press Start 2P, monospace' }}>{Math.round(value)}</span>}
      </div>
      <div className="stat-bar rounded-none">
        <div
          className="stat-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
