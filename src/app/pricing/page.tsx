import type { Metadata } from "next";
import { PricingPageContent } from "@/components/pricing/PricingPageContent";

export const metadata: Metadata = {
  title: "Pricing & Membership Plans | RenderPop AI",
  description:
    "Flexible membership plans and credit packs for RenderPop AI generation. Simple pricing, no hidden fees.",
};

export default function PricingPage() {
  return <PricingPageContent />;
}
