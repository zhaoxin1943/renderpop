import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

const FEATURE_PAGES: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  "image-to-video": {
    title: "Image to Video AI - Animate a Still Image",
    description:
      "Turn a still image into an AI video with a motion prompt. RenderPop matches the output composition to your source image.",
    keywords: [
      "image to video ai",
      "animate photo with ai",
      "image animation generator",
    ],
  },
  "photo-animation": {
    title: "AI Photo Animator - Animate Pictures Online",
    description:
      "Bring still images to life with a focused AI image-to-video workspace and a prompt for the motion you want.",
    keywords: [
      "photo animation",
      "ai photo animator",
      "animate photo online",
      "image animation generator",
    ],
  },
  "ai-avatar": {
    title: "AI Avatar Generator - Create Detailed Avatars",
    description:
      "Generate custom AI avatars and portraits from a prompt. Fast image generation includes a daily free allowance.",
    keywords: [
      "ai avatar generator",
      "free ai avatar creator",
      "ai portrait generator",
      "avatar generator no sign up",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = FEATURE_PAGES[slug];
  if (!feature) return {};

  return {
    title: feature.title,
    description: feature.description,
    keywords: feature.keywords,
    alternates: {
      canonical: `/features/${slug}`,
    },
    openGraph: {
      title: `${feature.title} | ${siteConfig.name}`,
      description: feature.description,
      url: `/features/${slug}`,
    },
  };
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params;
  const feature = FEATURE_PAGES[slug];

  if (!feature) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: feature.title,
    url: `${siteConfig.url}/features/${slug}`,
    description: feature.description,
    applicationCategory: "MultimediaApplication",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomeClient />
    </>
  );
}
