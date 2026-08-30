import { DEFAULT_PRIMARY_COLOR } from "@/app/constants/theme.constants";

const STORAGE_KEY = "learn-english-theme-color";
const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

export function getThemeColor(): string {
  if (typeof window === "undefined") return DEFAULT_PRIMARY_COLOR;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && HEX_COLOR_REGEX.test(stored) ? stored : DEFAULT_PRIMARY_COLOR;
}

export function saveThemeColor(color: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, color);
}
