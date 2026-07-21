"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

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
  /** Filled when user picks a showcase card. */
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
  const promptId = useId();
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<AspectRatio>(DEFAULT_ASPECT_RATIO);
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(
    null,
  );
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
      // Soft-fail: studio still works; quota label just stays empty.
    }
  }, []);

  useEffect(() => {
    void loadEntitlements();
  }, [loadEntitlements]);

  useEffect(() => {
    if (seedPrompt) {
      setPrompt(seedPrompt);
      if (seedAspect && ASPECT_RATIOS.includes(seedAspect as AspectRatio)) {
        setAspect(seedAspect as AspectRatio);
      }
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
      // Prefer server poll endpoint every few ticks to advance provider state.
      if (i > 0 && i % 3 === 0) {
        try {
          await apiFetch<GenerationTaskResponse>(`/generations/${jobId}/poll`, {
            method: "POST",
            signal,
          });
        } catch {
          // ignore poll errors; GET path may still work
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
          job_type: "FAST_IMAGE",
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
            : "Generation failed. Your Fast quota was returned when possible.",
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
            "Free daily Fast generations used up. Come back after reset, or sign in for a higher limit.",
          );
        } else if (err.code === "AUTH_REQUIRED") {
          setError("Please refresh and try again (visitor session missing).");
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
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="studio-heading"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
            Free AI Image Generator
          </p>
          <h2
            id="studio-heading"
            className="mt-1 text-lg font-semibold tracking-tight text-zinc-900"
          >
            Create an image
          </h2>
        </div>
        <p className="text-sm text-zinc-500">
          {remaining != null && dailyLimit != null ? (
            <>
              <span className="font-medium text-zinc-800">{remaining}</span>
              {" / "}
              {dailyLimit} free Fast left today
            </>
          ) : (
            <>Free daily Fast generations</>
          )}
        </p>
      </div>

      <form onSubmit={onGenerate} className="space-y-4">
        <div>
          <label htmlFor={promptId} className="sr-only">
            Prompt
          </label>
          <textarea
            ref={textareaRef}
            id={promptId}
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create…"
            maxLength={2000}
            className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-900 outline-none ring-violet-500/30 placeholder:text-zinc-400 focus:border-violet-400 focus:bg-white focus:ring-4"
            disabled={busy}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">Ratio</span>
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              type="button"
              disabled={busy}
              onClick={() => setAspect(ratio)}
              className={
                ratio === aspect
                  ? "rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white"
                  : "rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 hover:border-zinc-300"
              }
            >
              {ratio}
              {ratio === "9:16" ? " · default" : ""}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy || !prompt.trim()}
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full bg-violet-600 px-6 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Generating…" : "Generate"}
          </button>
          {busy && statusLabel ? (
            <span className="text-sm capitalize text-zinc-500">{statusLabel}…</span>
          ) : null}
        </div>
      </form>

      {error ? (
        <p
          className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {resultUrl ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Generated result"
            className="mx-auto max-h-[70vh] w-full object-contain"
          />
          <div className="flex justify-end gap-2 border-t border-zinc-200 px-3 py-2">
            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-violet-700 hover:underline"
            >
              Open full size
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
