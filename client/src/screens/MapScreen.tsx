import { useState } from 'react';
import type { GameState, LocationId } from '../game/types';
import { LOCATIONS, LOCATION_LIST } from '../game/data/locations';
import { RACES } from '../game/data/races';
import { travel } from '../game/engine';
import { LOCATION_IMAGES } from '../assets/pixel';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import { useBanner } from '../hooks/useBanner';

interface Props {
  gameState: GameState;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

const RISK_LABEL = (r: number) => {
  if (r <= 2) return { label: 'SAFE', color: 'text-primary' };
  if (r <= 4) return { label: 'LOW RISK', color: 'text-primary' };
  if (r <= 6) return { label: 'MODERATE', color: 'text-accent' };
  if (r <= 8) return { label: 'DANGEROUS', color: 'text-orange-400' };
  return { label: 'LETHAL', color: 'text-destructive' };
};

export default function MapScreen({ gameState: gs, onUpdate, onNavigate }: Props) {
  const [traveling, setTraveling] = useState(false);
  const { showBanner } = useBanner();

  const currentLoc = LOCATIONS[gs.currentLocationId];
  const routes = currentLoc.travelRoutes;
  const connectedIds = new Set(routes.map(r => r.toLocationId));

  const handleTravel = (toId: LocationId) => {
    const route = routes.find(r => r.toLocationId === toId);
    if (!route) return;
    if (gs.player.money < route.cost) {
      showBanner(`Need ${route.cost}g to travel. You have ${gs.player.money}g.`, 'error');
      return;
    }
    setTraveling(true);
    setTimeout(() => {
      const newState = travel(gs, toId);
      onUpdate(newState);
      setTraveling(false);
      if (newState.currentLocationId === toId) {
        showBanner(`Arrived at ${LOCATIONS[toId].name}!`, 'success');
      }
    }, 400);
  };

  return (
    <GameLayout
      gameState={gs}
      panelExtra={
        <p className="text-[5px] text-white/60 mt-1" style={{ fontFamily: 'Courier New, monospace' }}>
          Tap a route to travel instantly
        </p>
      }
    >
      <div className="px-3 py-2 space-y-1 pb-20">
        <p className="text-[5px] text-muted-foreground mb-2" style={PX}>── CONNECTED ROUTES ──</p>

        {routes.length === 0 ? (
          <p className="text-[9px] text-muted-foreground ui-text py-4">No travel routes from here.</p>
        ) : (
          routes.map(route => {
            const dest = LOCATIONS[route.toLocationId];
            const risk = RISK_LABEL(route.riskLevel);
            const race = RACES[dest.raceId];
            const canAfford = gs.player.money >= route.cost;
            const destImg = LOCATION_IMAGES[route.toLocationId];

            return (
              <button
                key={route.toLocationId}
                data-testid={`route-${route.toLocationId}`}
                onClick={() => !traveling && handleTravel(route.toLocationId)}
                disabled={traveling}
                className={`w-full bg-card border-2 transition-all text-left relative overflow-hidden ${
                  canAfford ? 'border-border hover:border-accent/60 active:bg-accent/10' : 'border-border/50 opacity-60'
                } disabled:cursor-not-allowed`}
              >
                {/* Destination thumbnail bg */}
                {destImg && (
                  <img src={destImg} alt={dest.name} className="absolute inset-0 w-full h-full object-cover opacity-15" loading="lazy" />
                )}
                <div className="relative flex items-center gap-3 px-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[7px] font-bold text-foreground" style={PX}>{dest.name.toUpperCase()}</p>
                    <p className="text-[5px] text-muted-foreground ui-text">{race.name} territory</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[5px] ui-text ${risk.color}`}>{risk.label}</span>
                      <span className="text-[5px] text-muted-foreground ui-text">risk {route.riskLevel}/10</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground ui-text mt-1 line-clamp-1">{dest.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-[9px] font-bold ${canAfford ? 'text-accent' : 'text-destructive'}`} style={PX}>
                      {route.cost}g
                    </p>
                    {!canAfford && (
                      <p className="text-[4px] text-destructive ui-text">need {route.cost - gs.player.money}g more</p>
                    )}
                    <p className="text-[5px] text-muted-foreground ui-text mt-1">
                      {traveling ? '...' : '→ TRAVEL'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}

        {/* All locations overview */}
        <p className="text-[5px] text-muted-foreground mt-4 mb-2" style={PX}>── ALL LOCATIONS ──</p>
        <div className="grid grid-cols-2 gap-1">
          {LOCATION_LIST.filter(loc => loc.id !== gs.currentLocationId).map(loc => {
            const isConnected = connectedIds.has(loc.id);
            const locImg = LOCATION_IMAGES[loc.id];
            return (
              <div
                key={loc.id}
                className={`relative overflow-hidden flex items-end p-2 border h-14 ${
                  isConnected ? 'border-border/60' : 'border-border/20 opacity-40'
                }`}
              >
                {locImg && (
                  <img src={locImg} alt={loc.name} className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
                )}
                <div className="relative">
                  <p className="text-[5px] text-foreground ui-text leading-tight">{loc.name}</p>
                  {isConnected && <p className="text-[4px] text-primary ui-text">reachable</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav current="map" onNavigate={onNavigate} />
    </GameLayout>
  );
}
