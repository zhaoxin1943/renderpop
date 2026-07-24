"use client";

import { useI18n } from "@/i18n/I18nContext";

export function WhyChooseUsSection() {
  const { t } = useI18n();

  const stats = [
    { val: t("whyUs.stat1Val"), label: t("whyUs.stat1Label"), color: "text-emerald-400" },
    { val: t("whyUs.stat2Val"), label: t("whyUs.stat2Label"), color: "text-violet-400" },
    { val: t("whyUs.stat3Val"), label: t("whyUs.stat3Label"), color: "text-pink-400" },
    { val: t("whyUs.stat4Val"), label: t("whyUs.stat4Label"), color: "text-cyan-400" },
    { val: t("whyUs.stat5Val"), label: t("whyUs.stat5Label"), color: "text-amber-400" },
  ];

  const reasons = [
    {
      titleKey: "whyUs.reason1Title",
      descKey: "whyUs.reason1Desc",
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 13C10.832 21 4 17.79 4 11V6.3a1 1 0 01.757-.97l7-2a1 1 0 01.486 0l7 2A1 1 0 0120 6.3V11c0 6.79-6.832 10-8 10z" />
        </svg>
      ),
    },
    {
      titleKey: "whyUs.reason2Title",
      descKey: "whyUs.reason2Desc",
      icon: (
        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      titleKey: "whyUs.reason3Title",
      descKey: "whyUs.reason3Desc",
      icon: (
        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.1a1 1 0 00-1.022.547l-1.12 2.24a1 1 0 00.323 1.258l2.08 1.56a1 1 0 001.07.098l2.585-1.293a6 6 0 014.28 0l2.586 1.293a1 1 0 001.07-.098l2.08-1.56a1 1 0 00.323-1.258l-1.12-2.24zM12 11a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
    },
    {
      titleKey: "whyUs.reason4Title",
      descKey: "whyUs.reason4Desc",
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      titleKey: "whyUs.reason5Title",
      descKey: "whyUs.reason5Desc",
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      titleKey: "whyUs.reason6Title",
      descKey: "whyUs.reason6Desc",
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#050505] py-16 sm:py-24 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("whyUs.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t("whyUs.title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            {t("whyUs.subtitle")}
          </p>
        </div>

        {/* Stat Bar (5 Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d10] text-center"
            >
              <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${stat.color}`}>
                {stat.val}
              </span>
              <span className="mt-1 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* 6 Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between p-7 rounded-2xl border border-white/[0.08] bg-[#0c0d10] hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
