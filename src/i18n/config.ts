export type Locale = "en" | "es";

export const defaultLocale: Locale = "en";

export const locales: Locale[] = ["en", "es"];

export const languageNames: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English", nativeName: "English", flag: "🇺🇸" },
  es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
};
