"use client";

import { IconAdjustmentsHorizontal, IconPhoto, IconVideo } from "@tabler/icons-react";

export function ReviewSection() {
  return (
    <section className="border-t border-white/[0.07] bg-[#08080a] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
            Make the next creative move, not another setup decision.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            RenderPop keeps the everyday controls close and moves the technical ones out of the way until you need them.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-white/[0.08] bg-[#0d0d12] p-6 sm:p-8">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-100">
              <IconPhoto className="size-5" stroke={1.65} />
            </span>
            <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-white">Start with an image</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
              Choose Fast for everyday ideas or Pro when the details matter. Pick a composition and keep creating.
            </p>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <article className="rounded-2xl border border-white/[0.08] bg-[#0d0d12] p-6">
              <IconVideo className="size-5 text-[#ea5e85]" stroke={1.65} />
              <h3 className="mt-5 text-base font-semibold text-white">Then bring it into motion</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">Use a prompt, or add a still image to guide the first frame.</p>
            </article>
            <article className="rounded-2xl border border-white/[0.08] bg-[#0d0d12] p-6">
              <IconAdjustmentsHorizontal className="size-5 text-[#b64ad2]" stroke={1.65} />
              <h3 className="mt-5 text-base font-semibold text-white">Tune only when needed</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">Video quality, duration, ratio, and audio stay behind one focused settings control.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
