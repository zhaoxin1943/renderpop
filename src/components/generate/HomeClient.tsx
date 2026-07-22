"use client";

import { useCallback, useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
import { FaqSection } from "@/components/home/FaqSection";
import type { ShowcaseItem } from "@/lib/types";

export function HomeClient() {
  const [seed, setSeed] = useState<{
    prompt: string;
    aspect: string;
  } | null>(null);

  const onTry = useCallback((item: ShowcaseItem) => {
    setSeed({ prompt: item.prompt, aspect: item.aspect_ratio });
    document.getElementById("create")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onSeedConsumed = useCallback(() => {
    setSeed(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* 1. Tool-First Hero Console Section */}
      <HeroSection
        seedPrompt={seed?.prompt}
        seedAspect={seed?.aspect}
        onSeedConsumed={onSeedConsumed}
      />

      {/* 2. Seamless Interactive Showcase Grid */}
      <ShowcaseSection onTry={onTry} />

      {/* 3. Restrained Pricing Matrix */}
      <PricingPreviewSection />

      {/* 4. Single-Hairline Separator FAQ */}
      <FaqSection />
    </div>
  );
}
