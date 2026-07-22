"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export function Header() {
  const { t } = useI18n();

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
          <Link
            href="/sign-in"
            className="ml-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/[0.06] sm:px-4 sm:text-sm"
          >
            {t("common.signIn")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
