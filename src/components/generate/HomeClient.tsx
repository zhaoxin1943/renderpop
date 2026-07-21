"use client";

import { useCallback, useState } from "react";

import { GenerateStudio } from "@/components/generate/GenerateStudio";
import { ShowcaseGrid } from "@/components/generate/ShowcaseGrid";
import type { ShowcaseItem } from "@/lib/types";

export function HomeClient() {
  const [seed, setSeed] = useState<{
    prompt: string;
    aspect: string;
  } | null>(null);

  const onTry = useCallback((item: ShowcaseItem) => {
    setSeed({ prompt: item.prompt, aspect: item.aspect_ratio });
  }, []);

  const onSeedConsumed = useCallback(() => {
    setSeed(null);
  }, []);

  return (
    <div className="space-y-12">
      <GenerateStudio
        seedPrompt={seed?.prompt}
        seedAspect={seed?.aspect}
        onSeedConsumed={onSeedConsumed}
      />

      <section aria-labelledby="showcase-heading" className="space-y-4">
        <div className="space-y-1">
          <h2
            id="showcase-heading"
            className="text-lg font-semibold tracking-tight text-zinc-900"
          >
            Get inspired
          </h2>
          <p className="text-sm text-zinc-500">
            Tap any image to fill the prompt and try free daily Fast generations.
          </p>
        </div>
        <ShowcaseGrid onTry={onTry} />
      </section>
    </div>
  );
}
