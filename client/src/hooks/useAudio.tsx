import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

interface AudioContextValue {
  musicEnabled: boolean;
  volume: number;
  toggleMusic: () => void;
  setVolume: (v: number) => void;
  playSfx: (type: SfxType) => void;
}

export type SfxType = 'buy' | 'sell' | 'travel' | 'levelup' | 'click' | 'error' | 'event' | 'coin';

const AudioCtx = createContext<AudioContextValue>({
  musicEnabled: true,
  volume: 0.35,
  toggleMusic: () => {},
  setVolume: () => {},
  playSfx: () => {},
});

// ─── RPG Musical Loop ────────────────────────────────────────────────────────
// A looping 8-bar minor pentatonic melody with bass, percussion, and pad layers.
// Inspired by classic underground RPG tavern/dungeon themes.

type Note = { freq: number; time: number; dur: number; vel: number };

const A_MINOR_PENT = [220, 261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3, 784];
// melody pattern indices (0-based into scale)
const MELODY: Note[] = [
  { freq: A_MINOR_PENT[0], time: 0,     dur: 0.3, vel: 0.7 },
  { freq: A_MINOR_PENT[2], time: 0.5,   dur: 0.2, vel: 0.6 },
  { freq: A_MINOR_PENT[4], time: 1.0,   dur: 0.4, vel: 0.8 },
  { freq: A_MINOR_PENT[3], time: 1.6,   dur: 0.2, vel: 0.5 },
  { freq: A_MINOR_PENT[2], time: 2.0,   dur: 0.3, vel: 0.7 },
  { freq: A_MINOR_PENT[5], time: 2.5,   dur: 0.5, vel: 0.9 },
  { freq: A_MINOR_PENT[4], time: 3.2,   dur: 0.2, vel: 0.6 },
  { freq: A_MINOR_PENT[3], time: 3.6,   dur: 0.3, vel: 0.7 },
  { freq: A_MINOR_PENT[2], time: 4.0,   dur: 0.4, vel: 0.8 },
  { freq: A_MINOR_PENT[0], time: 4.6,   dur: 0.2, vel: 0.5 },
  { freq: A_MINOR_PENT[1], time: 5.0,   dur: 0.3, vel: 0.6 },
  { freq: A_MINOR_PENT[3], time: 5.5,   dur: 0.4, vel: 0.8 },
  { freq: A_MINOR_PENT[6], time: 6.0,   dur: 0.6, vel: 0.9 },
  { freq: A_MINOR_PENT[5], time: 6.8,   dur: 0.2, vel: 0.5 },
  { freq: A_MINOR_PENT[4], time: 7.2,   dur: 0.3, vel: 0.7 },
  { freq: A_MINOR_PENT[2], time: 7.6,   dur: 0.4, vel: 0.8 },
];
const LOOP_DURATION = 8.0; // seconds per loop

// Bass line (root + fifth alternation)
const BASS_LINE: Note[] = [
  { freq: 55,    time: 0,   dur: 0.4, vel: 0.6 },
  { freq: 82.4,  time: 0.5, dur: 0.3, vel: 0.4 },
  { freq: 55,    time: 1.0, dur: 0.4, vel: 0.5 },
  { freq: 65.4,  time: 2.0, dur: 0.4, vel: 0.6 },
  { freq: 55,    time: 3.0, dur: 0.4, vel: 0.5 },
  { freq: 82.4,  time: 3.5, dur: 0.3, vel: 0.4 },
  { freq: 65.4,  time: 4.0, dur: 0.4, vel: 0.6 },
  { freq: 55,    time: 5.0, dur: 0.4, vel: 0.5 },
  { freq: 73.4,  time: 6.0, dur: 0.4, vel: 0.6 },
  { freq: 55,    time: 7.0, dur: 0.6, vel: 0.5 },
];

function scheduleNote(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  velocity: number,
  type: OscillatorType = 'triangle',
  attackTime = 0.02,
  releaseTime = 0.05
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(velocity, startTime + attackTime);
  gain.gain.setValueAtTime(velocity, startTime + duration - releaseTime);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

function createPercussion(ctx: AudioContext, dest: AudioNode, startTime: number, vel: number) {
  // Low kick-like thud via noise
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;
  gain.gain.setValueAtTime(vel * 0.4, startTime);
  gain.gain.linearRampToValueAtTime(0, startTime + 0.15);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  src.start(startTime);
}

// Percussion pattern (kick on beats 1 & 3, light hit on 2 & 4)
const PERC_PATTERN = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5];
const PERC_VELS =    [0.9, 0.4, 0.7, 0.3, 0.9, 0.4, 0.7, 0.3, 0.9, 0.4, 0.7, 0.3, 0.9, 0.4, 0.7, 0.3];

