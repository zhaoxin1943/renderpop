"use client";

import { useI18n } from "@/i18n/I18nContext";

export function UseCasesSection() {
  const { t } = useI18n();

  const cases = [
    {
      titleKey: "useCases.case2Title",
      descKey: "useCases.case2Desc",
      icon: (
        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      titleKey: "useCases.case3Title",
      descKey: "useCases.case3Desc",
      icon: (
        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      titleKey: "useCases.case4Title",
      descKey: "useCases.case4Desc",
      icon: (
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      ),
    },
    {
      titleKey: "useCases.case5Title",
      descKey: "useCases.case5Desc",
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      titleKey: "useCases.case6Title",
      descKey: "useCases.case6Desc",
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#050505] py-16 sm:py-24 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("useCases.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t("useCases.title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            {t("useCases.subtitle")}
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="space-y-6">
          {/* Featured Top Card (Case 1) */}
          <div className="group relative p-8 sm:p-10 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-[#0c0d10] to-[#0c0d10] overflow-hidden hover:border-violet-500/50 transition-all duration-300">
            <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-500/20 border border-violet-500/30 mb-4">
                ⭐ MOST POPULAR WORKFLOW
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-violet-200 transition-colors">
                {t("useCases.case1Title")}
              </h3>
              <p className="mt-3 text-base text-zinc-300 leading-relaxed">
                {t("useCases.case1Desc")}
              </p>
            </div>
          </div>

          {/* 5 Secondary Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((item, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d10] hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
