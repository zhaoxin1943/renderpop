import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Membership plans and credit packs for RenderPop generation.",
};

const plans = [
  {
    code: "CREATOR_MONTHLY",
    name: "Creator",
    price: "$9.99",
    period: "/ month",
    blurb: "1,000 credits per billing period.",
  },
  {
    code: "PRO_MONTHLY",
    name: "Pro",
    price: "$19.99",
    period: "/ month",
    blurb: "2,400 credits per billing period.",
  },
] as const;

const packs = [
  { code: "CREDIT_400", name: "400 credits", price: "One-time" },
  { code: "CREDIT_900", name: "900 credits", price: "One-time" },
  { code: "CREDIT_2000", name: "2,000 credits", price: "One-time" },
] as const;

export default function PricingPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Pricing
        </h1>
        <p className="max-w-xl text-sm leading-6 text-zinc-600">
          Checkout will call{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            POST /api/v1/billing/checkout-sessions
          </code>
          . Catalog comes from{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
            GET /api/v1/billing/products
          </code>
          .
        </p>
      </div>

      <section className="space-y-4" aria-labelledby="memberships">
        <h2 id="memberships" className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Memberships
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.code}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-zinc-900">{plan.name}</h3>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">
                {plan.price}
                <span className="text-sm font-normal text-zinc-500">
                  {plan.period}
                </span>
              </p>
              <p className="mt-2 flex-1 text-sm text-zinc-600">{plan.blurb}</p>
              <p className="mt-4 text-xs text-zinc-400">SKU: {plan.code}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="packs">
        <h2 id="packs" className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Credit packs
        </h2>
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {packs.map((pack) => (
            <li
              key={pack.code}
              className="flex items-center justify-between px-5 py-4 text-sm"
            >
              <span className="font-medium text-zinc-900">{pack.name}</span>
              <span className="text-zinc-500">
                {pack.price} · {pack.code}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-zinc-500">
        Live checkout wiring is next.{" "}
        <Link href="/sign-in" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
          Sign in
        </Link>{" "}
        first when auth is ready.
      </p>
    </div>
  );
}
