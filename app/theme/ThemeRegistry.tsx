"use client";

import { useEffect } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import i18n from "@/app/utils/i18n";
import { getLanguage } from "@/app/utils/language-storage";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const storedLanguage = getLanguage();
    if (storedLanguage !== i18n.language) {
      i18n.changeLanguage(storedLanguage);
    }
    document.documentElement.lang = storedLanguage;
  }, []);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
