"use client";

import { IconArrowRight, IconCoins, IconLoader2, IconLogout2, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/api";
import type { EntitlementsResponse } from "@/lib/types";
import { useI18n } from "@/i18n/I18nContext";

function displayName(user: { display_name: string | null; email: string | null }) {
  return user.display_name || user.email?.split("@")[0] || "RenderPop user";
}

export function AccountPanel() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const { t } = useI18n();
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(null);
  const [error, setError] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void apiFetch<EntitlementsResponse>("/me/entitlements", { skipVisitor: true })
      .then((data) => {
        if (active) setEntitlements(data);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [user]);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-5xl items-center justify-center px-4">
        <IconLoader2 className="animate-spin text-zinc-500" size={22} />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-md items-center px-4 py-14 sm:px-0">
        <div className="w-full rounded-2xl border border-white/[0.11] bg-[#111113] p-7 text-center">
          <IconSparkles className="mx-auto text-fuchsia-300" size={25} />
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{t("auth.accountLocked")}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{t("auth.accountLockedCopy")}</p>
          <Link
            href="/sign-in?return_to=/account"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            {t("common.signIn")}
            <IconArrowRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-fuchsia-300">{t("auth.accountEyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">{displayName(user)}</h1>
          {user.email ? <p className="mt-2 text-sm text-zinc-500">{user.email}</p> : null}
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 text-sm font-medium text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white disabled:cursor-wait disabled:opacity-60"
        >
          {isSigningOut ? <IconLoader2 className="animate-spin" size={16} /> : <IconLogout2 size={16} />}
          {t("auth.signOut")}
        </button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/[0.09] bg-[#111113] p-6">
          <p className="text-sm text-zinc-500">{t("auth.plan")}</p>
          <p className="mt-3 text-2xl font-semibold capitalize tracking-[-0.03em] text-white">
            {entitlements?.plan?.toLowerCase() ?? t("auth.loading")}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {entitlements?.membership_active ? t("auth.membershipActive") : t("auth.freePlan")}
          </p>
        </article>
        <article className="rounded-2xl border border-white/[0.09] bg-[#111113] p-6">
          <div className="flex items-center gap-2 text-zinc-500">
            <IconCoins size={17} />
            <p className="text-sm">{t("auth.credits")}</p>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
            {entitlements?.credits.available ?? "—"}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {entitlements ? t("auth.creditsAvailable") : error ? t("auth.creditsUnavailable") : t("auth.loading")}
          </p>
        </article>
      </div>
    </section>
  );
}
