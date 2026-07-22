"use client";

import { IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoogleSignInButton, useGoogleIdentityError } from "@/components/auth/GoogleIdentityProvider";
import { useI18n } from "@/i18n/I18nContext";

type SignInPanelProps = {
  returnTo: string;
  hasOAuthError: boolean;
};

export function SignInPanel({ returnTo, hasOAuthError }: SignInPanelProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const hasGoogleError = useGoogleIdentityError();

  useEffect(() => {
    if (user) router.replace(returnTo);
  }, [router, returnTo, user]);

  const googleStartUrl = `/api/v1/auth/google/start?return_to=${encodeURIComponent(returnTo)}`;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-md items-center px-4 py-14 sm:px-0">
      <div className="w-full rounded-2xl border border-white/[0.11] bg-[#111113] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="mb-7 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6a22ff] via-[#bd22c7] to-[#ff4c68] text-white shadow-lg shadow-fuchsia-500/20">
          <IconSparkles size={21} stroke={2.2} />
        </div>
        <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          {t("auth.title")}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{t("auth.subtitle")}</p>

        {hasOAuthError ? (
          <p className="mt-5 rounded-lg border border-rose-400/20 bg-rose-400/[0.08] px-3 py-2.5 text-sm text-rose-200">
            {t("auth.oauthError")}
          </p>
        ) : null}

        <div className="mt-7">
          <GoogleSignInButton fallbackHref={googleStartUrl} />
        </div>
        {hasGoogleError ? <p className="mt-3 text-center text-xs text-rose-300">{t("auth.oauthError")}</p> : null}

        <p className="mt-5 text-center text-xs leading-5 text-zinc-500">{t("auth.privacyNote")}</p>
        <Link
          href="/"
          className="mt-6 block text-center text-sm font-medium text-zinc-300 transition hover:text-white"
        >
          {t("auth.backHome")}
        </Link>
      </div>
    </section>
  );
}
