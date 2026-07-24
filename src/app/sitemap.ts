import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const routes = [
    "",
    "/ai-image-generator",
    "/ai-video-generator",
    "/image-to-video",
    "/dance",
    "/pricing",
    "/features/photo-animation",
    "/features/ai-avatar",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
