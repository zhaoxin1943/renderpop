"use client";
import { Suspense } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { GenerateStudio } from "@/components/generate/GenerateStudio";
import type { StudioTaskSubmission } from "@/lib/studio-sessions";

interface HeroSectionProps {
  seedPrompt?: string;
  seedAspect?: string;
  onSeedConsumed?: () => void;
  onTaskCreated?: (submission: StudioTaskSubmission) => void;
  createSessionForTask?: () => Promise<string>;
}

export function HeroSection({
  seedPrompt,
  seedAspect,
  onSeedConsumed,
  onTaskCreated,
  createSessionForTask,
}: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section id="create" className="bg-[#050505] pb-10 pt-10 sm:pb-14 sm:pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="mx-auto max-w-4xl text-center text-3xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
          {t("hero.title")}
        </h1>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#121215] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <Suspense fallback={<div className="h-[244px] animate-pulse bg-white/[0.02]" />}>
            <GenerateStudio
              seedPrompt={seedPrompt}
              seedAspect={seedAspect}
              onSeedConsumed={onSeedConsumed}
              onTaskCreated={onTaskCreated}
              createSessionForTask={createSessionForTask}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
