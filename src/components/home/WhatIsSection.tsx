"use client";

import { useI18n } from "@/i18n/I18nContext";

export function WhatIsSection() {
  const { t } = useI18n();

  const cards = [
    {
      titleKey: "whatIs.card1Title",
      descKey: "whatIs.card1Desc",
      icon: (
        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      titleKey: "whatIs.card2Title",
      descKey: "whatIs.card2Desc",
      icon: (
        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      titleKey: "whatIs.card3Title",
      descKey: "whatIs.card3Desc",
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      titleKey: "whatIs.card4Title",
      descKey: "whatIs.card4Desc",
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#050505] py-16 sm:py-24 border-t border-white/[0.06] relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-violet-600/10 blur-[140px] rounded-full" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("whatIs.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t("whatIs.title")}
          </h2>
          <p className="mt-3 text-lg text-zinc-400">
            {t("whatIs.subtitle")}
          </p>
        </div>

        {/* Narrative SEO Text Block */}
        <div className="max-w-4xl space-y-4 text-base sm:text-lg text-zinc-300 leading-relaxed mb-12 sm:mb-16">
          <p>{t("whatIs.p1")}</p>
          <p>{t("whatIs.p2")}</p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d10] hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] group-hover:scale-105 transition-transform duration-300 shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {t(card.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {t(card.descKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
