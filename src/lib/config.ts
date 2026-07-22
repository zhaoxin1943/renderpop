/** Client-safe public config. */
export const siteConfig = {
  name: "RenderPop",
  description:
    "Free AI Image & Video Generator with daily Fast generations. Create AI art, text to image, and photo to dance videos with no sign up required.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://renderpop.app",
  tagline: "Free daily AI Image & Video generation",
} as const;
