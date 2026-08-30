import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from "@/app/constants/language.constants";

const STORAGE_KEY = "learn-english-language";

function isLanguageCode(value: string | null): value is LanguageCode {
  return !!value && LANGUAGES.some((language) => language.code === value);
}

export function getLanguage(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLanguageCode(stored) ? stored : DEFAULT_LANGUAGE;
}

export function saveLanguage(language: LanguageCode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, language);
}
