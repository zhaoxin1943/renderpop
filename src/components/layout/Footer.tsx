"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-white/[0.07] bg-[#050505] text-xs text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Image src="/renderpop-logo.png" alt="" width={32} height={32} className="size-6 object-contain" />
              RenderPop
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">
              {t("footer.description")}
            </p>
            <div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Col 2: Free Tools */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
              {t("footer.toolsTitle")}
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t("footer.toolImageGen")}
                </Link>
              </li>
              <li>
                <Link href="/#create" className="hover:text-white transition">
                  {t("footer.toolNoSignUp")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Product */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
              {t("footer.linksTitle")}
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t("nav.create")}
                </Link>
              </li>
              <li>
                <Link href="/#examples" className="hover:text-white transition">
                  {t("nav.explore")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  {t("nav.pricing")}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition">
                  {t("nav.faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-300">
              {t("footer.legalTitle")}
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  {t("footer.privacy")}
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  {t("footer.terms")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.07] pt-6 text-center text-zinc-600">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
