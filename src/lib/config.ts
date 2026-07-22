/** Client-safe public config. */
export const siteConfig = {
  name: "RenderPop",
  description:
    "Free AI Image Generator with free daily Fast generations. Type a prompt and create with no model setup.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://renderpop.app",
  tagline: "Free daily Fast generations",
} as const;
