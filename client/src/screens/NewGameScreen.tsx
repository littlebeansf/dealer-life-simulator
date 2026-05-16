import { useState } from 'react';
import type { RaceId, GameState, Gender } from '../game/types';
import { RACES } from '../game/data/races';
import { createNewGame, inheritRace } from '../game/engine';
import { RACE_IMAGES, startScreen } from '../assets/pixel';
import ThemeToggle from '../components/ThemeToggle';

interface Props {
  onStart: (state: GameState) => void;
  onBack: () => void;
}

const RACE_LIST = Object.values(RACES);
const PX = { fontFamily: 'Press Start 2P, monospace' };

export default function NewGameScreen({ onStart, onBack }: Props) {
  const [step, setStep] = useState<'name' | 'gender' | 'father' | 'mother' | 'confirm'>('name');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('other');
  const [fatherRace, setFatherRace] = useState<RaceId>('goblin');
  const [motherRace, setMotherRace] = useState<RaceId>('elf');

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
      {/* Background image */}
      <img src={startScreen} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/80" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={onBack} className="text-muted-foreground text-[7px] hover:text-foreground" style={PX}>
          ← BACK
        </button>
        <div className="flex items-center gap-3">
          {/* Step dots */}
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`w-1.5 h-1.5 rounded-full ${i === stepIdx ? 'bg-accent' : i < stepIdx ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-6">
        <h2 className="text-[9px] text-accent mb-4" style={PX}>NEW LIFE</h2>

        {/* STEP: Name */}
        {step === 'name' && (
          <div className="fade-in space-y-4">
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
              className="w-full py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold hover:bg-primary/30 transition-colors"
              style={PX}
            >
              NEXT →
            </button>
          </div>
        )}

        {/* STEP: Gender */}
        {step === 'gender' && (
          <div className="fade-in space-y-3">
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
              <button onClick={() => setStep('name')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px] hover:text-foreground" style={PX}>← BACK</button>
              <button data-testid="btn-gender-next" onClick={() => setStep('father')} className="flex-1 py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold hover:bg-primary/30" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* STEP: Father Race */}
        {step === 'father' && (
          <div className="fade-in">
            <p className="text-[7px] text-muted-foreground mb-1" style={PX}>YOUR FATHER'S RACE</p>
            <p className="text-[5px] text-muted-foreground mb-3 ui-text">45% chance you inherit this race.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {RACE_LIST.map(race => {
                const img = RACE_IMAGES[race.id];
                return (
                  <button
                    key={race.id}
                    data-testid={`btn-father-${race.id}`}
                    onClick={() => setFatherRace(race.id)}
                    className={`relative overflow-hidden border-2 flex flex-col items-center text-center transition-all ${
                      fatherRace === race.id
                        ? 'border-accent bg-accent/20'
                        : 'border-border bg-card/60 hover:border-accent/40'
                    }`}
                  >
                    {img && (
                      <img src={img} alt={race.name} className="w-full h-16 object-cover object-top opacity-80" loading="lazy" />
                    )}
                    <span className={`text-[5px] font-bold py-1 w-full text-center ${fatherRace === race.id ? 'text-accent' : 'text-foreground'}`} style={PX}>
                      {race.name.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('gender')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px] hover:text-foreground" style={PX}>← BACK</button>
              <button data-testid="btn-father-next" onClick={() => setStep('mother')} className="flex-1 py-3 px-4 pixel-border-accent bg-accent/20 text-accent text-[8px] font-bold hover:bg-accent/30" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* STEP: Mother Race */}
        {step === 'mother' && (
          <div className="fade-in">
            <p className="text-[7px] text-muted-foreground mb-1" style={PX}>YOUR MOTHER'S RACE</p>
            <p className="text-[5px] text-muted-foreground mb-3 ui-text">45% chance you inherit this race.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {RACE_LIST.map(race => {
                const img = RACE_IMAGES[race.id];
                return (
                  <button
                    key={race.id}
                    data-testid={`btn-mother-${race.id}`}
                    onClick={() => setMotherRace(race.id)}
                    className={`relative overflow-hidden border-2 flex flex-col items-center text-center transition-all ${
                      motherRace === race.id
                        ? 'border-primary bg-primary/20'
                        : 'border-border bg-card/60 hover:border-primary/40'
                    }`}
                  >
                    {img && (
                      <img src={img} alt={race.name} className="w-full h-16 object-cover object-top opacity-80" loading="lazy" />
                    )}
                    <span className={`text-[5px] font-bold py-1 w-full text-center ${motherRace === race.id ? 'text-primary' : 'text-foreground'}`} style={PX}>
                      {race.name.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep('father')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px] hover:text-foreground" style={PX}>← BACK</button>
              <button data-testid="btn-mother-next" onClick={() => setStep('confirm')} className="flex-1 py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold hover:bg-primary/30" style={PX}>NEXT →</button>
            </div>
          </div>
        )}

        {/* STEP: Confirm */}
        {step === 'confirm' && (
          <div className="fade-in">
            <p className="text-[7px] text-accent mb-3" style={PX}>YOUR HERITAGE</p>

            {/* Big race portrait */}
            {RACE_IMAGES[inheritedRaceId] && (
              <div className="relative overflow-hidden border-2 border-accent mb-3 h-32">
                <img src={RACE_IMAGES[inheritedRaceId]} alt={inheritedRace.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-2 left-2 text-[9px] font-bold text-accent" style={PX}>
                  {inheritedRace.name.toUpperCase()}
                </p>
              </div>
            )}

            <div className="bg-card/80 border-2 border-border p-3 mb-3 space-y-2">
              {[
                { label: 'NAME', value: name || 'Stranger', color: 'text-foreground' },
                { label: 'GENDER', value: gender, color: 'text-foreground' },
                { label: 'FATHER', value: RACES[fatherRace].name, color: 'text-accent' },
                { label: 'MOTHER', value: RACES[motherRace].name, color: 'text-primary' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-[5px] text-muted-foreground ui-text">{r.label}</span>
                  <span className={`text-[9px] ui-text font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="h-px bg-border" />
              <p className="text-[5px] text-muted-foreground ui-text italic">{inheritedRace.flavor}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep('mother')} className="flex-1 py-2 px-3 border-2 border-border bg-card/60 text-muted-foreground text-[7px] hover:text-foreground" style={PX}>← BACK</button>
              <button
                data-testid="btn-start-game"
                onClick={handleStart}
                className="flex-1 py-3 px-4 pixel-border-green bg-primary/20 text-primary text-[8px] font-bold hover:bg-primary/30"
                style={PX}
              >
                BEGIN LIFE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
