import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account",
  description: "Profile, credits, and generation history.",
};

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Account
        </h1>
        <p className="max-w-xl text-sm leading-6 text-zinc-600">
          Will load{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            GET /api/v1/me
          </code>
          ,{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            GET /api/v1/me/entitlements
          </code>
          , and credit transactions once session auth is live.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {["Profile", "Credits", "History"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-dashed border-zinc-300 bg-white p-5"
          >
            <h2 className="text-sm font-semibold text-zinc-900">{label}</h2>
            <p className="mt-2 text-sm text-zinc-500">Placeholder</p>
          </div>
        ))}
      </div>

      <Link
        href="/sign-in?return_to=/account"
        className="inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Sign in
      </Link>
    </div>
  );
}
