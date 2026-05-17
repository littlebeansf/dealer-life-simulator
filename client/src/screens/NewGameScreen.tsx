import { useState } from 'react';
import type { RaceId, GameState, Gender } from '../game/types';
import { RACES } from '../game/data/races';
import { createNewGame, inheritRace } from '../game/engine';
import { RACE_IMAGES, startScreen } from '../assets/pixel';
import { useAudio } from '../hooks/useAudio';
import SettingsModal from '../components/SettingsModal';

interface Props {
  onStart: (state: GameState) => void;
  onBack: () => void;
}

const RACE_LIST = Object.values(RACES);
const PX = { fontFamily: 'Press Start 2P, monospace' };
const UI = { fontFamily: 'Courier New, monospace' };

// Compact 2-col race card
function RaceCard({
  race, selected, onClick, testId,
}: {
  race: typeof RACE_LIST[0];
  selected: boolean;
  onClick: () => void;
  testId: string;
}) {
  const img = RACE_IMAGES[race.id];
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-2 py-3 border-2 transition-all text-center ${
        selected
          ? 'border-accent bg-accent/15 text-accent'
          : 'border-border bg-card/60 hover:border-border/80 text-foreground hover:bg-card/80'
      }`}
    >
      {img ? (
        <img
          src={img}
          alt={race.name}
          className="w-12 h-12 object-contain"
          style={{ imageRendering: 'pixelated' }}
          loading="lazy"
        />
      ) : (
        <span className="text-2xl">{race.emoji}</span>
      )}
      <p className="text-[8px] font-bold leading-tight" style={PX}>
        {race.name.toUpperCase()}
      </p>
      {selected && (
        <span className="text-[7px] font-bold text-accent" style={PX}>✓ SELECTED</span>
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
  const { playSfx } = useAudio();

  const inheritedRaceId = inheritRace(fatherRace, motherRace);
  const inheritedRace = RACES[inheritedRaceId];

  const handleStart = () => {
    playSfx('levelup');
    const state = createNewGame(name.trim() || 'Stranger', gender, fatherRace, motherRace);
    onStart(state);
  };

  const next = (to: typeof step) => { playSfx('click'); setStep(to); };
  const back = (to: typeof step) => { playSfx('click'); setStep(to); };

  const STEPS = ['name', 'gender', 'father', 'mother', 'confirm'];
  const stepIdx = STEPS.indexOf(step);

  const STEP_LABELS: Record<string, string> = {
    name: 'YOUR NAME',
    gender: 'YOUR IDENTITY',
    father: "FATHER'S RACE",
    mother: "MOTHER'S RACE",
    confirm: 'YOUR HERITAGE',
  };

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <img
        src={startScreen}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 30%' }}
      />
      <div className="absolute inset-0 bg-black/88" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-4 pt-4 pb-3 flex-shrink-0 border-b border-white/10">
        <button
          onClick={() => back('name')}
          className="text-muted-foreground text-[9px] hover:text-foreground py-1"
          style={PX}
        >
          ← BACK
        </button>
        <div className="flex items-center gap-3">
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`rounded-full transition-all ${
                  i === stepIdx
                    ? 'w-3 h-3 bg-accent'
                    : i < stepIdx
                      ? 'w-2 h-2 bg-primary'
                      : 'w-2 h-2 bg-border'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center border border-white/20 bg-black/40 text-base"
          >⚙️</button>
        </div>
      </div>

      {/* Step label */}
      <div className="relative z-10 px-4 py-3 flex-shrink-0">
        <p className="text-[9px] text-muted-foreground" style={PX}>NEW LIFE</p>
        <h2 className="text-[14px] font-bold text-accent mt-1" style={PX}>
          {STEP_LABELS[step]}
        </h2>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-6">

        {/* NAME */}
        {step === 'name' && (
          <div className="space-y-5 pt-2">
            <p className="text-[11px] text-foreground" style={UI}>What do they call you in the streets?</p>
            <input
              data-testid="input-name"
              type="text"
              maxLength={20}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full bg-card/80 border-2 border-border text-foreground px-4 py-4 text-[13px] focus:outline-none focus:border-primary placeholder:text-muted-foreground/60"
              style={UI}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && next('gender')}
            />
            <button
              data-testid="btn-name-next"
              onClick={() => next('gender')}
              className="w-full py-4 px-4 pixel-border-green bg-primary/20 text-primary text-[11px] font-bold hover:bg-primary/35"
              style={PX}
            >
              NEXT →
            </button>
          </div>
        )}

        {/* GENDER */}
        {step === 'gender' && (
          <div className="space-y-3 pt-2">
            <p className="text-[11px] text-foreground mb-4" style={UI}>Choose your identity.</p>
            {(['male', 'female', 'other'] as Gender[]).map(g => (
              <button
                key={g}
                data-testid={`btn-gender-${g}`}
                onClick={() => setGender(g)}
                className={`w-full py-4 px-4 text-[11px] font-bold transition-colors border-2 ${
                  gender === g
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border bg-card/60 text-foreground hover:border-primary/50'
                }`}
                style={PX}
              >
                {g === 'male' ? '♂  MALE' : g === 'female' ? '♀  FEMALE' : '◈  OTHER'}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => back('name')} className="flex-1 py-3 border-2 border-border bg-card/60 text-muted-foreground text-[9px]" style={PX}>← BACK</button>
              <button data-testid="btn-gender-next" onClick={() => next('father')} className="flex-1 py-4 pixel-border-green bg-primary/20 text-primary text-[11px] font-bold" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* FATHER RACE */}
        {step === 'father' && (
          <div className="pt-2">
            <p className="text-[11px] text-muted-foreground mb-4" style={UI}>
              45% chance you inherit his bloodline.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {RACE_LIST.map(race => (
                <RaceCard
                  key={race.id}
                  race={race}
                  selected={fatherRace === race.id}
                  onClick={() => { playSfx('click'); setFatherRace(race.id); }}
                  testId={`btn-father-${race.id}`}
                />
              ))}
            </div>
            <div className="flex gap-2 sticky bottom-0 bg-black/70 py-2 -mx-4 px-4">
              <button onClick={() => back('gender')} className="flex-1 py-3 border-2 border-border bg-card/60 text-muted-foreground text-[9px]" style={PX}>← BACK</button>
              <button data-testid="btn-father-next" onClick={() => next('mother')} className="flex-1 py-4 pixel-border-accent bg-accent/20 text-accent text-[11px] font-bold" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* MOTHER RACE */}
        {step === 'mother' && (
          <div className="pt-2">
            <p className="text-[11px] text-muted-foreground mb-4" style={UI}>
              45% chance you inherit her bloodline.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {RACE_LIST.map(race => (
                <RaceCard
                  key={race.id}
                  race={race}
                  selected={motherRace === race.id}
                  onClick={() => { playSfx('click'); setMotherRace(race.id); }}
                  testId={`btn-mother-${race.id}`}
                />
              ))}
            </div>
            <div className="flex gap-2 sticky bottom-0 bg-black/70 py-2 -mx-4 px-4">
              <button onClick={() => back('father')} className="flex-1 py-3 border-2 border-border bg-card/60 text-muted-foreground text-[9px]" style={PX}>← BACK</button>
              <button data-testid="btn-mother-next" onClick={() => next('confirm')} className="flex-1 py-4 pixel-border-green bg-primary/20 text-primary text-[11px] font-bold" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* CONFIRM */}
        {step === 'confirm' && (
          <div className="pt-2">
            {/* Inherited race hero */}
            <div className="flex flex-col items-center gap-3 mb-5 p-5 border-2 border-accent/50 bg-accent/8">
              {RACE_IMAGES[inheritedRaceId] && (
                <img
                  src={RACE_IMAGES[inheritedRaceId]}
                  alt={inheritedRace.name}
                  className="w-28 h-28 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
              <div className="text-center">
                <p className="text-[13px] font-bold text-accent mb-2" style={PX}>{inheritedRace.name.toUpperCase()}</p>
                <p className="text-[11px] text-muted-foreground" style={UI}>{inheritedRace.flavor}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card/80 border-2 border-border p-4 mb-5 space-y-3">
              {[
                { label: 'NAME', value: name || 'Stranger' },
                { label: 'GENDER', value: gender },
                { label: 'FATHER', value: RACES[fatherRace].name },
                { label: 'MOTHER', value: RACES[motherRace].name },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground" style={UI}>{r.label}</span>
                  <span className="text-[11px] text-foreground font-bold" style={PX}>{r.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => back('mother')} className="flex-1 py-3 border-2 border-border bg-card/60 text-muted-foreground text-[9px]" style={PX}>← BACK</button>
              <button
                data-testid="btn-start-game"
                onClick={handleStart}
                className="flex-1 py-4 pixel-border-green bg-primary/20 text-primary text-[11px] font-bold hover:bg-primary/35"
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
