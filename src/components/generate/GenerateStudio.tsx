"use client";

import { startTransition, useCallback, useEffect, useId, useRef, useState } from "react";
import {
  IconAlertTriangle,
  IconArrowUp,
  IconBolt,
  IconCrown,
  IconDownload,
  IconLoader2,
} from "@tabler/icons-react";
import { useI18n } from "@/i18n/I18nContext";
import { ApiError, apiFetch } from "@/lib/api";
import {
  ASPECT_RATIOS,
  DEFAULT_ASPECT_RATIO,
  type AspectRatio,
  type EntitlementsResponse,
  type GenerationTaskResponse,
} from "@/lib/types";

const TERMINAL = new Set([
  "SUCCEEDED",
  "FAILED",
  "REJECTED",
  "CANCELED",
  "EXPIRED",
]);

type StudioProps = {
  seedPrompt?: string | null;
  seedAspect?: string | null;
  onSeedConsumed?: () => void;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function GenerateStudio({
  seedPrompt,
  seedAspect,
  onSeedConsumed,
}: StudioProps) {
  const { t } = useI18n();
  const promptId = useId();
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<AspectRatio>(DEFAULT_ASPECT_RATIO);
  const [mode, setMode] = useState<"FAST" | "PRO">("FAST");
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadEntitlements = useCallback(async () => {
    try {
      const data = await apiFetch<EntitlementsResponse>("/me/entitlements");
      setEntitlements(data);
    } catch {
      // Soft-fail
    }
  }, []);

  useEffect(() => {
    let active = true;
    void apiFetch<EntitlementsResponse>("/me/entitlements")
      .then((data) => {
        if (active) setEntitlements(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [loadEntitlements]);

  useEffect(() => {
    if (seedPrompt) {
      startTransition(() => {
        setPrompt(seedPrompt);
        if (seedAspect && ASPECT_RATIOS.includes(seedAspect as AspectRatio)) {
          setAspect(seedAspect as AspectRatio);
        }
      });
      onSeedConsumed?.();
      textareaRef.current?.focus();
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [seedPrompt, seedAspect, onSeedConsumed]);

  async function pollUntilDone(jobId: string, signal: AbortSignal) {
    for (let i = 0; i < 90; i++) {
      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      const task = await apiFetch<GenerationTaskResponse>(
        `/generations/${jobId}`,
        { signal },
      );
      setStatusLabel(task.status.replaceAll("_", " "));
      if (TERMINAL.has(task.status)) {
        return task;
      }
      if (i > 0 && i % 3 === 0) {
        try {
          await apiFetch<GenerationTaskResponse>(`/generations/${jobId}/poll`, {
            method: "POST",
            signal,
          });
        } catch {
          // ignore poll errors
        }
      }
      await sleep(2000);
    }
    throw new Error("Generation timed out. Please try again.");
  }

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || busy) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setBusy(true);
    setError(null);
    setResultUrl(null);
    setStatusLabel("starting");

    try {
      const created = await apiFetch<GenerationTaskResponse>("/generations", {
        method: "POST",
        body: {
          job_type: mode === "FAST" ? "FAST_IMAGE" : "PRO_IMAGE",
          prompt: text,
          aspect_ratio: aspect,
          client_request_id: crypto.randomUUID(),
        },
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
        signal: controller.signal,
      });

      setStatusLabel(created.status);
      const done = await pollUntilDone(created.job_id, controller.signal);

      if (done.status === "SUCCEEDED") {
        const url = done.result_urls?.[0] ?? null;
        setResultUrl(url);
        setStatusLabel("done");
      } else {
        setError(
          done.failure_code
            ? `Generation failed (${done.failure_code})`
            : "Generation failed. Your quota was returned when possible.",
        );
        setStatusLabel(done.status.toLowerCase());
      }
      await loadEntitlements();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      if (err instanceof ApiError) {
        if (err.code === "DAILY_LIMIT_REACHED") {
          setError(
            "Free daily Fast limit reached. Come back after reset, or sign in for a higher quota.",
          );
        } else if (err.code === "AUTH_REQUIRED") {
          setError("Please sign in to use Pro mode or check visitor quota.");
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
      await loadEntitlements();
    } finally {
      setBusy(false);
    }
  }

  const remaining = entitlements?.fast_image.remaining;
  const dailyLimit = entitlements?.fast_image.daily_limit;

  return (
    <div className="w-full">
      <form onSubmit={onGenerate} className="space-y-4">
        <div className="relative">
          <label htmlFor={promptId} className="sr-only">
            {t("hero.inputPlaceholder")}
          </label>
          <textarea
            ref={textareaRef}
            id={promptId}
            rows={5}
            value={prompt}
            onInput={(e) => setPrompt(e.currentTarget.value)}
            placeholder={t("hero.inputPlaceholder")}
            maxLength={2000}
            className="min-h-36 w-full resize-none border-0 bg-transparent px-0 py-1 text-base leading-relaxed text-white outline-none placeholder:text-zinc-500 focus:ring-0 sm:min-h-40"
            disabled={busy}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-white/[0.1] bg-[#17171a] p-1">
              <button
                type="button"
                onClick={() => setMode("FAST")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  mode === "FAST"
                    ? "bg-white/[0.1] text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <IconBolt className="size-3.5" stroke={1.9} />
                {t("hero.modeFast")}
              </button>
              <button
                type="button"
                onClick={() => setMode("PRO")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  mode === "PRO"
                    ? "bg-[#8e36dc] text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <IconCrown className="size-3.5" stroke={1.75} />
                {t("hero.modePro")}
              </button>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-white/[0.1] bg-[#17171a] p-1">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  disabled={busy}
                  onClick={() => setAspect(ratio)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    ratio === aspect
                      ? "bg-white/[0.1] text-white"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {remaining != null && dailyLimit != null ? (
              <span className="hidden text-xs text-zinc-500 sm:inline-block">
                <strong className="font-medium text-zinc-300">{remaining}</strong> / {dailyLimit} {t("common.freeDailyFast")}
              </span>
            ) : <span className="hidden text-xs text-zinc-500 sm:inline-block">{t("common.freeDailyFast")}</span>}

            <button
              type="submit"
              disabled={busy || !prompt.trim()}
              className="brand-cta inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" stroke={2} />
                  <span>{statusLabel ?? "Generating"}</span>
                </>
              ) : (
                <>
                  <span>{t("hero.btnGenerate")}</span>
                  <IconArrowUp className="size-4" stroke={2} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          <IconAlertTriangle className="mt-0.5 size-4 shrink-0" stroke={1.8} />
          {error}
        </div>
      ) : null}

      {resultUrl ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.1] bg-[#121215]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Generated Result"
            className="mx-auto max-h-[70vh] w-full object-contain"
          />
          <div className="flex justify-end gap-2 border-t border-white/[0.1] px-4 py-2.5">
            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white"
            >
              <IconDownload className="size-3.5" stroke={1.75} />
              Download full resolution
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
