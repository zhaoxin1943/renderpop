"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nContext";

export function FeatureMatrixSection() {
  const { t } = useI18n();

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <span className="rounded-full bg-[#3e5bff]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#3e5bff]">
            {t("features.badge")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[#0f172a] sm:text-4xl lg:text-5xl">
            {t("features.title")}
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Card 1: AI Image Generator */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-8 shadow-sm transition hover:border-[#3e5bff]/40 hover:shadow-xl sm:p-10">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3e5bff]/10 text-2xl text-[#3e5bff]">
                🎨
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#0f172a]">
                {t("features.imageGenTitle")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#64748b]">
                {t("features.imageGenDesc")}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="rounded-lg bg-[#f1f5f9] px-3 py-1.5 text-xs font-semibold text-[#334155]">
                ⚡ Fast Mode (Free)
              </span>
              <span className="rounded-lg bg-[#3e5bff]/10 px-3 py-1.5 text-xs font-semibold text-[#3e5bff]">
                💎 Pro Mode (12 Credits)
              </span>
            </div>
          </div>

          {/* Card 2: Photo to Dance Video (/dance) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#3e5bff]/30 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#3e5bff] p-8 text-white shadow-xl sm:p-10">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-md">
                  💃
                </div>
                <span className="rounded-full bg-[#f43f5e] px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase text-white shadow-sm">
                  {t("features.danceBadge")}
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">
                {t("features.danceTitle")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#c7d2fe]">
                {t("features.danceDesc")}
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/dance"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#3e5bff] shadow-md transition hover:bg-[#f8fafc] hover:shadow-lg"
              >
                {t("features.tryDanceBtn")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
