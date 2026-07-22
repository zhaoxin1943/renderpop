import type { Metadata } from "next";
import { AccountPanel } from "@/components/auth/AccountPanel";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your RenderPop profile and credits.",
};

export default function AccountPage() {
  return <AccountPanel />;
}
