import type { Metadata } from "next";

import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Free AI Image Generator (No Sign Up Required)",
  description:
    "Generate AI images instantly with RenderPop. Free daily Fast generations without signing up, plus a high-detail Pro mode.",
  keywords: [
    "free ai image generator",
    "ai image generator free no sign up",
    "generador de imagenes de ia gratis sin registro",
    "free ai generator",
    "text to image free",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    title: "Free AI Image Generator (No Sign Up) | RenderPop",
    description:
      "Create images from prompts with free daily Fast generations. No registration or complex model setup required.",
    url: "/",
  },
};

export default function HomePage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is RenderPop really free to use without signing up?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! RenderPop allows visitors to create free AI images instantly without signing up or creating an account. You get free daily Fast generations.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between Fast and Pro mode?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fast mode is free and optimized for speed. Pro mode uses high-precision models for commercial-grade artwork and maximum detail.",
        },
      },
      {
        "@type": "Question",
        name: "What can I create with RenderPop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RenderPop creates AI images from text prompts. Choose Fast for free daily generations or Pro for more detail.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient />
    </>
  );
}
