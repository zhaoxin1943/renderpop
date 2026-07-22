import type { Metadata } from "next";
import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Free AI Video Generator — Turn Photos to Dance & Video",
  description:
    "Transform photos and prompts into dynamic AI video clips with RenderPop. Free AI video generator with photo-to-dance templates. No sign up required.",
  keywords: [
    "ai video generator",
    "free ai video generator",
    "ai video generator no login",
    "photo to dance ai free",
    "image to video generator",
    "ai motion generator",
  ],
  alternates: {
    canonical: "/ai-video-generator",
  },
  openGraph: {
    title: "Free AI Video Generator — Photo to Dance & Motion | RenderPop",
    description:
      "Animate photos and create dynamic AI videos instantly. Free previews with no registration required.",
    url: "/ai-video-generator",
  },
};

export default function AiVideoGeneratorPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RenderPop AI Video Generator",
    url: `${siteConfig.url}/ai-video-generator`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description:
      "Free AI video generator allowing users to animate portraits and produce viral dance clips from photos.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <HomeClient />
    </>
  );
}
