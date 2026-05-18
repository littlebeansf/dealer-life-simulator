import { ReactNode } from 'react';
import type { GameState } from '../game/types';
import { LOCATIONS } from '../game/data/locations';
import { RACES } from '../game/data/races';
import { LOCATION_IMAGES, RACE_IMAGES } from '../assets/pixel';
import StatBar from './StatBar';
import Banner from './Banner';
import { TickerBar } from './NewsTicker';

interface Props {
  gameState: GameState;
  children: ReactNode;
  panelExtra?: ReactNode;
}

export default function GameLayout({ gameState: gs, children, panelExtra }: Props) {
  const { player } = gs;
  const location = LOCATIONS[gs.currentLocationId];
  const race = RACES[player.raceId];
  const locImg = LOCATION_IMAGES[gs.currentLocationId];
  const raceImg = RACE_IMAGES[player.raceId];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Slide-in Banner notification */}
      <Banner />

      {/* ── TOP PANEL: Location bg + player stats ──────────────────────── */}
      <div
        className="relative flex-shrink-0 overflow-hidden bg-black"
        style={{ height: '42vh', minHeight: '210px', maxHeight: '320px' }}
      >
        {/* Background image — on mobile fills naturally; on desktop anchored to top
            so the image never gets cropped/washed out on wide viewports */}
        {locImg && (
          <img
            src={locImg}
            alt={location.name}
            className="absolute left-0 right-0 top-0 w-full"
            style={{
              // object-cover would stretch on desktop. Instead, natural width
              // with top-aligned crop lets the image look crisp like on mobile.
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              maxWidth: '480px',
              margin: '0 auto',
            }}
            loading="eager"
            decoding="async"
          />
        )}
        {/* On desktop: black flanks outside the image */}
        <div className="absolute inset-0 bg-black/0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #000 0%, transparent 12%, transparent 88%, #000 100%)' }} />
        {/* Dark overlays top and bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/15 to-black/85" />

        {/* ── Character row ── */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {raceImg && (
                <img
                  src={raceImg}
                  alt={race.name}
                  className="object-contain flex-shrink-0"
                  style={{
                    imageRendering: 'pixelated',
                    width: 'calc(2.5rem * var(--fs-emoji))',
                    height: 'calc(2.5rem * var(--fs-emoji))',
                  }}
                  loading="eager"
                />
              )}
              <div>
                <p className="font-bold text-white leading-none drop-shadow pixel-text">
                  {player.name}
                </p>
                <p className="text-white/75 leading-tight mt-1 ui-text">
                  {race.name} · Age {player.age}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-accent drop-shadow pixel-text" style={{ fontSize: 'calc(13px * var(--fs-scale-px))' }}>
                {player.money}g
              </p>
              <p className="text-white/60 ui-text">Year {gs.currentYear}</p>
            </div>
          </div>

          {/* Stat bars */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5">
            <StatBar label="HP" value={player.health} color="hsl(142 60% 45%)" />
            <StatBar label="STA" value={player.stamina} color="hsl(200 70% 55%)" />
            <StatBar label="HEAT" value={player.heat} color="hsl(0 70% 50%)" invert />
            <StatBar label="REP" value={player.reputation.underworld} color="hsl(270 60% 60%)" />
          </div>
        </div>

        {/* ── Location name ── */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <p className="font-bold text-white drop-shadow pixel-text">
            {location.name.toUpperCase()}
          </p>
          <p className="text-white/65 mt-0.5 ui-text">
            {location.culture}
          </p>
          {panelExtra}
        </div>
      </div>

      {/* ── News Ticker bar ─────────────────────────────────────────────── */}
      <TickerBar gameState={gs} />

      {/* ── Scrollable content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-background min-h-0">
        {children}
      </div>
    </div>
  );
}
