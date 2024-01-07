import i18next from "i18next";
import type { Resource } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./translation/en.json";
import vi from "./translation/vi.json";

export const translationsJson: Resource = {
  en: {
    translation: en,
  },

  vi: {
    translation: vi,
  },
};

export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: translationsJson,
    lng: "vi",
    fallbackLng: "vi",
    // debug: import.meta.env.DEV,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });
