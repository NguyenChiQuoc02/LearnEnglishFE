import { DEFAULT_PRIMARY_COLOR } from "@/app/constants/theme.constants";

const STORAGE_KEY = "learn-english-theme-color";
const MODE_STORAGE_KEY = "learn-english-theme-mode";
const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

export type ThemeMode = "light" | "dark";

export function getThemeColor(): string {
  if (typeof window === "undefined") return DEFAULT_PRIMARY_COLOR;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && HEX_COLOR_REGEX.test(stored) ? stored : DEFAULT_PRIMARY_COLOR;
}

export function saveThemeColor(color: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, color);
}

// Falls back to the OS/browser color-scheme preference when the user hasn't picked one yet,
// so a first-time visitor with a dark-mode OS doesn't get a jarring light flash.
export function getThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function saveThemeMode(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MODE_STORAGE_KEY, mode);
}
