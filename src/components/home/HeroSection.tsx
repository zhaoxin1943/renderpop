"use client";

import { IconPhoto } from "@tabler/icons-react";
import { useI18n } from "@/i18n/I18nContext";
import { GenerateStudio } from "@/components/generate/GenerateStudio";

interface HeroSectionProps {
  seedPrompt?: string;
  seedAspect?: string;
  onSeedConsumed?: () => void;
}

export function HeroSection({
  seedPrompt,
  seedAspect,
  onSeedConsumed,
}: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section id="create" className="bg-[#050505] pb-10 pt-10 sm:pb-14 sm:pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="mx-auto max-w-4xl text-center text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
          {t("hero.title")}
        </h1>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#121215] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="flex items-center justify-between border-b border-white/[0.09] px-4 sm:px-6">
            <div className="relative inline-flex items-center gap-2 px-1 py-4 text-sm font-medium text-white">
              <IconPhoto className="size-4 text-zinc-300" stroke={1.75} />
              {t("hero.tabImage")}
              <span className="brand-signal absolute inset-x-0 bottom-0 h-0.5" />
            </div>
            <span className="hidden text-xs text-zinc-500 sm:inline">{t("common.noSignUpNeeded")}</span>
          </div>
          <div className="p-4 sm:p-6">
            <GenerateStudio
              seedPrompt={seedPrompt}
              seedAspect={seedAspect}
              onSeedConsumed={onSeedConsumed}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
