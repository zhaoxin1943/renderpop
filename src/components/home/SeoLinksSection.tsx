"use client";

import Link from "next/link";

export function SeoLinksSection() {
  const categories = [
    {
      title: "Core AI Generators",
      links: [
        { label: "Free AI Image Generator", href: "/ai-image-generator" },
        { label: "AI Video Generator", href: "/ai-video-generator" },
        { label: "Image to Video AI", href: "/image-to-video" },
        { label: "Text to Image Online", href: "/ai-image-generator#create" },
      ],
    },
    {
      title: "Popular Features",
      links: [
        { label: "Photo to Dance AI Free", href: "/features/photo-to-dance" },
        { label: "AI Photo Animation", href: "/features/photo-animation" },
        { label: "AI Avatar Generator", href: "/features/ai-avatar" },
        { label: "Anime Art Generator", href: "/features/anime-art" },
      ],
    },
    {
      title: "Free & No Sign-Up Tools",
      links: [
        { label: "AI Image Generator No Sign Up", href: "/ai-image-generator" },
        { label: "AI Video Generator No Login", href: "/ai-video-generator" },
        { label: "Free Daily Fast Quota", href: "/#pricing" },
        { label: "Instant Photo Animator", href: "/image-to-video" },
      ],
    },
  ];

  return (
    <section className="border-t border-white/[0.07] bg-[#050505] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-xl font-semibold text-white">
          Explore RenderPop AI Generators & Tools
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-[#09090d] p-5">
              <h3 className="text-sm font-semibold text-zinc-300">{cat.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {cat.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-xs text-zinc-400 transition hover:text-emerald-400 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
