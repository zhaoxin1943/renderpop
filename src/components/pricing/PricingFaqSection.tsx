"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nContext";

type FaqItem = {
  id: string;
  qKey: string;
  aKey: string;
  pillTag?: string;
  pillColor?: "green" | "purple";
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "credits-work",
    qKey: "pricingFaq.q1",
    aKey: "pricingFaq.a1",
  },
  {
    id: "plan-vs-pack",
    qKey: "pricingFaq.q2",
    aKey: "pricingFaq.a2",
    pillTag: "REFRESH MONTHLY vs 12 MONTHS",
    pillColor: "purple",
  },
  {
    id: "fefo-deduction",
    qKey: "pricingFaq.q3",
    aKey: "pricingFaq.a3",
    pillTag: "EARLIEST EXPIRING FIRST",
    pillColor: "green",
  },
  {
    id: "dance-no-subscription",
    qKey: "pricingFaq.q4",
    aKey: "pricingFaq.a4",
  },
  {
    id: "cancel-subscription",
    qKey: "pricingFaq.q5",
    aKey: "pricingFaq.a5",
  },
];

export function PricingFaqSection() {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>("plan-vs-pack");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mx-auto max-w-[840px] px-4 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
          {t("pricingFaq.title")}
        </h2>
        <p className="mt-3 text-sm text-zinc-400 md:text-base">
          {t("pricingFaq.subtitle")}
        </p>
      </div>

      <div className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="group">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between py-5 text-left transition hover:opacity-90 md:py-6"
                aria-expanded={isOpen}
              >
                <span className="text-base font-semibold tracking-[-0.01em] text-white md:text-lg">
                  {t(item.qKey)}
                </span>
                <span className="ml-4 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors group-hover:border-white/20 group-hover:text-white">
                  <svg
                    className={`size-4 transition-transform duration-200 ${
                      isOpen ? "rotate-45 text-purple-400" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="pb-6 pt-1 text-sm leading-relaxed text-zinc-300 md:text-base">
                  <p>{t(item.aKey)}</p>
                  {item.pillTag && (
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                          item.pillColor === "green"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-purple-500/30 bg-purple-500/10 text-purple-300"
                        }`}
                      >
                        {item.pillTag}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
