"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "./theme";
import { DEFAULT_PRIMARY_COLOR } from "@/app/constants/theme.constants";
import { getThemeColor, saveThemeColor } from "@/app/utils/theme-color-storage";

type ThemeColorContextValue = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
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
  const [primaryColor, setPrimaryColorState] = useState(DEFAULT_PRIMARY_COLOR);

  useEffect(() => {
    setPrimaryColorState(getThemeColor());
  }, []);

  function setPrimaryColor(color: string) {
    setPrimaryColorState(color);
    saveThemeColor(color);
  }

  const theme = useMemo(() => createAppTheme(primaryColor), [primaryColor]);

  return (
    <ThemeColorContext.Provider value={{ primaryColor, setPrimaryColor }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeColorContext.Provider>
  );
}
