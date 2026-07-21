import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment failed",
};

export default function PaymentFailPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Payment failed
      </h1>
      <p className="text-sm leading-6 text-zinc-600">
        No charges were applied, or the session expired before completion. You
        can try again from pricing.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/pricing"
          className="inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Back to pricing
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
