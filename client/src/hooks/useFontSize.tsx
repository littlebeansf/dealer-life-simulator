import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type FontSizeLevel = 1 | 2 | 3 | 4 | 5;

interface FontSizeContextValue {
  level: FontSizeLevel;
  increase: () => void;
  decrease: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

const FontSizeContext = createContext<FontSizeContextValue>({
  level: 3,
  increase: () => {},
  decrease: () => {},
  canIncrease: true,
  canDecrease: true,
});

/**
 * Maps font size level → CSS multipliers applied via CSS custom properties.
 * Level 1 = smallest, Level 5 = largest.
 * These scale the two main font scales used in the game:
 *   --fs-px  : Press Start 2P (pixel headings, labels)
 *   --fs-ui  : Courier New / ui-text (descriptions, body)
 *   --btn-h  : min-height for buttons
 */
const LEVEL_VARS: Record<FontSizeLevel, { px: string; ui: string; btnH: string }> = {
  1: { px: '0.85',  ui: '0.8',   btnH: '28px'  },
  2: { px: '0.92',  ui: '0.9',   btnH: '32px'  },
  3: { px: '1',     ui: '1',     btnH: '36px'  }, // default
  4: { px: '1.15',  ui: '1.15',  btnH: '42px'  },
  5: { px: '1.35',  ui: '1.3',   btnH: '50px'  },
};

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<FontSizeLevel>(3);

  const applyLevel = useCallback((l: FontSizeLevel) => {
    const vars = LEVEL_VARS[l];
    const root = document.documentElement;
    root.style.setProperty('--fs-scale-px', vars.px);
    root.style.setProperty('--fs-scale-ui', vars.ui);
    root.style.setProperty('--btn-min-h', vars.btnH);
  }, []);

  useEffect(() => { applyLevel(level); }, [level, applyLevel]);

  const increase = () => setLevel(l => Math.min(5, l + 1) as FontSizeLevel);
  const decrease = () => setLevel(l => Math.max(1, l - 1) as FontSizeLevel);

  return (
    <FontSizeContext.Provider value={{ level, increase, decrease, canIncrease: level < 5, canDecrease: level > 1 }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}
