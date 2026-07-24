"use client";

import {
  IconCheck,
  IconHelpCircle,
  IconLock,
  IconMovie,
  IconPhoto,
  IconSparkles,
  IconWand,
} from "@tabler/icons-react";

import { useI18n } from "@/i18n/I18nContext";

export function DanceSEOContent() {
  const { t } = useI18n();

  const faqs = [
    {
      question: t("dance.faq1Q"),
      answer: t("dance.faq1A"),
    },
    {
      question: t("dance.faq2Q"),
      answer: t("dance.faq2A"),
    },
    {
      question: t("dance.faq3Q"),
      answer: t("dance.faq3A"),
    },
    {
      question: t("dance.faq4Q"),
      answer: t("dance.faq4A"),
    },
    {
      question: t("dance.faq5Q"),
      answer: t("dance.faq5A"),
    },
    {
      question: t("dance.faq6Q"),
      answer: t("dance.faq6A"),
    },
    {
      question: t("dance.faq7Q"),
      answer: t("dance.faq7A"),
    },
    {
      question: t("dance.faq8Q"),
      answer: t("dance.faq8A"),
    },
    {
      question: t("dance.faq9Q"),
      answer: t("dance.faq9A"),
    },
    {
      question: t("dance.faq10Q"),
      answer: t("dance.faq10A"),
    },
  ];

  const steps = [
    {
      step: "01",
      title: t("dance.step1Title"),
      desc: t("dance.step1Desc"),
    },
    {
      step: "02",
      title: t("dance.step2Title"),
      desc: t("dance.step2Desc"),
    },
    {
      step: "03",
      title: t("dance.step3Title"),
      desc: t("dance.step3Desc"),
    },
    {
      step: "04",
      title: t("dance.step4Title"),
      desc: t("dance.step4Desc"),
    },
    {
      step: "05",
      title: t("dance.step5Title"),
      desc: t("dance.step5Desc"),
    },
  ];

  const useCases = [
    {
      title: t("dance.whoCase1Title"),
      desc: t("dance.whoCase1Desc"),
    },
    {
      title: t("dance.whoCase2Title"),
      desc: t("dance.whoCase2Desc"),
    },
    {
      title: t("dance.whoCase3Title"),
      desc: t("dance.whoCase3Desc"),
    },
    {
      title: t("dance.whoCase4Title"),
      desc: t("dance.whoCase4Desc"),
    },
    {
      title: t("dance.whoCase5Title"),
      desc: t("dance.whoCase5Desc"),
    },
    {
      title: t("dance.whoCase6Title"),
      desc: t("dance.whoCase6Desc"),
    },
  ];

  const featureCases = [
    {
      title: t("dance.useCase1Title"),
      desc: t("dance.useCase1Desc"),
    },
    {
      title: t("dance.useCase2Title"),
      desc: t("dance.useCase2Desc"),
    },
    {
      title: t("dance.useCase3Title"),
      desc: t("dance.useCase3Desc"),
    },
    {
      title: t("dance.useCase4Title"),
      desc: t("dance.useCase4Desc"),
    },
    {
      title: t("dance.useCase5Title"),
      desc: t("dance.useCase5Desc"),
    },
    {
      title: t("dance.useCase6Title"),
      desc: t("dance.useCase6Desc"),
    },
  ];

  return (
    <div className="border-t border-white/[0.08] bg-[#050505] text-zinc-300">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:px-8">
        {/* SEO Section 1: What Is AI Motion Control Dance Video? */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300">
            <IconSparkles className="size-4 text-purple-400" />
            {t("dance.seoBadge")}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("dance.whatIsTitle")}
          </h2>
          <p className="mt-6 text-base leading-8 text-zinc-400 sm:text-lg">
            {t("dance.whatIsDescP1")}
          </p>
          <p className="mt-4 text-sm leading-7 text-zinc-500">
            {t("dance.whatIsDescP2")}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-purple-500/40">
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <IconPhoto className="size-6" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-white">
              {t("dance.whatIsCard1Title")}
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              {t("dance.whatIsCard1Desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-pink-500/40">
            <div className="flex size-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
              <IconLock className="size-6" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-white">
              {t("dance.whatIsCard2Title")}
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              {t("dance.whatIsCard2Desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-indigo-500/40">
            <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <IconWand className="size-6" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-white">
              {t("dance.whatIsCard3Title")}
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              {t("dance.whatIsCard3Desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-emerald-500/40">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <IconMovie className="size-6" />
            </div>
            <h3 className="mt-5 text-base font-semibold text-white">
              {t("dance.whatIsCard4Title")}
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              {t("dance.whatIsCard4Desc")}
            </p>
          </div>
        </div>

        {/* SEO Section 2: How to Use AI Motion Control Dance Generator */}
        <div className="mt-24 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-8 sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              {t("dance.howToTitle")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {t("dance.howToSubtitle")}
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:flex-row sm:items-center"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-base font-bold text-purple-300">
                  {item.step}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-white">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <IconCheck className="size-4 text-emerald-400" />
            <span>{t("dance.consent")}</span>
          </div>
        </div>

        {/* SEO Section 3: Who Chooses RenderPop AI Motion Control */}
        <div className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              {t("dance.whoTitle")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {t("dance.whoSubtitle")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-purple-500/30"
              >
                <h4 className="text-base font-semibold text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Section 4: AI Dance Motion Control Use Cases */}
        <div className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              {t("dance.useCasesTitle")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {t("dance.useCasesSubtitle")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCases.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition hover:border-pink-500/30"
              >
                <h4 className="text-base font-semibold text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="flex items-center gap-3">
            <IconHelpCircle className="size-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">
              {t("dance.seoFaqTitle")}
            </h3>
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6"
              >
                <dt className="text-base font-semibold text-white">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-zinc-400">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}


