"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "./theme";
import { DEFAULT_PRIMARY_COLOR } from "@/app/constants/theme.constants";
import { getThemeColor, getThemeMode, saveThemeColor, saveThemeMode, type ThemeMode } from "@/app/utils/theme-color-storage";

type ThemeColorContextValue = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  mode: ThemeMode;
  toggleMode: () => void;
};

const ThemeColorContext = createContext<ThemeColorContextValue | null>(null);

export function useThemeColor() {
  const ctx = useContext(ThemeColorContext);
  if (!ctx) {
    throw new Error("useThemeColor must be used within ThemeColorProvider");
  }
  return ctx;
}

export default function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  // Must start from the same default on server and client — reading localStorage
  // in the initializer would make the client's first render diverge from the
  // server-rendered HTML and trigger a React hydration mismatch. The real color
  // is applied right after mount instead (see effect below).
  const [primaryColor, setPrimaryColorState] = useState(DEFAULT_PRIMARY_COLOR);
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    setPrimaryColorState(getThemeColor());
    setMode(getThemeMode());
  }, []);

  function setPrimaryColor(color: string) {
    setPrimaryColorState(color);
    saveThemeColor(color);
  }

  function toggleMode() {
    setMode((prev) => {
      const next: ThemeMode = prev === "light" ? "dark" : "light";
      saveThemeMode(next);
      return next;
    });
  }

  const theme = useMemo(() => createAppTheme(primaryColor, mode), [primaryColor, mode]);

  return (
    <ThemeColorContext.Provider value={{ primaryColor, setPrimaryColor, mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeColorContext.Provider>
  );
}
