import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Payment successful
      </h1>
      <p className="text-sm leading-6 text-zinc-600">
        Credits or membership will appear after the Dodo webhook is processed.
        Refresh entitlements on the account page if the balance lags by a few
        seconds.
      </p>
      <div className="flex justify-center gap-3">
        <Link
          href="/account"
          className="inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          View account
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Generate
        </Link>
      </div>
    </div>
  );
}
