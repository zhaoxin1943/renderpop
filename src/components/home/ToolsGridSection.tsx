"use client";

import { useI18n } from "@/i18n/I18nContext";

export function ToolsGridSection() {
  const { t } = useI18n();

  const tools = [
    {
      titleKey: "toolsGrid.tool1Title",
      descKey: "toolsGrid.tool1Desc",
      badge: "Free Daily",
      icon: (
        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
      borderColor: "group-hover:border-violet-500/40",
    },
    {
      titleKey: "toolsGrid.tool2Title",
      descKey: "toolsGrid.tool2Desc",
      badge: "Motion AI",
      icon: (
        <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
      borderColor: "group-hover:border-pink-500/40",
    },
    {
      titleKey: "toolsGrid.tool3Title",
      descKey: "toolsGrid.tool3Desc",
      badge: "Instant Queue",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
      borderColor: "group-hover:border-cyan-500/40",
    },
    {
      titleKey: "toolsGrid.tool4Title",
      descKey: "toolsGrid.tool4Desc",
      badge: "Commercial Grade",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      borderColor: "group-hover:border-amber-500/40",
    },
  ];

  return (
    <section className="bg-[#050505] py-16 sm:py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("toolsGrid.badge")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            {t("toolsGrid.title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            {t("toolsGrid.subtitle")}
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((item, index) => (
            <div
              key={index}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d10] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${item.borderColor} overflow-hidden`}
            >
              {/* Background Ambient Gradient on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative z-10">
                {/* Header Row: Icon & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-medium tracking-wide text-zinc-400 bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white group-hover:text-violet-200 transition-colors">
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
    </section>
  );
}
