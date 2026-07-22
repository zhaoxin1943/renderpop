import type { Metadata } from "next";
import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Image to Video Generator — Photo Animation & Dance Free",
  description:
    "Convert any static image into a high quality video or dance animation. Instant free image-to-video generator. No login or credit card required.",
  keywords: [
    "image to video",
    "image to video generator",
    "photo to dance ai free",
    "ai photo animator",
    "animate portrait free",
    "image to video ai free",
  ],
  alternates: {
    canonical: "/image-to-video",
  },
  openGraph: {
    title: "AI Image to Video Generator — Instant Photo Animation | RenderPop",
    description:
      "Turn static pictures into lively dancing video clips. Fast, free previews without account registration.",
    url: "/image-to-video",
  },
};

export default function ImageToVideoPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RenderPop Image to Video AI",
    url: `${siteConfig.url}/image-to-video`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description:
      "Instant image-to-video converter turning portraits into dance animations.",
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
