"use client";

import { useI18n } from "@/i18n/I18nContext";

export function HowItWorksSection() {
  const { t } = useI18n();

  const steps = [
    {
      num: t("howItWorks.step1Num"),
      titleKey: "howItWorks.step1Title",
      descKey: "howItWorks.step1Desc",
      accent: "from-violet-500 to-indigo-500",
      borderHover: "hover:border-violet-500/40",
    },
    {
      num: t("howItWorks.step2Num"),
      titleKey: "howItWorks.step2Title",
      descKey: "howItWorks.step2Desc",
      accent: "from-pink-500 to-purple-500",
      borderHover: "hover:border-pink-500/40",
    },
    {
      num: t("howItWorks.step3Num"),
      titleKey: "howItWorks.step3Title",
      descKey: "howItWorks.step3Desc",
      accent: "from-cyan-500 to-blue-500",
      borderHover: "hover:border-cyan-500/40",
    },
  ];

  return (
    <section className="bg-[#050505] py-16 sm:py-24 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("howItWorks.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t("howItWorks.title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative flex flex-col justify-between p-8 rounded-2xl border border-white/[0.08] bg-[#0c0d10] transition-all duration-300 ${step.borderHover} hover:-translate-y-1`}
            >
              <div>
                {/* Step Number Badge */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold text-white bg-gradient-to-r ${step.accent} shadow-lg mb-6`}>
                  {step.num}
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
