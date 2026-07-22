import type { Metadata } from "next";
import { SignInPanel } from "@/components/auth/SignInPanel";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to RenderPop with Google.",
};

type SearchParams = Promise<{ return_to?: string | string[]; error?: string | string[] }>;

function safeReturnTo(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) return "/";
  if (candidate.includes("\\") || candidate.includes("://")) return "/";
  return candidate;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  return <SignInPanel returnTo={safeReturnTo(params.return_to)} hasOAuthError={Boolean(params.error)} />;
}
