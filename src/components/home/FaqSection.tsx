"use client";

import { useI18n } from "@/i18n/I18nContext";

export function FaqSection() {
  const { t } = useI18n();

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section id="faq" className="border-t border-white/[0.07] bg-[#050505] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
            {t("faq.title")}
          </h2>
        </div>

        <div className="mt-10 divide-y divide-white/[0.1] border-y border-white/[0.1]">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group py-5 transition duration-200"
            >
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-white marker:content-none hover:text-zinc-300">
                <span>{faq.q}</span>
                <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.12] text-xs text-zinc-400 transition duration-200 group-open:rotate-45 group-open:border-white group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
