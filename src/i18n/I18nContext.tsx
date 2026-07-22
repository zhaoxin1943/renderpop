"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "./config";
import { defaultLocale } from "./config";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";

type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  es,
};

type TranslationNode = string | { [key: string]: TranslationNode };

function lookupTranslation(dictionary: Dictionary, keyPath: string): string | undefined {
  const value = keyPath.split(".").reduce<TranslationNode | undefined>((current, key) => {
    if (!current || typeof current === "string") return undefined;
    return current[key];
  }, dictionary as TranslationNode);
  return typeof value === "string" ? value : undefined;
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string) => string;
  dictionary: Dictionary;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const saved = localStorage.getItem("renderpop_locale") as Locale;
    let initial: Locale = defaultLocale;
    if (saved === "en" || saved === "es") {
      initial = saved;
    } else if (navigator.language.slice(0, 2) === "es") {
      initial = "es";
    }
    if (initial !== defaultLocale) {
      setLocaleState(initial);
      document.documentElement.lang = initial;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("renderpop_locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (keyPath: string): string => {
    const dict = dictionaries[locale] || dictionaries[defaultLocale];
    return lookupTranslation(dict, keyPath) ?? lookupTranslation(dictionaries.en, keyPath) ?? keyPath;
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dictionary: dictionaries[locale] || dictionaries.en,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
