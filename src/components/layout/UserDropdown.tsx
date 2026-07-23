"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconCrown, IconLoader2, IconLogout2, IconUserCircle } from "@tabler/icons-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nContext";

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
  const { t } = useI18n();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside & Esc key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
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

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2.5 w-76 origin-top-left rounded-2xl border border-white/[0.14] bg-[#141417] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50">
          {/* User Profile Header */}
          <div className="flex items-center gap-3.5 px-1 py-1">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-zinc-900 text-white">
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
              {user.email ? (
                <p className="truncate text-xs font-normal text-zinc-400 mt-0.5">{user.email}</p>
              ) : null}
            </div>
          </div>

          {/* Go Premium Upgrade Banner */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.09] bg-white/[0.03] px-3.5 py-3">
            <div className="flex items-center gap-2">
              <IconCrown size={19} className="text-[#d946a7] shrink-0" />
              <span className="text-sm font-medium text-white tracking-tight">
                {t("auth.goPremium")}
              </span>
            </div>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="brand-cta inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95"
            >
              {t("auth.upgrade")}
            </Link>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-white/[0.08]" />

          {/* Actions */}
          <div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-wait disabled:opacity-50"
            >
              {isSigningOut ? (
                <IconLoader2 size={18} className="animate-spin text-zinc-400 shrink-0" />
              ) : (
                <IconLogout2 size={18} className="text-zinc-400 shrink-0" />
              )}
              <span>{t("auth.signOut")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
