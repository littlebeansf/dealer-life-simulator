import { ReactNode } from 'react';
import type { GameState } from '../game/types';
import { LOCATIONS } from '../game/data/locations';
import { RACES } from '../game/data/races';
import { LOCATION_IMAGES, RACE_IMAGES } from '../assets/pixel';
import StatBar from './StatBar';
import Banner from './Banner';

interface Props {
  gameState: GameState;
  children: ReactNode;
  /** Extra content rendered in the location panel (below stats) */
  panelExtra?: ReactNode;
}

const PX = { fontFamily: 'Press Start 2P, monospace' };

export default function GameLayout({ gameState: gs, children, panelExtra }: Props) {
  const { player } = gs;
  const location = LOCATIONS[gs.currentLocationId];
  const race = RACES[player.raceId];
  const locImg = LOCATION_IMAGES[gs.currentLocationId];
  const raceImg = RACE_IMAGES[player.raceId];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Banner notification — slides in from top */}
      <Banner />

      {/* ── TOP PANEL: Location (fixed ~40%) ─────────────────────────────── */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ height: '40vh', minHeight: '200px', maxHeight: '280px' }}
      >
        {/* Location background image */}
        {locImg && (
          <img
            src={locImg}
            alt={location.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        )}
        {/* Gradient overlay: dark at top/bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />

        {/* Top row: character info */}
        <div className="absolute top-0 left-0 right-0 px-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {raceImg ? (
                <img
                  src={raceImg}
                  alt={race.name}
                  className="w-8 h-8 object-contain flex-shrink-0" style={{imageRendering:"pixelated"}}
                  loading="eager"
                />
              ) : null}
              <div>
                <p className="text-[7px] font-bold text-white leading-none drop-shadow" style={PX}>
                  {player.name}
                </p>
                <p className="text-[5px] text-white/70 leading-none mt-0.5" style={{ fontFamily: 'Courier New, monospace' }}>
                  {race.name} · Age {player.age} · {player.gender}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-accent drop-shadow" style={PX}>{player.money}g</p>
              <p className="text-[5px] text-white/60" style={{ fontFamily: 'Courier New, monospace' }}>Yr {gs.currentYear}</p>
            </div>
          </div>

          {/* Stat bars row */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
            <StatBar label="HP" value={player.health} color="hsl(142 60% 45%)" />
            <StatBar label="STA" value={player.stamina} color="hsl(200 70% 55%)" />
            <StatBar label="HEAT" value={player.heat} color="hsl(0 70% 50%)" invert />
            <StatBar label="UW" value={player.reputation.underworld} color="hsl(270 60% 60%)" />
          </div>
        </div>

        {/* Bottom row: location name */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-[9px] font-bold text-white drop-shadow" style={PX}>
            {location.name.toUpperCase()}
          </p>
          <p className="text-[5px] text-white/60" style={{ fontFamily: 'Courier New, monospace' }}>
            {location.culture}
          </p>
          {panelExtra}
        </div>
      </div>

      {/* ── BOTTOM PANEL: Scrollable content (~60%) ───────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-background min-h-0">
        {children}
      </div>
    </div>
  );
}
