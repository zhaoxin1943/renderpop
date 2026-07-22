"use client";

import { useState, useRef, useEffect } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { useI18n } from "@/i18n/I18nContext";
import type { Locale } from "@/i18n/config";
import { locales, languageNames } from "@/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-zinc-300 transition hover:text-white"
        aria-expanded={isOpen}
      >
        <span>{locale.toUpperCase()}</span>
        <IconChevronDown className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} stroke={1.75} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-36 origin-top-right rounded-lg border border-white/10 bg-[#18181b] p-1 shadow-2xl focus:outline-none">
          {locales.map((l: Locale) => {
            const lang = languageNames[l];
            const isSelected = locale === l;
            return (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition ${
                  isSelected
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className="text-[10px] uppercase text-zinc-500">{l}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
