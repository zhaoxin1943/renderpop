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
    <section id="create" className="relative bg-[#050505] pb-10 pt-8 sm:pb-16 sm:pt-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-violet-600/15 via-pink-500/10 to-transparent blur-[120px] rounded-full" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md text-xs sm:text-sm font-medium text-violet-300 mb-4 sm:mb-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          {t("hero.badge")}
        </div>

        {/* H1 Headline */}
        <h1 className="mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
          {t("hero.title")}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-zinc-400 sm:text-lg">
          {t("hero.subtitle")}
        </p>

        {/* Generate Studio Console Container */}
        <div className="mt-8 sm:mt-10 relative overflow-hidden rounded-2xl border border-white/[0.15] bg-[#121215]/90 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] transition-all duration-300">
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
