import { useState } from 'react';
import type { RaceId, GameState, Gender } from '../game/types';
import { RACES } from '../game/data/races';
import { createNewGame, inheritRace } from '../game/engine';
import { RACE_IMAGES, startScreen } from '../assets/pixel';
import SettingsModal from '../components/SettingsModal';

interface Props {
  onStart: (state: GameState) => void;
  onBack: () => void;
}

const RACE_LIST = Object.values(RACES);
const PX = { fontFamily: 'Press Start 2P, monospace' };

// BitLife-style compact race card
function RaceCard({
  race,
  selected,
  accentClass,
  onClick,
  testId,
}: {
  race: typeof RACE_LIST[0];
  selected: boolean;
  accentClass: string;
  onClick: () => void;
  testId: string;
}) {
  const img = RACE_IMAGES[race.id];
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 border-2 transition-all text-left ${
        selected
          ? `${accentClass} border-current bg-current/10`
          : 'border-border bg-card/50 hover:border-border/80'
      }`}
    >
      {/* Sprite icon */}
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {img ? (
          <img
            src={img}
            alt={race.name}
            className="w-10 h-10 object-contain"
            style={{ imageRendering: 'pixelated' }}
            loading="lazy"
          />
        ) : (
          <span className="text-xl">{race.emoji}</span>
        )}
      </div>
      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-[7px] font-bold leading-tight truncate ${selected ? '' : 'text-foreground'}`}
          style={PX}
        >
          {race.name.toUpperCase()}
        </p>
        <p className="text-[5px] text-muted-foreground leading-tight mt-0.5 truncate" style={{ fontFamily: 'Courier New, monospace' }}>
          {race.flavor.slice(0, 38)}{race.flavor.length > 38 ? '…' : ''}
        </p>
      </div>
      {/* Check indicator */}
      {selected && (
        <span className="text-[8px] flex-shrink-0" style={PX}>✓</span>
      )}
    </button>
  );
}

