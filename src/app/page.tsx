import type { Metadata } from "next";

import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "RenderPop AI: Free AI Image & Video Generator (No Sign Up)",
  description:
    "RenderPop AI is a free AI image and video generator powered by GPT Image 2 fine-tuning. Generate photorealistic human portraits and 1080p motion videos with free daily credits and zero sign up.",
  keywords: [
    "free ai image generator",
    "ai video generator",
    "free ai video generator",
    "ai image generator no sign up",
    "photo to video generator",
    "gpt image 2 portrait generator",
    "photorealistic ai generator",
    "ai generator no login",
    "text to video free",
    "generador de imagenes de ia gratis",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    title: "RenderPop AI: Free AI Image & Video Generator (No Sign Up)",
    description:
      "Create photorealistic AI portraits and 1080p videos without complex model setup. Free daily credits, zero friction.",
    url: "/",
    siteName: "RenderPop AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RenderPop AI: Free AI Image & Video Generator (No Sign Up)",
    description:
      "Create photorealistic AI portraits and 1080p videos without complex model setup. Free daily credits, zero friction.",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1280",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqItems = [
    {
      q: "Is RenderPop AI really free to use?",
      a: "Yes. Visitors can generate 2 Fast images daily without signing up. Registered free accounts receive 5 daily Fast generations plus 20 bonus credits upon registration."
    },
    {
      q: "Do I need to sign up or log in to create?",
      a: "No sign up or login is required for initial trial. RenderPop offers a true no-login instant AI creation experience right from your browser."
    },
    {
      q: "How does RenderPop achieve hyper-realistic human portraits?",
      a: "Our architecture is powered by a custom GPT Image 2 model specifically fine-tuned for human portraiture, skin pore textures, eye reflections, and professional studio lighting."
    },
    {
      q: "What AI models are integrated into RenderPop?",
      a: "RenderPop integrates 28 video generation models (including Sora 2 Pro, VEO 3.1, Kling V3, Hailuo 02) and 11 image generation models (featuring GPT Image 2), with audio synthesis tools."
    },
    {
      q: "How does RenderPop compare to Midjourney, Sora, or Runway?",
      a: "Instead of locking you into a single platform or requiring subscription traps, RenderPop unifies the world's leading generative models behind one clean interface."
    },
    {
      q: "Can I animate a still portrait photo into a video clip?",
      a: "Yes! Drop any still photo into our Photo-to-Video tool to generate a smooth 1080p video clip with natural facial expressions and organic camera movement."
    },
    {
      q: "Can I use generated images and videos for commercial work?",
      a: "Yes. All assets created on RenderPop carry full commercial ownership rights for ads, e-commerce lookbooks, social media campaigns, and client work."
    },
    {
      q: "What is the maximum output resolution?",
      a: "RenderPop exports ultra-clear images up to 4K resolution and high-definition video clips up to 1080p at 24fps."
    },
    {
      q: "How long does each generation take?",
      a: "Fast mode images generate in 5–12 seconds. Pro mode images and photo-to-video clips typically render in 15–35 seconds."
    },
    {
      q: "Are there any watermarks on exported assets?",
      a: "No. All exported high-resolution images and 1080p video clips are 100% clean and watermark-free."
    },
    {
      q: "Do unused monthly subscription credits roll over?",
      a: "Yes. Active subscription credits automatically roll over into your next monthly billing cycle, up to 2x your plan's monthly allocation."
    },
    {
      q: "Can I generate adult, NSFW, or deepfake content?",
      a: "No. RenderPop enforces strict AI content moderation and strictly prohibits any 18+ adult material, NSFW art, or non-consensual celebrity impersonation."
    },
    {
      q: "Does RenderPop store or train models on my uploaded photos?",
      a: "No. We respect privacy. Your uploaded photos and generated private assets are never used to train public generative AI models."
    },
    {
      q: "Why does the same prompt produce different variations?",
      a: "Generative AI is stochastic by nature. Each run provides creative variations—a key advantage for exploring different lighting moods and angles."
    },
    {
      q: "What payment methods are supported for top-ups?",
      a: "We process payments via Dodo Payments, accepting all major credit cards, Apple Pay, Google Pay, and localized digital wallets."
    },
    {
      q: "Why doesn't RenderPop require users to manually select or switch AI models?",
      a: "Choosing between dozens of technical AI models is confusing for non-expert users. RenderPop's intelligent auto-routing engine handles this automatically: just enter your prompt, and our system pairs it with the optimal fine-tuned model (like GPT Image 2 for portraits) for instant, perfect results."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
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
