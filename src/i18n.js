/* eslint-env node */
import { defaultLangKey } from "../languages";

export const codeToLanguage = (code) =>
  ({
    en: "English",
    es: "Spanish",
    zh: "Chinese",
    ko: "Korean",
    ar: "Arabic",
    bn: "Bengali",
    ca: "Catalan",
    da: "Danish",
    nl: "Dutch",
    fi: "Finnish",
    fr: "French",
    de: "German",
    el: "Greek",
    hi: "Hindi",
    hu: "Hungarian",
  }[code]);

export const createLanguageLink = (slug, lang) => {
  const rawSlug = slug.replace(`${lang}/`, "");

  return (targetLang) =>
    targetLang === defaultLangKey ? rawSlug : `/${targetLang}${rawSlug}`;
};
