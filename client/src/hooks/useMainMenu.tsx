import { createContext, useContext, type ReactNode } from 'react';

const MainMenuCtx = createContext<(() => void) | undefined>(undefined);

export function MainMenuProvider({ onMainMenu, children }: { onMainMenu: () => void; children: ReactNode }) {
  return <MainMenuCtx.Provider value={onMainMenu}>{children}</MainMenuCtx.Provider>;
}

export function useMainMenu(): (() => void) | undefined {
  return useContext(MainMenuCtx);
}
