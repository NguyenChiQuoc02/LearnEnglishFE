import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/app/utils/languages/en.json";
import vi from "@/app/utils/languages/vi.json";
import { DEFAULT_LANGUAGE } from "@/app/constants/language.constants";

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

// Always initialize with the default language so the client's first render
// matches the server-rendered HTML; the persisted language (if any) is
// applied afterwards, once mounted, via useSyncStoredLanguage.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
