"use client";

import { useI18n } from "@/i18n/I18nContext";

export function FaqSection() {
  const { t } = useI18n();

  const faqCount = 16;
  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
    isHighlight: i + 1 === 16,
  }));

  return (
    <section id="faq" className="border-t border-white/[0.06] bg-[#050505] py-16 sm:py-24 relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("faq.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t("faq.title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className={`group rounded-xl border transition duration-200 overflow-hidden ${
                faq.isHighlight
                  ? "border-violet-500/40 bg-gradient-to-r from-violet-950/20 via-[#0d0e12] to-[#0d0e12] shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                  : "border-white/[0.08] bg-[#0c0d10] hover:border-white/[0.15]"
              }`}
            >
              <summary className="flex cursor-pointer items-start sm:items-center justify-between p-4 sm:p-5 text-sm sm:text-base font-semibold text-white marker:content-none select-none">
                <span className="flex flex-col sm:flex-row sm:items-center items-start gap-1.5 sm:gap-2 pr-4">
                  {faq.isHighlight && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0 self-start mb-1 sm:mb-0">
                      Feature Spotlight
                    </span>
                  )}
                  <span>{faq.q}</span>
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20 text-xs text-zinc-400 transition-transform duration-200 group-open:rotate-45 group-open:border-violet-400 group-open:text-violet-400 mt-0.5 sm:mt-0">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-400 border-t border-white/[0.04] pt-3">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
