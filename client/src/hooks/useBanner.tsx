import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

export type BannerType = 'success' | 'error' | 'warning' | 'info';

interface BannerState {
  message: string;
  type: BannerType;
  id: number;
}

interface BannerContextValue {
  banner: BannerState | null;
  showBanner: (message: string, type?: BannerType) => void;
}

const BannerContext = createContext<BannerContextValue>({
  banner: null,
  showBanner: () => {},
});

export function BannerProvider({ children }: { children: ReactNode }) {
  const [banner, setBanner] = useState<BannerState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((message: string, type: BannerType = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBanner({ message, type, id: Date.now() });
    timerRef.current = setTimeout(() => setBanner(null), 2500);
  }, []);

  return (
    <BannerContext.Provider value={{ banner, showBanner }}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  return useContext(BannerContext);
}
