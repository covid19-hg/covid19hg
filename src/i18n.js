/* eslint-env node */
import { defaultLangKey } from "../languages";

export const codeToLanguage = (code) =>
  ({
    en: "English",
    es: "Spanish",
    zh: "Chinese",
    ko: "Korean",
  }[code]);

export const createLanguageLink = (slug, lang) => {
  const rawSlug = slug.replace(`${lang}/`, "");

  return (targetLang) =>
    targetLang === defaultLangKey ? rawSlug : `/${targetLang}${rawSlug}`;
};
