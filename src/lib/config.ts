/** Client-safe public config. */
export const siteConfig = {
  name: "RenderPop",
  description:
    "Create AI images and videos from a prompt or a still image. Fast image generation is free daily. Video creation uses credits and requires sign-in.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://renderpop.app",
  tagline: "AI images and videos, without model setup",
} as const;
