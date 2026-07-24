import type { Metadata } from "next";

import { DanceSEOContent } from "@/components/dance/DanceSEOContent";
import { DanceStudio } from "@/components/dance/DanceStudio";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "AI Motion Control Video & Dance Generator: Image to Video | RenderPop",
  description:
    "Turn any photo or video into controllable AI motion videos. RenderPop AI Motion Control empowers Image to Video & Video to Video dance generation with Kling precision.",
  keywords: [
    "AI motion control video",
    "motion control",
    "image to video",
    "video to video",
    "Kling motion control",
    "AI dance generator",
    "motion transfer AI",
    "reference to video AI",
    "mimic motion AI",
    "picture to motion AI",
    "photo dance AI",
  ],
  alternates: {
    canonical: `${siteConfig.url}/dance`,
  },
  openGraph: {
    title: "AI Motion Control Video & Dance Generator | RenderPop",
    description:
      "Turn any photo or video into controllable AI dance videos with precision motion transfer.",
    url: `${siteConfig.url}/dance`,
    type: "website",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Motion Control Video & Dance Generator | RenderPop",
    description:
      "Turn any photo or video into controllable AI dance videos with precision motion transfer.",
  },
};

export default function DancePage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RenderPop AI Motion Control Video & Dance Generator",
    url: `${siteConfig.url}/dance`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description:
      "Precision motion-controlled AI video generation from a photo and a dance template or custom reference video.",
    featureList: [
      "Image to Video Motion Control",
      "Video to Video Custom Motion Transfer",
      "Kling AI Motion Control Engine",
      "Photo to Dance Video Animation",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is RenderPop AI Motion Control Video free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, RenderPop offers free daily credits so you can test and generate AI motion control videos and photo dance AI loops without hidden paywalls.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to sign up or log in to create AI dance videos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No sign up or login is required to explore templates and generate fast daily dance videos. You can turn photos into dancing clips instantly in your browser.",
        },
      },
      {
        "@type": "Question",
        name: "How does AI motion control dance generation work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You provide an authorized reference photo for your character and a reference dance video. The motion transfer AI reads the movement path and pose keypoints, applying every dance move seamlessly onto your photo.",
        },
      },
      {
        "@type": "Question",
        name: "Which AI model powers motion control on RenderPop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our motion engine is powered by state-of-the-art Kling AI motion control algorithms fine-tuned for fluid dance choreography and portrait facial retention.",
        },
      },
      {
        "@type": "Question",
        name: "Can I make a still photo move or dance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! This is a true photo dance AI free workflow. Upload a still picture, pick a dance template, and make a picture move with realistic body motion and clean motion sync.",
        },
      },
      {
        "@type": "Question",
        name: "Can I upload my own custom dance video (Video to Video)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! You can upload custom reference video clips from Instagram or TikTok. The AI will extract the motion capture data from your video and drive your photo to replicate those dance moves.",
        },
      },
      {
        "@type": "Question",
        name: "Can I reuse one dance video across multiple photos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Apply one reference dance video to multiple character photos to mimic characters across a series while maintaining identical choreography and timing.",
        },
      },
      {
        "@type": "Question",
        name: "What photo works best, and what are the permission requirements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Clear, well-lit full-body or waist-up photos work best. Please ensure you only upload authorized photos and character images you have permission to use.",
        },
      },
      {
        "@type": "Question",
        name: "What resolution can I export for Instagram Reels and TikTok?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can export motion-controlled dance videos in high-definition 1080p resolution, pre-formatted for Instagram Reels, TikTok, and YouTube Shorts.",
        },
      },
      {
        "@type": "Question",
        name: "Are there content moderation rules for AI Motion Control?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, RenderPop actively moderates content to ensure family-friendly creativity and platform safety. Explicit, non-consensual, or unapproved material will be blocked.",
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
      <DanceStudio />
      <DanceSEOContent />
    </>
  );
}

