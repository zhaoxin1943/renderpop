import type { Metadata } from "next";

import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Image & Video Generator",
  description:
    "Create AI images from prompts, or turn a prompt or still image into an AI video. Fast image generations are free daily.",
  keywords: [
    "free ai image generator",
    "ai video generator",
    "image to video generator",
    "generador de imagenes de ia",
    "ai image generator",
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
    title: "AI Image & Video Generator | RenderPop",
    description:
      "Create images from prompts, then turn a prompt or a still image into a video without model setup.",
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
        name: "Which RenderPop creations are free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fast image generation includes a daily free allowance. Video creation uses credits and requires sign-in.",
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
          text: "RenderPop creates AI images from text prompts, plus videos from a prompt or a still image. Image-to-video output keeps the source image ratio.",
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
