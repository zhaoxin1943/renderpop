"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nContext";
import { apiFetch } from "@/lib/api";

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptNotification = {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        itp_support?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type: "standard";
          theme: "outline";
          size: "large";
          text: "continue_with";
          shape: "rectangular";
          logo_alignment: "left";
          width: number;
        },
      ) => void;
      prompt: (momentListener?: (notification: GooglePromptNotification) => void) => void;
      cancel: () => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

type GoogleClientConfig = {
  client_id: string;
};

type GoogleIdentityContextValue = {
  status: "loading" | "ready" | "unavailable";
  isSubmitting: boolean;
  error: string | null;
  renderButton: (element: HTMLElement) => void;
  promptOneTap: () => void;
  cancelOneTap: () => void;
};

const GoogleIdentityContext = createContext<GoogleIdentityContextValue | undefined>(undefined);

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("google-identity-services") as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    const complete = () => window.google?.accounts.id ? resolve() : reject(new Error("Google Identity Services did not load."));
    script.addEventListener("load", complete, { once: true });
    script.addEventListener("error", () => reject(new Error("Google Identity Services failed to load.")), { once: true });
    if (!existing) {
      script.id = "google-identity-services";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
  return googleScriptPromise;
}

export function GoogleIdentityProvider({
  children,
  onSignedIn,
}: {
  children: ReactNode;
  onSignedIn: () => Promise<void>;
}) {
  const [status, setStatus] = useState<GoogleIdentityContextValue["status"]>("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeCredential = useCallback(async (credential: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiFetch("/auth/google/credential", {
        method: "POST",
        body: { credential },
        headers: { "X-Requested-With": "XMLHttpRequest" },
        skipVisitor: true,
      });
      await onSignedIn();
    } catch {
      setError("We couldn't complete that sign-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [onSignedIn]);

  useEffect(() => {
    let active = true;
    void Promise.all([
      apiFetch<GoogleClientConfig>("/auth/google/config", { skipVisitor: true }),
      loadGoogleIdentityScript(),
    ])
      .then(([config]) => {
        if (!active || !window.google?.accounts.id) return;
        window.google.accounts.id.initialize({
          client_id: config.client_id,
          callback: (response) => {
            if (response.credential) void completeCredential(response.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
          use_fedcm_for_prompt: false,
        });
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("unavailable");
      });
    return () => {
      active = false;
    };
  }, [completeCredential]);

  const renderButton = useCallback((element: HTMLElement) => {
    if (!window.google?.accounts.id) return;
    element.replaceChildren();
    const width = Math.min(344, Math.floor(element.getBoundingClientRect().width || 344));
    window.google.accounts.id.renderButton(element, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width,
    });
  }, []);

  const promptOneTap = useCallback(() => {
    if (status !== "ready" || !window.google?.accounts.id) return;
    window.google.accounts.id.prompt();
  }, [status]);

  const cancelOneTap = useCallback(() => {
    if (!window.google?.accounts.id) return;
    try {
      window.google.accounts.id.cancel();
    } catch {
      // Ignore cleanup errors
    }
  }, []);

  const value = useMemo(
    () => ({ status, isSubmitting, error, renderButton, promptOneTap, cancelOneTap }),
    [status, isSubmitting, error, renderButton, promptOneTap, cancelOneTap],
  );

  return <GoogleIdentityContext.Provider value={value}>{children}</GoogleIdentityContext.Provider>;
}

function useGoogleIdentity() {
  const context = useContext(GoogleIdentityContext);
  if (!context) throw new Error("useGoogleIdentity must be used within GoogleIdentityProvider");
  return context;
}

export function useGoogleIdentityError() {
  return Boolean(useGoogleIdentity().error);
}

export function GoogleSignInButton({ fallbackHref }: { fallbackHref: string }) {
  const { status, isSubmitting, renderButton } = useGoogleIdentity();
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "ready" && ref.current) renderButton(ref.current);
  }, [renderButton, status]);

  if (status === "unavailable") {
    return (
      <a
        href={fallbackHref}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        {t("auth.continueGoogle")}
      </a>
    );
  }

  return (
    <div className={isSubmitting ? "pointer-events-none opacity-70" : ""} aria-busy={isSubmitting}>
      <div ref={ref} className="min-h-11 overflow-hidden rounded-lg [&>div]:!w-full" />
    </div>
  );
}

export function GoogleOneTap({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const { status, promptOneTap, cancelOneTap } = useGoogleIdentity();
  const prompted = useRef(false);

  useEffect(() => {
    if (!enabled || pathname !== "/" || status !== "ready" || prompted.current) return;
    const timer = window.setTimeout(() => {
      prompted.current = true;
      promptOneTap();
    }, 1200);
    return () => {
      window.clearTimeout(timer);
      if (prompted.current) {
        cancelOneTap();
      }
    };
  }, [cancelOneTap, enabled, pathname, promptOneTap, status]);

  return null;
}
