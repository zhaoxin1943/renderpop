import type { Metadata } from "next";
import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Free AI Image Generator - No Sign Up Required",
  description:
    "Generate stunning AI images instantly with RenderPop. Free daily Fast generations with no login or registration needed. High quality AI art generator.",
  keywords: [
    "free ai image generator",
    "ai image generator free no sign up",
    "free ai generator",
    "text to image free",
    "ai picture generator free",
    "ai image creator online",
  ],
  alternates: {
    canonical: "/ai-image-generator",
  },
  openGraph: {
    title: "Free AI Image Generator - No Sign Up | RenderPop",
    description:
      "Create high quality AI art and images with free daily Fast generations. No registration or complex setup required.",
    url: "/ai-image-generator",
  },
};

export default function AiImageGeneratorPage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RenderPop AI Image Generator",
    url: `${siteConfig.url}/ai-image-generator`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description:
      "Free AI image generator with no sign-up required. Produce high quality AI art instantly.",
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
