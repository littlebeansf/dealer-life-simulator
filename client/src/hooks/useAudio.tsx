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

// ─── Background music ────────────────────────────────────────────────────────
// "Black Market Docks" by Sebastian Fries (Suno AI)
// https://suno.com/s/JUvCBuxn90rkNkBZ
// Copyright © Sebastian Fries. All rights reserved.
// Use BASE_URL so the path is always relative to the app's root,
// regardless of whether it's deployed at / or a subdirectory (e.g. /game/).
const MUSIC_SRC = `${import.meta.env.BASE_URL}black_market_docks.mp3`;

// ─── SFX via Web Audio API ───────────────────────────────────────────────────

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

function playSfxInternal(ctx: AudioContext, type: SfxType, volume: number) {
  const now = ctx.currentTime;
  const vol = volume * 0.6;

  switch (type) {
    case 'coin':
    case 'buy': {
      [523.3, 659.3].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.08, 0.15, vol * 0.7, 'triangle', 0.01, 0.05);
      });
      break;
    }
    case 'sell': {
      [392, 523.3, 784].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.07, 0.18, vol * 0.7, 'triangle', 0.01, 0.05);
      });
      break;
    }
    case 'travel': {
      [440, 329.6, 392, 523.3].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.09, 0.2, vol * 0.5, 'sine', 0.02, 0.1);
      });
      break;
    }
    case 'levelup': {
      [261.6, 329.6, 392, 523.3, 659.3, 784].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.1, 0.25, vol * 0.8, 'triangle', 0.01, 0.1);
      });
      break;
    }
    case 'event': {
      [587.3, 493.9].forEach((freq, i) => {
        scheduleNote(ctx, ctx.destination, freq, now + i * 0.15, 0.3, vol * 0.6, 'sine', 0.01, 0.15);
      });
      break;
    }
    case 'error': {
      scheduleNote(ctx, ctx.destination, 110, now, 0.3, vol * 0.5, 'sawtooth', 0.01, 0.1);
      scheduleNote(ctx, ctx.destination, 98.0, now + 0.1, 0.2, vol * 0.4, 'sawtooth', 0.01, 0.1);
      break;
    }
    case 'click': {
      scheduleNote(ctx, ctx.destination, 880, now, 0.06, vol * 0.4, 'square', 0.005, 0.02);
      break;
    }
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AudioProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.3);

  // HTMLAudioElement for background music
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);

  // Web Audio context for SFX only
  const sfxCtxRef = useRef<AudioContext | null>(null);

  // ── Initialise the audio element once ──────────────────────────────────────
  useEffect(() => {
    const el = new Audio(MUSIC_SRC);
    el.loop = true;
    el.volume = volume * 0.85; // slightly duck so SFX cut through
    el.preload = 'auto';
    audioElRef.current = el;

    return () => {
      el.pause();
      el.src = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep volume in sync
  useEffect(() => {
    if (audioElRef.current) {
      audioElRef.current.volume = Math.min(1, volume * 0.85);
    }
  }, [volume]);

  // ── Start on first user interaction (browser autoplay policy) ──────────────
  useEffect(() => {
    if (!musicEnabled) return;
    const tryPlay = () => {
      if (playingRef.current) return;
      const el = audioElRef.current;
      if (!el) return;
      el.play().then(() => {
        playingRef.current = true;
      }).catch(() => {
        // Autoplay blocked — will retry on next interaction
      });
    };
    window.addEventListener('click', tryPlay, { once: true });
    window.addEventListener('keydown', tryPlay, { once: true });
    return () => {
      window.removeEventListener('click', tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
  }, [musicEnabled]);

  // ── Toggle music on/off ────────────────────────────────────────────────────
  const toggleMusic = useCallback(() => {
    setMusicEnabled(prev => {
      const next = !prev;
      const el = audioElRef.current;
      if (!el) return next;
      if (next) {
        el.play().then(() => { playingRef.current = true; }).catch(() => {});
      } else {
        el.pause();
        playingRef.current = false;
      }
      return next;
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
  }, []);

  // ── SFX ───────────────────────────────────────────────────────────────────
  const getSfxCtx = useCallback(() => {
    if (!sfxCtxRef.current) {
      sfxCtxRef.current = new AudioContext();
    }
    if (sfxCtxRef.current.state === 'suspended') {
      sfxCtxRef.current.resume();
    }
    return sfxCtxRef.current;
  }, []);

  const playSfx = useCallback((type: SfxType) => {
    try {
      const ctx = getSfxCtx();
      playSfxInternal(ctx, type, volume);
    } catch {
      // Silently ignore if AudioContext unavailable
    }
  }, [getSfxCtx, volume]);

  return (
    <AudioCtx.Provider value={{ musicEnabled, volume, toggleMusic, setVolume, playSfx }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
