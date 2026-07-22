"use client";

import { useI18n } from "@/i18n/I18nContext";
import { ShowcaseGrid } from "@/components/generate/ShowcaseGrid";
import type { ShowcaseItem } from "@/lib/types";

interface ShowcaseSectionProps {
  onTry: (item: ShowcaseItem) => void;
}

export function ShowcaseSection({ onTry }: ShowcaseSectionProps) {
  const { t } = useI18n();

  return (
    <section id="examples" className="border-t border-white/[0.07] bg-[#050505] pb-20 pt-12 sm:pb-28 sm:pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{t("showcase.eyebrow")}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">{t("showcase.title")}</h2>
          </div>
          <a href="#create" className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline-flex">{t("showcase.backToCreate")}</a>
        </div>
        <ShowcaseGrid onTry={onTry} />
      </div>
    </section>
  );
}
