"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nContext";
import { createCheckoutSession, fetchProducts, apiFetch } from "@/lib/api";
import type { EntitlementsResponse, ProductResponse } from "@/lib/types";
import { PricingFaqSection } from "@/components/pricing/PricingFaqSection";

export function PricingPageContent() {
  const { t } = useI18n();
  const router = useRouter();

  const [tab, setTab] = useState<"monthly" | "packs">("monthly");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoadingCode, setCheckoutLoadingCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [prodRes, entRes] = await Promise.allSettled([
          fetchProducts(),
          apiFetch<EntitlementsResponse>("/me/entitlements"),
        ]);

        if (!active) return;

        if (prodRes.status === "fulfilled") {
          setProducts(prodRes.value.items || []);
        }

        if (entRes.status === "fulfilled") {
          setEntitlements(entRes.value);
        }
      } catch (err) {
        console.error("Failed to load pricing data", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleCheckout = async (product: ProductResponse) => {
    setErrorMsg(null);
    setCheckoutLoadingCode(product.code);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const res = await createCheckoutSession({
        productCode: product.code,
        successUrl: `${origin}/payment/success?order_id={ORDER_ID}`,
        cancelUrl: `${origin}/pricing`,
      });

      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        // Fallback for stub checkout sessions without direct checkout_url
        router.push(`/payment/success?order_id=${res.order_id}`);
      }
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      if (err instanceof Error && err.message.includes("401")) {
        router.push("/sign-in");
      } else {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : t("pricingPage.checkoutError")
        );
      }
    } finally {
      setCheckoutLoadingCode(null);
    }
  };

  const monthlyProducts = products.filter((p) => p.product_type === "SUBSCRIPTION");
  const packProducts = products.filter((p) => p.product_type === "CREDIT_PACK");

  // Fallback defaults if backend is unreachable or seeding incomplete
  const fallbackMonthly: ProductResponse[] = [
    {
      code: "CREATOR_MONTHLY",
      name: "Creator",
      product_type: "SUBSCRIPTION",
      plan_code: "CREATOR",
      billing_interval: "month",
      credits_granted: 1000,
      amount_minor: 999,
      currency: "USD",
      environment: "production",
    },
    {
      code: "PRO_MONTHLY",
      name: "Pro",
      product_type: "SUBSCRIPTION",
      plan_code: "PRO",
      billing_interval: "month",
      credits_granted: 2400,
      amount_minor: 1999,
      currency: "USD",
      environment: "production",
    },
  ];

  const fallbackPacks: ProductResponse[] = [
    {
      code: "CREDIT_400",
      name: "400 Credits",
      product_type: "CREDIT_PACK",
      plan_code: null,
      billing_interval: null,
      credits_granted: 400,
      amount_minor: 499,
      currency: "USD",
      environment: "production",
    },
    {
      code: "CREDIT_900",
      name: "900 Credits",
      product_type: "CREDIT_PACK",
      plan_code: null,
      billing_interval: null,
      credits_granted: 900,
      amount_minor: 999,
      currency: "USD",
      environment: "production",
    },
    {
      code: "CREDIT_2000",
      name: "2,000 Credits",
      product_type: "CREDIT_PACK",
      plan_code: null,
      billing_interval: null,
      credits_granted: 2000,
      amount_minor: 1999,
      currency: "USD",
      environment: "production",
    },
  ];

  const displayMonthly = monthlyProducts.length > 0 ? monthlyProducts : fallbackMonthly;
  const displayPacks = packProducts.length > 0 ? packProducts : fallbackPacks;

  const currentPlanCode = entitlements?.plan || null;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      {/* Background Neon Ambient Lighting */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-purple-900/20 via-fuchsia-900/10 to-transparent blur-3xl opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        {/* Header Hero */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t("pricingPage.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 sm:text-base">
            {t("pricingPage.subtitle")}
          </p>

          {/* Pill-style Tab Switcher (Creen.ai Inspired) */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#0c0c0c] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <button
                type="button"
                onClick={() => setTab("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm ${
                  tab === "monthly"
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {t("pricingPage.tabMonthly")}
              </button>
              <button
                type="button"
                onClick={() => setTab("packs")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all sm:text-sm ${
                  tab === "packs"
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>{t("pricingPage.tabPacks")}</span>
                <span className="rounded-md bg-gradient-to-r from-amber-400 to-pink-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-black">
                  {t("pricingPage.tabPacksBadge")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Content Section */}
        <div className="mt-12">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-2xl border border-white/5 bg-[#0e0e11]"
                />
              ))}
            </div>
          ) : tab === "monthly" ? (
            /* Monthly Subscriptions */
            <div className="grid gap-8 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
              {displayMonthly.map((product) => {
                const isPro = product.code === "PRO_MONTHLY";
                const isCurrent = currentPlanCode === product.plan_code;
                const isBusy = checkoutLoadingCode === product.code;

                const dailyFast = isPro ? 60 : 30;
                const queueName = isPro
                  ? t("pricingPage.highPriorityQueue")
                  : t("pricingPage.priorityQueue");

                return (
                  <div
                    key={product.code}
                    className={`relative flex flex-col justify-between rounded-2xl border p-8 transition-all duration-200 ${
                      isPro
                        ? "border-purple-500/50 bg-gradient-to-b from-[#140f24] to-[#0c0a14] shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                        : "border-white/10 bg-[#0c0c10] hover:border-white/20"
                    }`}
                  >
                    {isPro && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                        {t("pricingPage.mostPopular")}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">
                          {product.name}
                        </h3>
                        {isCurrent && (
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            {t("pricingPage.currentPlan")}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white sm:text-5xl">
                          ${(product.amount_minor / 100).toFixed(2)}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {t("pricingPage.perMonth")}
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-semibold text-purple-400">
                        {product.credits_granted.toLocaleString()} Credits included
                      </p>

                      <div className="mt-6 border-t border-white/5 pt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          {t("pricingPage.featuresHeader")}
                        </p>
                        <ul className="mt-4 space-y-3 text-xs text-zinc-300">
                          <li className="flex items-center gap-2.5">
                            <span className="size-1.5 rounded-full bg-purple-400" />
                            <span>
                              {dailyFast} Free Fast generations / day
                            </span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <span className="size-1.5 rounded-full bg-purple-400" />
                            <span>
                              Dance Video member discount (100 Credits/run)
                            </span>
                          </li>

                          <li className="flex items-center gap-2.5">
                            <span className="size-1.5 rounded-full bg-purple-400" />
                            <span>{queueName}</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <span className="size-1.5 rounded-full bg-purple-400" />
                            <span>Pro Model & Video generation access</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isBusy || isCurrent}
                      onClick={() => handleCheckout(product)}
                      className={`mt-8 w-full rounded-xl py-3 text-xs font-bold transition ${
                        isCurrent
                          ? "cursor-default border border-white/10 bg-white/5 text-zinc-400"
                          : isPro
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:brightness-110 shadow-lg"
                          : "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      {isBusy
                        ? t("pricingPage.redirectingToCheckout")
                        : isCurrent
                        ? t("pricingPage.currentPlan")
                        : t("pricingPage.subscribeNow")}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Credit Packs */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayPacks.map((product) => {
                const isLarge = product.code === "CREDIT_2000";
                const isBusy = checkoutLoadingCode === product.code;

                return (
                  <div
                    key={product.code}
                    className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                      isLarge
                        ? "border-purple-500/50 bg-[#120d1f]"
                        : "border-white/10 bg-[#0c0c10] hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">
                          {product.name}
                        </h3>
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                          {t("pricingPage.oneTime")}
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white sm:text-4xl">
                          ${(product.amount_minor / 100).toFixed(2)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs font-semibold text-purple-300">
                        +{product.credits_granted.toLocaleString()} Credits
                      </p>

                      <div className="mt-6 border-t border-white/5 pt-4">
                        <ul className="space-y-2 text-xs text-zinc-400">
                          <li className="flex items-center gap-2">
                            <span className="size-1 rounded-full bg-zinc-500" />
                            <span>{t("pricingPage.packValidNotice")}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="size-1 rounded-full bg-zinc-500" />
                            <span>{t("pricingPage.fefoOrderNotice")}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleCheckout(product)}
                      className={`mt-6 w-full rounded-xl py-2.5 text-xs font-bold transition ${
                        isLarge
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:brightness-110"
                          : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {isBusy
                        ? t("pricingPage.redirectingToCheckout")
                        : t("pricingPage.buyPack")}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <PricingFaqSection />
    </div>
  );
}
