"use client";

import Link from "next/link";

export function SeoLinksSection() {
  const categories = [
    {
      title: "Create with RenderPop",
      links: [
        { label: "AI Image Generator", href: "/ai-image-generator" },
        { label: "AI Video Generator", href: "/ai-video-generator" },
        { label: "Image to Video AI", href: "/image-to-video" },
        { label: "Text to Image Online", href: "/ai-image-generator#create" },
      ],
    },
    {
      title: "Video creation",
      links: [
        { label: "Text to Video", href: "/ai-video-generator#create" },
        { label: "Image to Video", href: "/image-to-video#create" },
        { label: "AI Motion Generator", href: "/ai-video-generator#create" },
        { label: "AI Photo Animation", href: "/image-to-video#create" },
      ],
    },
    {
      title: "Image creation",
      links: [
        { label: "AI Image Generator No Sign Up", href: "/ai-image-generator" },
        { label: "Free Daily Fast Generations", href: "/#pricing" },
        { label: "AI Art Generator", href: "/ai-image-generator#create" },
        { label: "Text to Image", href: "/ai-image-generator#create" },
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
                      className="text-xs text-zinc-400 transition hover:text-[#ec5c83] hover:underline"
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
