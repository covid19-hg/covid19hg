/* eslint-env node */
const defaultLangKey = "en";
const leftToRight = "leftToRight";
const rightToLeft = "rightToLeft";

exports.defaultLangKey = defaultLangKey;

exports.leftToRight = leftToRight;
exports.rightToLeft = rightToLeft;

exports.languages = new Map([
  ["en", { englishName: "English", nativeName: "", direction: leftToRight }],
  [
    "es",
    { englishName: "Spanish", nativeName: "Español", direction: leftToRight },
  ],
  [
    "zh",
    { englishName: "Chinese", nativeName: "汉语", direction: leftToRight },
  ],
  [
    "ko",
    { englishName: "Korean", nativeName: "조선말", direction: leftToRight },
  ],
  [
    "ar",
    { englishName: "Arabic", nativeName: "العربية", direction: rightToLeft },
  ],
  [
    "bn",
    { englishName: "Bengali", nativeName: "বাংলা", direction: leftToRight },
  ],
  [
    "ca",
    { englishName: "Catalan", nativeName: "Català", direction: leftToRight },
  ],
  [
    "da",
    { englishName: "Danish", nativeName: "Dansk", direction: leftToRight },
  ],
  [
    "nl",
    { englishName: "Dutch", nativeName: "Nederlands", direction: leftToRight },
  ],
  [
    "fi",
    { englishName: "Finnish", nativeName: "Suomi", direction: leftToRight },
  ],
  [
    "fr",
    { englishName: "French", nativeName: "Français", direction: leftToRight },
  ],
  [
    "de",
    { englishName: "German", nativeName: "Deutsch", direction: leftToRight },
  ],
  [
    "el",
    { englishName: "Greek", nativeName: "Ελληνικά", direction: leftToRight },
  ],
  [
    "hi",
    { englishName: "Hindi", nativeName: "हिन्दी", direction: leftToRight },
  ],
  [
    "hu",
    { englishName: "Hungarian", nativeName: "Magyar", direction: leftToRight },
  ],
  [
    "it",
    { englishName: "Italian", nativeName: "Italiano", direction: leftToRight },
  ],
  [
    "ja",
    { englishName: "Japanese", nativeName: "日本語", direction: leftToRight },
  ],
  [
    "ms",
    {
      englishName: "Malay",
      nativeName: "Bahasa Melayu",
      direction: leftToRight,
    },
  ],
  [
    "ro",
    { englishName: "Romanian", nativeName: "Română", direction: leftToRight },
  ],
  [
    "ru",
    { englishName: "Russian", nativeName: "Русский", direction: leftToRight },
  ],
  [
    "sr",
    { englishName: "Serbian", nativeName: "Српски", direction: leftToRight },
  ],
  [
    "sl",
    {
      englishName: "Slovenian",
      nativeName: "Slovenščina",
      direction: leftToRight,
    },
  ],
  [
    "sv",
    { englishName: "Swedish", nativeName: "Svenska", direction: leftToRight },
  ],
  ["ta", { englishName: "Tamil", nativeName: "தமிழ்", direction: leftToRight }],
  [
    "mk",
    {
      englishName: "Macedonian",
      nativeName: "Mакедонски",
      direction: leftToRight,
    },
  ],
  [
    "pl",
    { englishName: "Polish", nativeName: "Polski", direction: leftToRight },
  ],
]);

exports.createLanguageLink = (slug, lang) => {
  const rawSlug = slug.replace(`${lang}/`, "");

  return (targetLang) =>
    targetLang === defaultLangKey ? rawSlug : `/${targetLang}${rawSlug}`;
};
