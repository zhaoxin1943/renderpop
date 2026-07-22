"use client";

import { useI18n } from "@/i18n/I18nContext";

export function WhyChooseUsSection() {
  const { t } = useI18n();

  return (
    <section className="bg-gradient-to-b from-[#f8fafc] to-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <span className="rounded-full bg-[#3e5bff]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#3e5bff]">
            {t("whyUs.badge")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[#0f172a] sm:text-4xl lg:text-5xl">
            {t("whyUs.title")}
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {/* Reason 1 */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3e5bff]/10 text-xl text-[#3e5bff]">
              ⚙️
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#0f172a]">
              {t("whyUs.reason1Title")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
              {t("whyUs.reason1Desc")}
            </p>
          </div>

          {/* Reason 2 */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3e5bff]/10 text-xl text-[#3e5bff]">
              🎁
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#0f172a]">
              {t("whyUs.reason2Title")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
              {t("whyUs.reason2Desc")}
            </p>
          </div>

          {/* Reason 3 */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3e5bff]/10 text-xl text-[#3e5bff]">
              ⚡
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#0f172a]">
              {t("whyUs.reason3Title")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
              {t("whyUs.reason3Desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
