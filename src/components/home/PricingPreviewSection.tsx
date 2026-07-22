"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nContext";

export function PricingPreviewSection() {
  const { t } = useI18n();

  return (
    <section id="pricing" className="border-t border-white/[0.07] bg-[#050505] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
            {t("pricing.title")}
          </h2>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {/* Visitor */}
          <div className="flex flex-col justify-between rounded-xl border border-white/[0.1] bg-[#101012] p-6">
            <div>
              <h3 className="text-base font-bold text-white">
                {t("pricing.visitorTitle")}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{t("pricing.visitorPrice")}</span>
                <span className="text-xs text-[#a1a1aa]">/ {t("pricing.visitorPeriod")}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-zinc-500" /> {t("pricing.visitorFeature1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-zinc-500" /> {t("pricing.visitorFeature2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-zinc-500" /> {t("pricing.visitorFeature3")}
                </li>
              </ul>
            </div>

            <a
              href="#create"
              className="mt-6 rounded-lg border border-white/[0.12] px-4 py-2.5 text-center text-xs font-medium text-white transition hover:bg-white/[0.06]"
            >
              {t("pricing.visitorCta")}
            </a>
          </div>

          {/* Registered Free */}
          <div className="relative flex flex-col justify-between rounded-xl border border-[#8e36dc] bg-[#101012] p-6">
            <div>
              <h3 className="text-base font-bold text-white">
                {t("pricing.freeUserTitle")}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{t("pricing.freeUserPrice")}</span>
                <span className="text-xs text-[#a1a1aa]">/ {t("pricing.freeUserPeriod")}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-fuchsia-400" /> {t("pricing.freeUserFeature1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-fuchsia-400" /> {t("pricing.freeUserFeature2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-fuchsia-400" /> {t("pricing.freeUserFeature3")}
                </li>
              </ul>
            </div>

            <Link
              href="/sign-in"
              className="brand-cta mt-6 rounded-lg px-4 py-2.5 text-center text-xs font-medium text-white transition hover:brightness-110"
            >
              {t("pricing.freeUserCta")}
            </Link>
          </div>

          {/* Creator */}
          <div className="flex flex-col justify-between rounded-xl border border-white/[0.1] bg-[#101012] p-6">
            <div>
              <h3 className="text-base font-bold text-white">
                {t("pricing.creatorTitle")}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{t("pricing.creatorPrice")}</span>
                <span className="text-xs text-[#a1a1aa]">/ {t("pricing.creatorPeriod")}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-zinc-500" /> {t("pricing.creatorFeature1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-zinc-500" /> {t("pricing.creatorFeature2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-zinc-500" /> {t("pricing.creatorFeature3")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-zinc-500" /> {t("pricing.creatorFeature4")}
                </li>
              </ul>
            </div>

            <Link
              href="/pricing"
              className="mt-6 rounded-lg border border-white/[0.12] px-4 py-2.5 text-center text-xs font-medium text-white transition hover:bg-white/[0.06]"
            >
              {t("pricing.creatorCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
