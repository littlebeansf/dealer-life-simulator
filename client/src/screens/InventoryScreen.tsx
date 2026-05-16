import type { GameState } from '../game/types';
import { ITEMS } from '../game/data/items';
import { ITEM_IMAGES } from '../assets/pixel';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import StatBar from '../components/StatBar';

interface Props {
  gameState: GameState;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

const RARITY_COLORS: Record<string, string> = {
  common: 'text-muted-foreground',
  uncommon: 'text-blue-400',
  rare: 'text-purple-400',
  legendary: 'text-amber-400',
};

export default function InventoryScreen({ gameState: gs, onNavigate }: Props) {
  const { inventory } = gs;
  const market = gs.markets[gs.currentLocationId];

  const heldItems = Object.entries(inventory.items).filter(([, qty]) => qty > 0);

  const totalValue = heldItems.reduce((sum, [itemId, qty]) => {
    const price = market?.prices[itemId as keyof typeof market.prices] ?? ITEMS[itemId as keyof typeof ITEMS].basePrice;
    return sum + price * qty;
  }, 0);

  const capacityPct = inventory.capacityMax > 0
    ? Math.min(100, Math.round((inventory.capacityUsed / inventory.capacityMax) * 100))
    : 0;

  return (
    <GameLayout gameState={gs}>
      <div className="px-3 py-2 pb-20">
        {/* Carry bar */}
        <div className="mb-3">
          <StatBar
            label={`CARRY ${inventory.capacityUsed}/${inventory.capacityMax}`}
            value={capacityPct}
            color={capacityPct > 90 ? 'hsl(0 70% 50%)' : capacityPct > 70 ? 'hsl(38 80% 50%)' : 'hsl(142 60% 45%)'}
            showValue={false}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[5px] text-muted-foreground ui-text">{heldItems.length} item type(s)</span>
            <span className="text-[5px] text-accent ui-text">Est. value: {totalValue}g</span>
          </div>
        </div>

        {heldItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎒</p>
            <p className="text-[7px] text-muted-foreground" style={PX}>BAG EMPTY</p>
            <p className="text-[9px] text-muted-foreground ui-text mt-2">Visit the market to stock up.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {heldItems.map(([itemId, qty]) => {
              const item = ITEMS[itemId as keyof typeof ITEMS];
              const price = market?.prices[itemId as keyof typeof market.prices] ?? item.basePrice;
              const itemValue = price * qty;
              const img = ITEM_IMAGES[itemId];

              return (
                <div
                  key={itemId}
                  data-testid={`inventory-item-${itemId}`}
                  className="bg-card border border-border p-2 flex items-start gap-2"
                >
                  {img ? (
                    <img src={img} alt={item.name} className="w-10 h-10 object-contain flex-shrink-0" style={{imageRendering:"pixelated"}} loading="lazy" />
                  ) : (
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-[6px] font-bold text-foreground" style={PX}>{item.name.toUpperCase()}</p>
                      <p className="text-[7px] font-bold text-accent" style={PX}>×{qty}</p>
                    </div>
                    <p className={`text-[5px] ui-text uppercase ${RARITY_COLORS[item.rarity]}`}>{item.rarity}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-[5px] text-muted-foreground ui-text">Unit: {price}g · Wt: {item.weight}</span>
                      <span className="text-[5px] text-primary ui-text">Total: {itemValue}g</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[4px] text-muted-foreground ui-text">RISK</span>
                      <div className="flex-1 stat-bar">
                        <div
                          className="stat-bar-fill"
                          style={{
                            width: `${item.risk * 10}%`,
                            background: item.risk > 7 ? 'hsl(0 70% 50%)' : item.risk > 4 ? 'hsl(38 80% 50%)' : 'hsl(142 60% 45%)',
                          }}
                        />
                      </div>
                      <span className="text-[4px] text-muted-foreground ui-text">{item.risk}/10</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav current="inventory" onNavigate={onNavigate} />
    </GameLayout>
  );
}
