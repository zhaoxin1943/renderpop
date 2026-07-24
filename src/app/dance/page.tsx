import type { Metadata } from "next";

import { DanceStudio } from "@/components/dance/DanceStudio";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Dance Generator",
  description:
    "Put anyone into a trending dance video with one clear photo. Choose a dance template or upload your own reference video.",
  alternates: {
    canonical: "/dance",
  },
  openGraph: {
    title: "AI Dance Generator | RenderPop",
    description:
      "Choose a dance, upload one clear photo, and create a motion-controlled AI video.",
    url: "/dance",
    type: "website",
  },
};

export default function DancePage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RenderPop AI Dance Generator",
    url: `${siteConfig.url}/dance`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description:
      "Motion-controlled AI dance video generation from a photo and a dance template.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <DanceStudio />
    </>
  );
}
