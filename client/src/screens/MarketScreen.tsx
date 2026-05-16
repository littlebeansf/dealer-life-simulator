import { useState } from 'react';
import type { GameState, ItemId } from '../game/types';
import { ITEMS, ALL_ITEM_IDS } from '../game/data/items';
import { LOCATIONS } from '../game/data/locations';
import { buyItem, sellItem } from '../game/engine';
import { ITEM_IMAGES } from '../assets/pixel';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import { useBanner } from '../hooks/useBanner';

interface Props {
  gameState: GameState;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };
const RARITY_COLORS: Record<string, string> = {
  common: 'text-muted-foreground',
  uncommon: 'text-blue-400',
  rare: 'text-purple-400',
  legendary: 'text-amber-400',
};

export default function MarketScreen({ gameState: gs, onUpdate, onNavigate }: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { showBanner } = useBanner();

  const market = gs.markets[gs.currentLocationId];
  const location = LOCATIONS[gs.currentLocationId];
  const merchantId = location.merchantId;
  const merchant = gs.people[merchantId];

  const setQty = (id: string, val: number) => {
    setQuantities(q => ({ ...q, [id]: Math.max(1, val) }));
  };

  const handleBuy = (itemId: ItemId) => {
    const qty = quantities[itemId] ?? 1;
    const result = buyItem(gs, itemId, qty);
    if (result.error) showBanner(result.error, 'error');
    else {
      showBanner(`Bought ${qty}× ${ITEMS[itemId].name}!`, 'success');
      onUpdate(result.state);
      setQty(itemId, 1);
      setExpandedItem(null);
    }
  };

  const handleSell = (itemId: ItemId) => {
    const qty = quantities[itemId] ?? 1;
    const result = sellItem(gs, itemId, qty);
    if (result.error) showBanner(result.error, 'error');
    else {
      showBanner(`Sold ${qty}× ${ITEMS[itemId].name}!`, 'success');
      onUpdate(result.state);
      setQty(itemId, 1);
      setExpandedItem(null);
    }
  };

  const ownedItems = ALL_ITEM_IDS.filter(id => (gs.inventory.items[id] ?? 0) > 0);

  return (
    <GameLayout
      gameState={gs}
      panelExtra={
        <p className="text-[5px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
          {merchant?.name ?? 'Unknown Merchant'} · Black Market
        </p>
      }
    >
      {/* Gold & carry info */}
      <div className="flex items-center justify-between px-3 py-2 bg-card border-b border-border">
        <p className="text-[6px] text-muted-foreground ui-text">
          Carry: <span className="text-foreground">{gs.inventory.capacityUsed}/{gs.inventory.capacityMax}</span>
        </p>
        <p className="text-[8px] font-bold text-accent" style={PX}>{gs.player.money}g</p>
      </div>

      <div className="px-3 py-2 space-y-1 pb-20">
        {/* BUY section */}
        <p className="text-[5px] text-muted-foreground mt-1 mb-2" style={PX}>── MARKET STOCK ──</p>
        {ALL_ITEM_IDS.map(itemId => {
          const item = ITEMS[itemId];
          const stock = market?.stock[itemId] ?? 0;
          const price = market?.prices[itemId] ?? item.basePrice;
          const qty = quantities[itemId] ?? 1;
          const isNative = location.nativeItemId === itemId;
          const canAfford = gs.player.money >= price * qty;
          const hasStock = stock >= qty;
          const isExpanded = expandedItem === itemId;
          const img = ITEM_IMAGES[itemId];

          return (
            <div
              key={itemId}
              data-testid={`market-item-${itemId}`}
              className={`bg-card border transition-all cursor-pointer ${
                isNative ? 'border-accent/50' : 'border-border'
              } ${isExpanded ? 'border-primary/50' : 'hover:border-border/70'}`}
              onClick={() => setExpandedItem(isExpanded ? null : itemId)}
            >
              {/* Compact row */}
              <div className="flex items-center gap-2 px-3 py-2">
                {img && (
                  <img src={img} alt={item.name} className="w-8 h-8 object-cover flex-shrink-0 rounded-sm" loading="lazy" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[6px] font-bold text-foreground truncate" style={PX}>{item.name.toUpperCase()}</p>
                    {isNative && <span className="text-[4px] text-accent bg-accent/20 px-1 py-0.5 ui-text flex-shrink-0">★ NATIVE</span>}
                  </div>
                  <p className={`text-[5px] ui-text ${RARITY_COLORS[item.rarity]}`}>{item.rarity}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[7px] font-bold text-accent" style={PX}>{price}g</p>
                  <p className="text-[5px] text-muted-foreground ui-text">
                    {stock > 0 ? `×${stock}` : 'sold out'}
                  </p>
                </div>
                <span className="text-muted-foreground text-[8px] ml-1">{isExpanded ? '▲' : '▼'}</span>
              </div>

              {/* Expanded: buy & sell controls */}
              {isExpanded && (
                <div
                  className="border-t border-border px-3 py-2 space-y-2"
                  onClick={e => e.stopPropagation()}
                >
                  <p className="text-[9px] text-muted-foreground ui-text">{item.description}</p>

                  {/* BUY row */}
                  {stock > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[5px] text-muted-foreground ui-text w-6">BUY</span>
                      <button onClick={() => setQty(itemId, qty - 1)} className="w-6 h-6 bg-secondary border border-border text-foreground text-[10px] hover:bg-card flex items-center justify-center">-</button>
                      <span className="text-[7px] text-foreground w-5 text-center" style={PX}>{qty}</span>
                      <button onClick={() => setQty(itemId, Math.min(qty + 1, stock))} className="w-6 h-6 bg-secondary border border-border text-foreground text-[10px] hover:bg-card flex items-center justify-center">+</button>
                      <button
                        data-testid={`btn-buy-${itemId}`}
                        onClick={() => handleBuy(itemId)}
                        disabled={!canAfford || !hasStock}
                        className="ml-auto py-1 px-2 text-[6px] bg-primary/20 border border-primary text-primary hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={PX}
                      >
                        BUY {price * qty}g
                      </button>
                    </div>
                  )}

                  {/* SELL row (if owned) */}
                  {(gs.inventory.items[itemId] ?? 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[5px] text-muted-foreground ui-text w-6">SELL</span>
                      <button onClick={() => setQty(itemId, qty - 1)} className="w-6 h-6 bg-secondary border border-border text-foreground text-[10px] hover:bg-card flex items-center justify-center">-</button>
                      <span className="text-[7px] text-foreground w-5 text-center" style={PX}>{qty}</span>
                      <button onClick={() => setQty(itemId, Math.min(qty + 1, gs.inventory.items[itemId] ?? 0))} className="w-6 h-6 bg-secondary border border-border text-foreground text-[10px] hover:bg-card flex items-center justify-center">+</button>
                      <button
                        data-testid={`btn-sell-${itemId}`}
                        onClick={() => handleSell(itemId)}
                        disabled={(gs.inventory.items[itemId] ?? 0) < qty}
                        className="ml-auto py-1 px-2 text-[6px] bg-accent/20 border border-accent text-accent hover:bg-accent/30 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={PX}
                      >
                        SELL {price * qty}g
                      </button>
                    </div>
                  )}

                  {stock === 0 && (gs.inventory.items[itemId] ?? 0) === 0 && (
                    <p className="text-[5px] text-muted-foreground ui-text">Out of stock. Nothing to sell.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* My inventory quick view */}
        {ownedItems.length > 0 && (
          <>
            <p className="text-[5px] text-muted-foreground mt-3 mb-1" style={PX}>── YOUR INVENTORY ──</p>
            <div className="flex flex-wrap gap-2">
              {ownedItems.map(id => {
                const img = ITEM_IMAGES[id];
                const price = market?.prices[id] ?? ITEMS[id].basePrice;
                return (
                  <button
                    key={id}
                    onClick={() => setExpandedItem(expandedItem === id ? null : id)}
                    className="flex items-center gap-1 bg-card border border-border px-2 py-1 hover:border-accent/50 transition-all"
                  >
                    {img && <img src={img} alt={ITEMS[id].name} className="w-5 h-5 object-cover rounded-sm" />}
                    <span className="text-[5px] text-accent ui-text">{price}g</span>
                    <span className="text-[5px] text-foreground ui-text">×{gs.inventory.items[id]}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav current="market" onNavigate={onNavigate} />
    </GameLayout>
  );
}
