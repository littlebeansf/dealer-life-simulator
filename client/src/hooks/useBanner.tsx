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
  dismissBanner: () => void;
}

const BannerContext = createContext<BannerContextValue>({
  banner: null,
  showBanner: () => {},
  dismissBanner: () => {},
});

export function BannerProvider({ children }: { children: ReactNode }) {
  const [banner, setBanner] = useState<BannerState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissBanner = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBanner(null);
  }, []);

  const showBanner = useCallback((message: string, type: BannerType = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBanner({ message, type, id: Date.now() });
    // Auto-dismiss after 6 seconds — user can also tap ✕
    timerRef.current = setTimeout(() => setBanner(null), 6000);
  }, []);

  return (
    <BannerContext.Provider value={{ banner, showBanner, dismissBanner }}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  return useContext(BannerContext);
}
