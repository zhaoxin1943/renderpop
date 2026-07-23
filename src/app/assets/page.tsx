import type { Metadata } from "next";
import { AssetsGallery } from "@/components/assets/AssetsGallery";

export const metadata: Metadata = {
  title: "My Assets",
  description: "Browse your completed RenderPop image and video creations.",
};

export default function AssetsPage() {
  return <AssetsGallery />;
}
