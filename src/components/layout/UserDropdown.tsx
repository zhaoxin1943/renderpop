"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconCrown,
  IconLoader2,
  IconLogout2,
  IconUserCircle,
  IconSparkles,
  IconCreditCard,
  IconWorld,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nContext";
import { locales, languageNames, type Locale } from "@/i18n/config";

function getDisplayName(user: { display_name: string | null; email: string | null }) {
  if (user.display_name && user.display_name.trim()) {
    return user.display_name;
  }
  if (user.email) {
    return user.email.split("@")[0];
  }
  return "RenderPop User";
}

function getAvatarInitial(user: { display_name: string | null; email: string | null }) {
  const name = getDisplayName(user);
  return name.charAt(0).toUpperCase();
}

export function UserDropdown() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showLangSubmenu, setShowLangSubmenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside & Esc key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowLangSubmenu(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowLangSubmenu(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsOpen(false);
      router.replace("/");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  const name = getDisplayName(user);
  const initial = getAvatarInitial(user);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Avatar Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t("auth.account")}
        className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-zinc-900 text-white transition hover:border-white/40 active:scale-95 focus:outline-none"
      >
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar_url} alt={name} className="size-full object-cover" referrerPolicy="no-referrer" />
        ) : initial ? (
          <span className="brand-cta flex size-full items-center justify-center text-sm font-semibold text-white">
            {initial}
          </span>
        ) : (
          <IconUserCircle size={22} />
        )}
      </button>

      {/* Popover Card (Right-aligned, Card UI inspired by competitors) */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-[calc(100vw-2rem)] sm:w-80 max-w-[340px] origin-top-right rounded-2xl border border-white/[0.12] bg-[#141417]/98 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Profile Info & Upgrade Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-zinc-900 text-white">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={name} className="size-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="brand-cta flex size-full items-center justify-center text-base font-bold text-white">
                    {initial}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white tracking-tight">{name}</p>
                <p className="truncate text-xs font-normal text-zinc-400 mt-0.5">
                  {user.email || "RenderPop User"}
                </p>
              </div>
            </div>

            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="brand-cta shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95"
            >
              {t("auth.upgrade")}
            </Link>
          </div>

          {/* Membership Status & Credits Card */}
          <div className="mt-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">{t("auth.plan")}</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                <IconCrown size={12} className="shrink-0" />
                {t("auth.freePlan")}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-300 pt-2 border-t border-white/[0.05]">
              <span className="text-zinc-400">{t("common.freeDailyFast")}</span>
              <span className="font-medium text-emerald-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop + Mobile Unified) */}
          <div className="mt-3 space-y-0.5 border-t border-white/[0.08] pt-2">
            <Link
              href="/create"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white active:bg-white/[0.1]"
            >
              <IconSparkles size={18} className="text-zinc-400 shrink-0" />
              <span>{t("nav.create")}</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white active:bg-white/[0.1]"
            >
              <IconCreditCard size={18} className="text-zinc-400 shrink-0" />
              <span>{t("nav.pricing")}</span>
            </Link>

            {/* Language Selection Submenu Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowLangSubmenu((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white active:bg-white/[0.1]"
              >
                <div className="flex items-center gap-3">
                  <IconWorld size={18} className="text-zinc-400 shrink-0" />
                  <span>Language ({locale.toUpperCase()})</span>
                </div>
                <IconChevronDown
                  size={16}
                  className={`text-zinc-400 transition-transform ${showLangSubmenu ? "rotate-180" : ""}`}
                />
              </button>

              {/* Submenu for Language */}
              {showLangSubmenu && (
                <div className="ml-7 my-1 space-y-1 rounded-lg bg-black/40 p-1.5 border border-white/[0.05]">
                  {locales.map((l: Locale) => {
                    const lang = languageNames[l];
                    const isSelected = locale === l;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setLocale(l);
                          setShowLangSubmenu(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                          isSelected
                            ? "bg-white/[0.1] text-white"
                            : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        {isSelected && <IconCheck size={14} className="text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-white/[0.08]" />

          {/* Sign Out Action */}
          <div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-wait disabled:opacity-50"
            >
              {isSigningOut ? (
                <IconLoader2 size={18} className="animate-spin text-zinc-400 shrink-0" />
              ) : (
                <IconLogout2 size={18} className="shrink-0" />
              )}
              <span>{t("auth.signOut")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
