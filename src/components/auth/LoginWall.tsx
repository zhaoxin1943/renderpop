"use client";

import { IconSparkles, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { GoogleSignInButton, useGoogleIdentityError } from "@/components/auth/GoogleIdentityProvider";
import { useI18n } from "@/i18n/I18nContext";

type LoginWallProps = {
  open: boolean;
  returnTo: string;
  onClose: () => void;
};

export function LoginWall({ open, returnTo, onClose }: LoginWallProps) {
  const { t } = useI18n();
  const hasGoogleError = useGoogleIdentityError();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const googleStartUrl = `/api/v1/auth/google/start?return_to=${encodeURIComponent(returnTo)}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end bg-black/75 p-3 backdrop-blur-[3px] sm:items-center sm:justify-center sm:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-wall-title"
        className="w-full max-w-[25rem] rounded-2xl border border-white/[0.12] bg-[#121214] p-5 shadow-2xl shadow-black/60 sm:p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6a22ff] via-[#bd22c7] to-[#ff4c68] text-white shadow-lg shadow-fuchsia-500/20">
            <IconSparkles size={19} stroke={2.25} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.07] hover:text-white"
            aria-label={t("auth.closeWall")}
          >
            <IconX className="size-4" stroke={1.9} />
          </button>
        </div>

        <h2 id="login-wall-title" className="mt-5 text-xl font-semibold tracking-[-0.035em] text-white">
          {t("auth.wallTitle")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{t("auth.wallSubtitle")}</p>

        <div className="mt-6">
          <GoogleSignInButton fallbackHref={googleStartUrl} />
        </div>
        {hasGoogleError ? <p className="mt-3 text-center text-xs text-rose-300">{t("auth.oauthError")}</p> : null}
        <p className="mt-4 text-center text-xs leading-5 text-zinc-500">{t("auth.wallReturnNote")}</p>
      </section>
    </div>
  );
}
