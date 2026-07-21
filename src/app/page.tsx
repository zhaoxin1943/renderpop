import type { Metadata } from "next";

import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Free AI Image Generator",
  description: siteConfig.description,
  keywords: [
    "free ai image generator",
    "ai image generator",
    "text to image",
    "free daily fast generations",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free AI Image Generator | RenderPop",
    description: siteConfig.description,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
          {siteConfig.tagline}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Free AI Image Generator
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-600 sm:mx-0">
          Type a prompt and create. Free daily Fast generations — no model
          picker, no setup. Default vertical 9:16 for mobile.
        </p>
      </section>

      <HomeClient />

      <section
        className="grid gap-4 border-t border-zinc-200 pt-10 sm:grid-cols-3"
        aria-labelledby="how-heading"
      >
        <h2 id="how-heading" className="sr-only">
          How it works
        </h2>
        {[
          {
            step: "01",
            title: "Write a prompt",
            body: "Describe what you want, or tap an example below the studio.",
          },
          {
            step: "02",
            title: "Generate with Fast",
            body: "Uses your free daily Fast quota. We pick the model for you.",
          },
          {
            step: "03",
            title: "Download & iterate",
            body: "Refine the prompt and run again while quota remains.",
          },
        ].map((item) => (
          <article
            key={item.step}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <span className="text-xs font-semibold text-violet-600">
              {item.step}
            </span>
            <h3 className="mt-1 text-sm font-semibold text-zinc-900">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
