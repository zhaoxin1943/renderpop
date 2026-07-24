"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { ToolsGridSection } from "@/components/home/ToolsGridSection";
import { EnginesLineupSection } from "@/components/home/EnginesLineupSection";
import { WhatIsSection } from "@/components/home/WhatIsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { UseCasesSection } from "@/components/home/UseCasesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { SeoLinksSection } from "@/components/home/SeoLinksSection";
import { apiFetch } from "@/lib/api";
import type { CreationSession, ShowcaseItem } from "@/lib/types";
import type { StudioTaskSubmission } from "@/lib/studio-sessions";

export function HomeClient() {
  const router = useRouter();
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

  const createSessionForTask = useCallback(async () => {
    const session = await apiFetch<CreationSession>("/creation-sessions", { method: "POST" });
    return session.id;
  }, []);

  const onTaskCreated = useCallback((submission: StudioTaskSubmission) => {
    if (!submission.task.session_id) return;
    router.push(`/create/${submission.task.session_id}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* 1. Tool-First Hero Console Section */}
      <HeroSection
        seedPrompt={seed?.prompt}
        seedAspect={seed?.aspect}
        onSeedConsumed={onSeedConsumed}
        onTaskCreated={onTaskCreated}
        createSessionForTask={createSessionForTask}
      />

      {/* 2. Seamless Interactive Showcase Grid */}
      <ShowcaseSection onTry={onTry} />

      {/* 3. AI Tools & Capabilities Grid */}
      <ToolsGridSection />

      {/* 4. Engines Lineup (Powered by World's Leading AI Models Array) */}
      <EnginesLineupSection />

      {/* 5. What Is RenderPop AI (SEO Narrative & GPT Image 2 Fine-tuning) */}
      <WhatIsSection />

      {/* 5. How to Use in 3 Simple Steps */}
      <HowItWorksSection />

      {/* 6. Why Creators Choose RenderPop Over Other Generators (Stat Bar & 6 Bento Grid) */}
      <WhyChooseUsSection />

      {/* 7. Realistic Human Portrait Use Cases */}
      <UseCasesSection />

      {/* 8. Community Reviews & Social Proof */}
      <TestimonialsSection />

      {/* 5. Single-Hairline Separator FAQ */}
      <FaqSection />

      {/* 6. Structural Internal Link Mesh */}
      <SeoLinksSection />
    </div>
  );
}
