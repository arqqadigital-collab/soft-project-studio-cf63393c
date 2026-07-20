import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type AltPaths = { en?: string | null; ar?: string | null };

type Ctx = {
  alt: AltPaths;
  setAlt: (a: AltPaths) => void;
};

const AltLanguagePathContext = createContext<Ctx | null>(null);

export function AltLanguagePathProvider({ children }: { children: ReactNode }) {
  const [alt, setAlt] = useState<AltPaths>({});
  const { pathname } = useLocation();
  // Clear on route change so stale counterparts don't leak between pages.
  useEffect(() => {
    setAlt({});
  }, [pathname]);
  return (
    <AltLanguagePathContext.Provider value={{ alt, setAlt }}>
      {children}
    </AltLanguagePathContext.Provider>
  );
}

export function useAltLanguagePath(): AltPaths {
  return useContext(AltLanguagePathContext)?.alt ?? {};
}

/** Detail pages call this to publish EN/AR counterpart URLs for the language switcher. */
export function useSetAltLanguagePath(paths: AltPaths) {
  const ctx = useContext(AltLanguagePathContext);
  const key = `${paths.en ?? ""}|${paths.ar ?? ""}`;
  const last = useRef("");
  useEffect(() => {
    if (!ctx) return;
    if (last.current === key) return;
    last.current = key;
    ctx.setAlt(paths);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
