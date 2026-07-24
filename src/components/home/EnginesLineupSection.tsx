"use client";

import { useI18n } from "@/i18n/I18nContext";

export function EnginesLineupSection() {
  const { t } = useI18n();

  const videoModels = [
    "Sora 2 Pro", "Sora 2", "VEO 3.1", "VEO 3.1 Fast", "VEO 3",
    "Seedance 2.0", "Seedance 2.0 Fast", "Seedance 1.5 Pro", "Seedance 1.0 Pro Fast",
    "Wan 2.7", "Wan 2.6", "Wan 2.5", "Wan 2.2 Spicy",
    "Kling V3", "Kling V3 Omni", "Kling 2.6", "Kling 2.5", "Kling 2.1",
    "Hailuo 02", "Hailuo 2.3", "Hailuo 2.3 Fast",
    "Vidu Q3", "Vidu Q3 Turbo", "Vidu Q3 Pro Fast", "Vidu Q2",
    "Grok Imagine Video", "HappyHorse 1.0 i2v", "HappyHorse 1.0 t2v"
  ];

  const imageModels = [
    "Z-Image Turbo", "Seedream 4.5", "Seedream 5.0 Lite",
    "Nano Banana Pro", "Nano Banana 2", "Nano Banana",
    "Grok Imagine", "Kling V3", "Kling V3 Omni", "Kling 01",
    "GPT Image 2" // Special Highlighted Model
  ];

  const audioModels = [
    "MiniMax Speech 2.6 HD", "MiniMax Speech 2.6 Turbo", "MiniMax Speech 2.0 HD",
    "MiniMax Voice Clone", "Gemini 2.5 Pro TTS", "Gemini 2.5 TTS", "MiniMax Speech Pro"
  ];

  const roadmapItems = [
    "Next-gen Sora variants", "Next VEO release", "Upcoming Kling iterations",
    "Upcoming Hailuo iterations", "Open-weight frontier image models", "Open-weight frontier video models"
  ];

  return (
    <section className="bg-[#050505] py-16 sm:py-24 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("engines.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t("engines.title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            {t("engines.subtitle")}
          </p>
        </div>

        {/* Categories Stack */}
        <div className="space-y-10 sm:space-y-12">
          {/* 1. Video Models Category */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t("engines.videoTitle")}
              </h3>
              <span className="text-xs font-bold tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                {t("engines.videoCount")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {videoModels.map((model, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1117] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:border-violet-500/40 hover:text-violet-300 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  {model}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Image Models Category */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t("engines.imageTitle")}
              </h3>
              <span className="text-xs font-bold tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                {t("engines.imageCount")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {imageModels.map((model, idx) => {
                const isHighlight = model === "GPT Image 2";
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isHighlight
                        ? "bg-emerald-500/15 border border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] font-semibold"
                        : "bg-[#0e1117] border border-white/[0.08] text-zinc-300 hover:border-violet-500/40 hover:text-violet-300"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isHighlight
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]"
                          : "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                      }`}
                    />
                    {isHighlight && (
                      <span className="px-1 py-0.5 rounded text-[9px] font-bold tracking-wider bg-emerald-500 text-black uppercase mr-0.5">
                        GPT
                      </span>
                    )}
                    {model}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 3. Audio & Voice Models Category */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t("engines.audioTitle")}
              </h3>
              <span className="text-xs font-bold tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                {t("engines.audioCount")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {audioModels.map((model, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1117] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:border-violet-500/40 hover:text-violet-300 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  {model}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Coming Soon — On the Roadmap Category */}
          <div className="pt-4 border-t border-white/[0.04]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-zinc-400">
                {t("engines.roadmapTitle")}
              </h3>
              <span className="text-[11px] font-medium tracking-wider text-zinc-500">
                {t("engines.roadmapCount")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {roadmapItems.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] text-xs font-medium italic text-zinc-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
