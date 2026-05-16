import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

interface AudioContextValue {
  musicEnabled: boolean;
  volume: number;
  toggleMusic: () => void;
  setVolume: (v: number) => void;
}

const AudioCtx = createContext<AudioContextValue>({
  musicEnabled: true,
  volume: 0.35,
  toggleMusic: () => {},
  setVolume: () => {},
});

// A simple looping RPG-style ambient track generated via Web Audio API
// (no external file needed — works on GitHub Pages with no assets)
function createAmbientMusic(ctx: AudioContext, masterGain: GainNode): () => void {
  const nodes: AudioNode[] = [];

  // Bass drone
  const bassOsc = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bassOsc.type = 'sine';
  bassOsc.frequency.value = 55; // A1
  bassGain.gain.value = 0.15;
  bassOsc.connect(bassGain);
  bassGain.connect(masterGain);
  bassOsc.start();
  nodes.push(bassOsc, bassGain);

  // Mid drone
  const midOsc = ctx.createOscillator();
  const midGain = ctx.createGain();
  midOsc.type = 'triangle';
  midOsc.frequency.value = 110; // A2
  midGain.gain.value = 0.08;
  midOsc.connect(midGain);
  midGain.connect(masterGain);
  midOsc.start();
  nodes.push(midOsc, midGain);

  // Eerie high pad
  const padOsc = ctx.createOscillator();
  const padGain = ctx.createGain();
  padOsc.type = 'sine';
  padOsc.frequency.value = 165; // E3
  padGain.gain.value = 0.04;
  padOsc.connect(padGain);
  padGain.connect(masterGain);
  padOsc.start();
  nodes.push(padOsc, padGain);

  // Subtle flutter / tremolo via LFO
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.3;
  lfoGain.gain.value = 0.03;
  lfo.connect(lfoGain);
  lfoGain.connect(padGain.gain);
  lfo.start();
  nodes.push(lfo, lfoGain);

  // Reverb-like convolver using noise buffer
  const convolver = ctx.createConvolver();
  const bufLen = ctx.sampleRate * 2;
  const impulse = ctx.createBuffer(2, bufLen, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2);
    }
  }
  convolver.buffer = impulse;
  const convGain = ctx.createGain();
  convGain.gain.value = 0.2;
  midOsc.connect(convolver);
  convolver.connect(convGain);
  convGain.connect(masterGain);
  nodes.push(convolver, convGain);

  return () => {
    nodes.forEach(n => {
      try { (n as OscillatorNode).stop?.(); } catch (_) {}
      try { n.disconnect(); } catch (_) {}
    });
  };
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.35);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const startedRef = useRef(false);

  const startMusic = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = master;
    stopRef.current = createAmbientMusic(ctx, master);
  };

  const stopMusic = () => {
    stopRef.current?.();
    stopRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    masterGainRef.current = null;
    startedRef.current = false;
  };

  // Start on first user interaction if enabled
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
  }, [musicEnabled]);

  // Toggle
  const toggleMusic = () => {
    setMusicEnabled(prev => {
      if (prev) {
        stopMusic();
      } else {
        startedRef.current = false; // allow restart
      }
      return !prev;
    });
  };

  // Volume change
  const setVolume = (v: number) => {
    setVolumeState(v);
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(v, audioCtxRef.current!.currentTime, 0.05);
    }
  };

  return (
    <AudioCtx.Provider value={{ musicEnabled, volume, toggleMusic, setVolume }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