function scheduleLoop(ctx: AudioContext, master: GainNode, loopStart: number): ReturnType<typeof setTimeout> {
  // Melody (triangle wave, filtered through reverb-ish delay)
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.25;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.18;
  const melGain = ctx.createGain();
  melGain.gain.value = 0.22;
  melGain.connect(master);
  melGain.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(master);

  MELODY.forEach(n => {
    scheduleNote(ctx, melGain, n.freq, loopStart + n.time, n.dur, n.vel, 'triangle');
  });

  // Bass (square wave, quiet)
  const bassGain = ctx.createGain();
  bassGain.gain.value = 0.12;
  const bassFilter = ctx.createBiquadFilter();
  bassFilter.type = 'lowpass';
  bassFilter.frequency.value = 400;
  bassGain.connect(bassFilter);
  bassFilter.connect(master);
  BASS_LINE.forEach(n => {
    scheduleNote(ctx, bassGain, n.freq, loopStart + n.time, n.dur, n.vel, 'square', 0.05, 0.08);
  });

  // Pad (long sine chords for atmosphere)
  const padGain = ctx.createGain();
  padGain.gain.value = 0.06;
  padGain.connect(master);
  [0, 2, 4].forEach(bar => {
    scheduleNote(ctx, padGain, 110, loopStart + bar * 2, 1.8, 0.9, 'sine', 0.3, 0.4);
    scheduleNote(ctx, padGain, 146.8, loopStart + bar * 2, 1.8, 0.7, 'sine', 0.3, 0.4);
  });

  // Percussion
  PERC_PATTERN.forEach((t, i) => {
    createPercussion(ctx, master, loopStart + t, PERC_VELS[i]);
  });

  // Schedule next loop slightly before this one ends
  const msUntilNext = (LOOP_DURATION - 0.1) * 1000;
  return setTimeout(() => {
    const nextStart = loopStart + LOOP_DURATION;
    scheduleLoop(ctx, master, nextStart);
  }, msUntilNext);
}

// ─── SFX ─────────────────────────────────────────────────────────────────────

function playSfxInternal(ctx: AudioContext, type: SfxType, volume: number) {
  const now = ctx.currentTime;
  const vol = volume * 0.6;

  switch (type) {
    case 'coin':
    case 'buy': {
      // Two ascending coin tones
      [523.3, 659.3].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.08, 0.15, vol * 0.7, 'triangle', 0.01, 0.05);
      });
      break;
    }
    case 'sell': {
      // Three ascending coin tones — "ka-ching"
      [392, 523.3, 784].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.07, 0.18, vol * 0.7, 'triangle', 0.01, 0.05);
      });
      break;
    }
    case 'travel': {
      // Swoosh: descending + ascending
      [440, 329.6, 392, 523.3].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.09, 0.2, vol * 0.5, 'sine', 0.02, 0.1);
      });
      break;
    }
    case 'levelup': {
      // Fanfare arpeggio
      [261.6, 329.6, 392, 523.3, 659.3, 784].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.1, 0.25, vol * 0.8, 'triangle', 0.01, 0.1);
      });
      break;
    }
    case 'event': {
      // Two-note ding
      [587.3, 493.9].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.15, 0.3, vol * 0.6, 'sine', 0.01, 0.15);
      });
      break;
    }
    case 'error': {
      // Low buzz
      scheduleNote(ctx, ctx.destination, 110, now, 0.3, vol * 0.5, 'sawtooth', 0.01, 0.1);
      scheduleNote(ctx, ctx.destination, 98.0, now + 0.1, 0.2, vol * 0.4, 'sawtooth', 0.01, 0.1);
      break;
    }
    case 'click': {
      // Tiny blip
      scheduleNote(ctx, ctx.destination, 880, now, 0.06, vol * 0.4, 'square', 0.005, 0.02);
      break;
    }
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AudioProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const getOrCreateCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return { ctx: audioCtxRef.current, master: masterGainRef.current! };
  }, [volume]);

  const startMusic = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const { ctx, master } = getOrCreateCtx();
    const loopStart = ctx.currentTime + 0.1;
    loopTimerRef.current = scheduleLoop(ctx, master, loopStart);
  }, [getOrCreateCtx]);

  const stopMusic = useCallback(() => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    masterGainRef.current = null;
    startedRef.current = false;
  }, []);

  // Start on first user interaction
  useEffect(() => {
    if (!musicEnabled) return;
    const handler = () => {
      if (!startedRef.current) startMusic();
    };
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [musicEnabled, startMusic]);

  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => {
      if (prev) {
        stopMusic();
      } else {
        startedRef.current = false;
      }
      return !prev;
    });
  }, [stopMusic]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(v, audioCtxRef.current.currentTime, 0.05);
    }
  }, []);

  const playSfx = useCallback((type: SfxType) => {
    const { ctx } = getOrCreateCtx();
    playSfxInternal(ctx, type, volume);
  }, [getOrCreateCtx, volume]);

  return (
    <AudioCtx.Provider value={{ musicEnabled, volume, toggleMusic, setVolume, playSfx }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
