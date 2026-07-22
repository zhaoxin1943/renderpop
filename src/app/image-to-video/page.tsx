import type { Metadata } from "next";
import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Image to Video AI Generator",
  description:
    "Turn a still image into an AI video. RenderPop automatically matches the video composition to your source image.",
  keywords: [
    "image to video",
    "image to video generator",
    "ai photo animation",
    "animate photo with ai",
    "image to video ai",
  ],
  alternates: {
    canonical: "/image-to-video",
  },
  openGraph: {
    title: "Image to Video AI Generator | RenderPop",
    description:
      "Turn a source image into an AI video while keeping its natural composition.",
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
      "Image-to-video creator for turning a source image into an AI video.",
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
