import type { Metadata } from "next";
import { HomeClient } from "@/components/generate/HomeClient";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Video Generator | Text to Video & Image to Video",
  description:
    "Create short AI videos from a prompt or animate a still image. Choose duration, quality, and optional audio in a focused video workspace.",
  keywords: [
    "ai video generator",
    "text to video generator",
    "image to video generator",
    "ai motion generator",
  ],
  alternates: {
    canonical: "/ai-video-generator",
  },
  openGraph: {
    title: "AI Video Generator | Text to Video & Image to Video | RenderPop",
    description:
      "Create videos from prompts or animate a source image with simple, focused controls.",
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
      "AI video generator for text-to-video and image-to-video creation.",
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
