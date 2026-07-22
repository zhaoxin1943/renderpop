import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

const FEATURE_PAGES: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  "photo-to-dance": {
    title: "Photo to Dance AI Free — Make Any Portrait Dance",
    description:
      "Transform any portrait photo into a viral dance video clip using RenderPop AI. Unlimited free previews, no sign up required.",
    keywords: [
      "photo to dance ai free",
      "photo dance generator",
      "make picture dance free",
      "ai photo dance online",
    ],
  },
  "photo-animation": {
    title: "Free AI Photo Animator — Animate Pictures Online",
    description:
      "Bring still images to life with AI motion control and facial animation. Free online photo animator with no login.",
    keywords: [
      "photo animation free",
      "ai photo animator",
      "animate photo online",
      "image animation generator",
    ],
  },
  "ai-avatar": {
    title: "Free AI Avatar Generator — Create High Detail Avatars",
    description:
      "Generate custom AI avatars and portraits from simple prompts or reference photos. Fast, free daily generations.",
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
