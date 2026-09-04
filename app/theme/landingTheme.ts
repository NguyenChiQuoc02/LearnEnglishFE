import { createTheme } from "@mui/material/styles";

export const LANDING_PRIMARY = "#2563eb";
export const LANDING_SECONDARY = "#0ea5e9";
export const LANDING_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// Shared by every public marketing page (landing, practice, resources, about): a fixed
// brand blue and sans-serif face regardless of the logged-in app's theme color picker
// (indigo by default) or its serif typography — visitors haven't picked a theme yet.
//
// Built from scratch (not `createTheme(outerTheme, overrides)`): the app theme uses MUI's
// CSS-variables mode, so `outerTheme` already carries a resolved `theme.vars` tree pointing
// at the shared `var(--mui-palette-primary-main)`. Merging on top of that base theme keeps
// components reading `theme.vars.*` instead of the overridden `theme.palette.*`, so the
// color/font override silently never applies. A standalone theme has no `.vars` to fall back to.
export function createLandingTheme() {
  return createTheme({
    cssVariables: false,
    palette: {
      primary: { main: LANDING_PRIMARY },
      secondary: { main: LANDING_SECONDARY },
    },
    typography: { fontFamily: LANDING_FONT },
    shape: { borderRadius: 10 },
  });
}
