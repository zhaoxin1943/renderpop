"use client";

import Image from "next/image";
import Link from "next/link";
import { IconLogout2, IconUserCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export function Header() {
  const { t } = useI18n();
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050505]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
          <Image
            src="/renderpop-logo.png"
            alt=""
            width={36}
            height={36}
            priority
            className="size-8 object-contain"
          />
          <span className="text-[17px] font-semibold tracking-[-0.035em]">RenderPop</span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-2" aria-label="Primary">
          <Link
            href="/#create"
            className="hidden px-3 py-2 text-sm text-zinc-400 transition hover:text-white sm:inline-flex"
          >
            {t("nav.create")}
          </Link>
          <Link
            href="/#examples"
            className="hidden px-3 py-2 text-sm text-zinc-400 transition hover:text-white sm:inline-flex"
          >
            {t("nav.explore")}
          </Link>
          <Link
            href="/pricing"
            className="hidden px-3 py-2 text-sm text-zinc-400 transition hover:text-white md:inline-flex"
          >
            {t("nav.pricing")}
          </Link>
          <div className="ml-1 sm:ml-3">
            <LanguageSwitcher />
          </div>
          {user ? (
            <div className="ml-2 flex items-center gap-1.5">
              <Link
                href="/account"
                aria-label={t("auth.account")}
                className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06] text-zinc-200 transition hover:border-white/30 hover:text-white"
              >
                {user.avatar_url ? (
                  // Google avatars are external and should not be optimized by Next here.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <IconUserCircle size={21} />
                )}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                aria-label={t("auth.signOut")}
                className="hidden size-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-wait sm:flex"
              >
                <IconLogout2 size={17} className={isSigningOut ? "animate-pulse" : ""} />
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              aria-busy={isLoading}
              className="ml-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/[0.06] sm:px-4 sm:text-sm"
            >
              {t("common.signIn")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
