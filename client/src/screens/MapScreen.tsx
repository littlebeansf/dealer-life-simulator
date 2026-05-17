import { useState } from 'react';
import type { GameState, LocationId } from '../game/types';
import { LOCATIONS, LOCATION_LIST } from '../game/data/locations';
import { RACES } from '../game/data/races';
import { travel } from '../game/engine';
import { worldMap } from '../assets/pixel';
import GameLayout from '../components/GameLayout';
import BottomNav from '../components/BottomNav';
import { useBanner } from '../hooks/useBanner';
import { useAudio } from '../hooks/useAudio';

interface Props {
  gameState: GameState;
  onUpdate: (s: GameState) => void;
  onNavigate: (s: GameState['screen']) => void;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };
const UI = { fontFamily: 'Courier New, monospace' };

const RISK_CONFIG = (r: number) => {
  if (r <= 2) return { label: 'SAFE', bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/40' };
  if (r <= 4) return { label: 'LOW', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/40' };
  if (r <= 6) return { label: 'MOD', bg: 'bg-accent/20', text: 'text-accent', border: 'border-accent/40' };
  if (r <= 8) return { label: 'HIGH', bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-400/40' };
  return { label: 'LETHAL', bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/40' };
};

export default function MapScreen({ gameState: gs, onUpdate, onNavigate }: Props) {
  const [traveling, setTraveling] = useState(false);
  const [selected, setSelected] = useState<LocationId | null>(null);
  const { showBanner } = useBanner();
  const { playSfx } = useAudio();

  const currentLoc = LOCATIONS[gs.currentLocationId];
  const routes = currentLoc.travelRoutes;
  const routeMap = new Map(routes.map(r => [r.toLocationId, r]));

  const handleTravel = (toId: LocationId) => {
    const route = routeMap.get(toId);
    if (!route) {
      showBanner('No direct route to this location.', 'warning');
      return;
    }
    if (gs.player.money < route.cost) {
      playSfx('error');
      showBanner(`Need ${route.cost}g to travel. You have ${gs.player.money}g.`, 'error');
      return;
    }
    setTraveling(true);
    playSfx('travel');
    setTimeout(() => {
      const newState = travel(gs, toId);
      onUpdate(newState);
      setTraveling(false);
      setSelected(null);
      showBanner(`Arrived at ${LOCATIONS[toId].name}!`, 'success');
    }, 500);
  };

  return (
    <GameLayout gameState={gs} panelExtra={
      <p className="text-[9px] text-white/55 mt-1" style={UI}>
        Select a destination below
      </p>
    }>
      {/* ── WORLD MAP SECTION ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: '160px' }}>
        <img
          src={worldMap}
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          loading="eager"
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
        {/* Map label */}
        <div className="absolute top-2 left-3">
          <p className="text-[7px] font-bold text-white/90 drop-shadow-md" style={PX}>WORLD MAP</p>
        </div>
        {/* Current location pin */}
        <div className="absolute bottom-3 left-3 bg-black/70 border border-accent/60 px-2 py-1 flex items-center gap-1.5">
          <span className="text-[8px]">📍</span>
          <p className="text-[8px] text-accent font-bold" style={PX}>{currentLoc.name.toUpperCase()}</p>
        </div>
      </div>

      {/* ── ROUTES ──────────────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[8px] text-muted-foreground mb-3" style={PX}>── AVAILABLE ROUTES ──</p>

        {routes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[11px] text-muted-foreground" style={UI}>No travel routes from here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {routes.map(route => {
              const dest = LOCATIONS[route.toLocationId];
              const risk = RISK_CONFIG(route.riskLevel);
              const canAfford = gs.player.money >= route.cost;
              const isSelected = selected === route.toLocationId;

              return (
                <div key={route.toLocationId}>
                  {/* Route card — tap to select, tap again to travel */}
                  <button
                    data-testid={`route-${route.toLocationId}`}
                    onClick={() => {
                      if (isSelected) {
                        handleTravel(route.toLocationId);
                      } else {
                        playSfx('click');
                        setSelected(route.toLocationId);
                      }
                    }}
                    disabled={traveling}
                    className={`w-full text-left border-2 transition-all overflow-hidden ${
                      isSelected
                        ? 'border-accent bg-accent/10'
                        : canAfford
                          ? 'border-border bg-card hover:border-border/80 hover:bg-card/80'
                          : 'border-border/40 bg-card/50 opacity-70'
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      {/* Left: destination info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-foreground leading-tight" style={PX}>
                          {dest.name.toUpperCase()}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1" style={UI}>
                          {RACES[dest.raceId].name} territory
                        </p>
                        {isSelected && (
                          <p className="text-[10px] text-accent mt-1 font-bold" style={UI}>
                            Tap again to confirm travel →
                          </p>
                        )}
                      </div>

                      {/* Right: cost + risk */}
                      <div className="flex-shrink-0 text-right space-y-1">
                        <p
                          className={`text-[11px] font-bold ${canAfford ? 'text-accent' : 'text-destructive'}`}
                          style={PX}
                        >
                          {route.cost}g
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 text-[8px] font-bold border ${risk.bg} ${risk.text} ${risk.border}`}
                          style={PX}
                        >
                          {risk.label}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar when traveling */}
                    {traveling && isSelected && (
                      <div className="h-1 bg-muted overflow-hidden">
                        <div className="h-full bg-accent animate-pulse w-full" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── ALL LOCATIONS GRID ─────────────────────────────────────────── */}
      <div className="px-3 pt-1 pb-24">
        <p className="text-[8px] text-muted-foreground mb-3" style={PX}>── ALL LOCATIONS ──</p>
        <div className="grid grid-cols-2 gap-2">
          {LOCATION_LIST.map(loc => {
            const isHere = loc.id === gs.currentLocationId;
            const hasRoute = routeMap.has(loc.id);
            return (
              <div
                key={loc.id}
                className={`border-2 px-3 py-2.5 transition-colors ${
                  isHere
                    ? 'border-accent bg-accent/15'
                    : hasRoute
                      ? 'border-primary/40 bg-card cursor-pointer hover:border-primary/70'
                      : 'border-border/30 bg-card/50 opacity-50'
                }`}
                onClick={() => {
                  if (hasRoute && !isHere) {
                    playSfx('click');
                    setSelected(loc.id);
                    setTimeout(() => {
                      document.getElementById(`route-${loc.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 50);
                  }
                }}
              >
                <p
                  className={`text-[9px] font-bold leading-tight ${isHere ? 'text-accent' : 'text-foreground'}`}
                  style={PX}
                >
                  {loc.name}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1" style={UI}>
                  {isHere ? '📍 HERE' : hasRoute ? '✓ reachable' : '✗ no route'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav current="map" onNavigate={onNavigate} />
    </GameLayout>
  );
}