export default function NewGameScreen({ onStart, onBack }: Props) {
  const [step, setStep] = useState<'name' | 'gender' | 'father' | 'mother' | 'confirm'>('name');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('other');
  const [fatherRace, setFatherRace] = useState<RaceId>('goblin');
  const [motherRace, setMotherRace] = useState<RaceId>('elf');
  const [showSettings, setShowSettings] = useState(false);

  const inheritedRaceId = inheritRace(fatherRace, motherRace);
  const inheritedRace = RACES[inheritedRaceId];

  const handleStart = () => {
    const state = createNewGame(name.trim() || 'Stranger', gender, fatherRace, motherRace);
    onStart(state);
  };

  const STEPS = ['name', 'gender', 'father', 'mother', 'confirm'];
  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <img src={startScreen} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center top' }} />
      <div className="absolute inset-0 bg-black/85" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={onBack} className="text-muted-foreground text-[7px] hover:text-foreground" style={PX}>
          ← BACK
        </button>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`w-1.5 h-1.5 rounded-full ${i === stepIdx ? 'bg-accent' : i < stepIdx ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-7 h-7 flex items-center justify-center border border-white/20 bg-black/40 text-sm"
          >⚙️</button>
        </div>
      </div>

      {/* Step label */}
      <div className="relative z-10 px-4 pb-2 flex-shrink-0">
        <h2 className="text-[8px] text-accent" style={PX}>NEW LIFE</h2>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-6">

        {/* STEP: Name */}
        {step === 'name' && (
          <div className="space-y-4">
            <p className="text-[7px] text-muted-foreground" style={PX}>WHAT IS YOUR NAME?</p>
            <input
              data-testid="input-name"
              type="text"
              maxLength={20}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter name..."
              className="w-full bg-card/80 border-2 border-border text-foreground px-3 py-3 text-[9px] focus:outline-none focus:border-primary"
              style={PX}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && setStep('gender')}
            />
            <button
              data-testid="btn-name-next"
              onClick={() => setStep('gender')}
              className="w-full py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold hover:bg-primary/30"
              style={PX}
            >
              NEXT →
            </button>
          </div>
        )}

        {/* STEP: Gender */}
        {step === 'gender' && (
          <div className="space-y-3">
            <p className="text-[7px] text-muted-foreground" style={PX}>WHO ARE YOU?</p>
            {(['male', 'female', 'other'] as Gender[]).map(g => (
              <button
                key={g}
                data-testid={`btn-gender-${g}`}
                onClick={() => setGender(g)}
                className={`w-full py-3 px-4 text-[8px] font-bold transition-colors border-2 ${
                  gender === g
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/50'
                }`}
                style={PX}
              >
                {g === 'male' ? '♂ MALE' : g === 'female' ? '♀ FEMALE' : '◈ OTHER'}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep('name')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px]" style={PX}>← BACK</button>
              <button data-testid="btn-gender-next" onClick={() => setStep('father')} className="flex-1 py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* STEP: Father Race */}
        {step === 'father' && (
          <div>
            <p className="text-[7px] text-muted-foreground mb-1" style={PX}>FATHER'S RACE</p>
            <p className="text-[5px] text-muted-foreground mb-3" style={{ fontFamily: 'Courier New, monospace' }}>45% chance you inherit this bloodline.</p>
            <div className="space-y-1.5 mb-4">
              {RACE_LIST.map(race => (
                <RaceCard
                  key={race.id}
                  race={race}
                  selected={fatherRace === race.id}
                  accentClass="text-accent"
                  onClick={() => setFatherRace(race.id)}
                  testId={`btn-father-${race.id}`}
                />
              ))}
            </div>
            <div className="flex gap-2 sticky bottom-0 bg-black/60 py-2">
              <button onClick={() => setStep('gender')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px]" style={PX}>← BACK</button>
              <button data-testid="btn-father-next" onClick={() => setStep('mother')} className="flex-1 py-3 px-4 pixel-border-accent bg-accent/20 text-accent text-[8px] font-bold" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* STEP: Mother Race */}
        {step === 'mother' && (
          <div>
            <p className="text-[7px] text-muted-foreground mb-1" style={PX}>MOTHER'S RACE</p>
            <p className="text-[5px] text-muted-foreground mb-3" style={{ fontFamily: 'Courier New, monospace' }}>45% chance you inherit this bloodline.</p>
            <div className="space-y-1.5 mb-4">
              {RACE_LIST.map(race => (
                <RaceCard
                  key={race.id}
                  race={race}
                  selected={motherRace === race.id}
                  accentClass="text-primary"
                  onClick={() => setMotherRace(race.id)}
                  testId={`btn-mother-${race.id}`}
                />
              ))}
            </div>
            <div className="flex gap-2 sticky bottom-0 bg-black/60 py-2">
              <button onClick={() => setStep('father')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px]" style={PX}>← BACK</button>
              <button data-testid="btn-mother-next" onClick={() => setStep('confirm')} className="flex-1 py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* STEP: Confirm */}
        {step === 'confirm' && (
          <div>
            <p className="text-[7px] text-accent mb-4" style={PX}>YOUR HERITAGE</p>

            {/* Inherited race — large sprite centered */}
            <div className="flex flex-col items-center gap-3 mb-5 p-4 border-2 border-accent/40 bg-accent/5">
              {RACE_IMAGES[inheritedRaceId] && (
                <img
                  src={RACE_IMAGES[inheritedRaceId]}
                  alt={inheritedRace.name}
                  className="w-24 h-24 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
              <div className="text-center">
                <p className="text-[9px] font-bold text-accent mb-1" style={PX}>{inheritedRace.name.toUpperCase()}</p>
                <p className="text-[5px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>{inheritedRace.flavor}</p>
              </div>
            </div>

            {/* Stats summary */}
            <div className="bg-card/80 border-2 border-border p-3 mb-4 space-y-2">
              {[
                { label: 'NAME', value: name || 'Stranger' },
                { label: 'GENDER', value: gender },
                { label: 'FATHER', value: RACES[fatherRace].name },
                { label: 'MOTHER', value: RACES[motherRace].name },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-[5px] text-muted-foreground" style={{ fontFamily: 'Courier New, monospace' }}>{r.label}</span>
                  <span className="text-[8px] text-foreground font-bold" style={PX}>{r.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep('mother')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px]" style={PX}>← BACK</button>
              <button
                data-testid="btn-start-game"
                onClick={handleStart}
                className="flex-1 py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold"
                style={PX}
              >
                BEGIN LIFE
              </button>
            </div>
          </div>
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
