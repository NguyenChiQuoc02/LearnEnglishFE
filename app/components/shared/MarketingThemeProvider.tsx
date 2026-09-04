"use client";

import { useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createLandingTheme } from "@/app/theme/landingTheme";

export default function MarketingThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useMemo(() => createLandingTheme(), []);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
