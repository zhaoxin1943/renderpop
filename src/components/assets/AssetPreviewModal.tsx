"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconLoader2,
  IconSparkles,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { ApiError, apiFetch } from "@/lib/api";
import type { GeneratedAsset } from "@/lib/types";

type AssetPreviewModalProps = {
  asset: GeneratedAsset | null;
  onClose: () => void;
  onDeleted?: (jobId: string) => void;
  variant?: "detailed" | "lightbox";
  currentIndex?: number;
  totalCount?: number;
};

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${formattedDate} • ${formattedTime}`;
}

function formatModelName(asset: GeneratedAsset) {
  if (asset.model_code) {
    return asset.model_code
      .replaceAll(/[-_]+/g, " ")
      .replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
  }
  return asset.task_type.includes("VIDEO") ? "RenderPop Video" : "RH Fast Image";
}

export function AssetPreviewModal({
  asset,
  onClose,
  onDeleted,
  variant = "detailed",
  currentIndex = 1,
  totalCount = 1,
}: AssetPreviewModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!asset) return null;

  const isVideo = asset.task_type.includes("VIDEO");

  const handleCopyPrompt = async () => {
    if (!asset.prompt) return;
    try {
      await navigator.clipboard.writeText(asset.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
      const textarea = document.createElement("textarea");
      textarea.value = asset.prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRecreate = () => {
    const params = new URLSearchParams();
    if (asset.prompt) params.set("prompt", asset.prompt);
    if (asset.aspect_ratio) params.set("aspect", asset.aspect_ratio);
    onClose();
    const targetPath = asset.session_id ? `/create/${asset.session_id}` : "/create";
    router.push(`${targetPath}?${params.toString()}`);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const ext = isVideo ? "mp4" : "png";
      const downloadFilename = `renderpop-${asset.job_id.slice(0, 8)}.${ext}`;
      let blob: Blob;
      try {
        const res = await fetch(`/api/v1/generations/assets/${asset.job_id}/download`);
        if (res.ok) {
          blob = await res.blob();
        } else {
          const directRes = await fetch(asset.result_url);
          blob = await directRes.blob();
        }
      } catch {
        const directRes = await fetch(asset.result_url);
        blob = await directRes.blob();
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download media:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await apiFetch(`/generations/assets/${asset.job_id}`, { method: "DELETE" });
      onDeleted?.(asset.job_id);
      onClose();
    } catch (cause: unknown) {
      setError(cause instanceof ApiError ? cause.message : "Failed to delete asset.");
      setDeleting(false);
    }
  };

  if (variant === "lightbox") {
    return (
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in duration-150"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Control Bar */}
        <div className="absolute top-5 left-6 right-6 z-10 flex items-center justify-between font-mono text-xs text-zinc-400">
          <span>{`${currentIndex} / ${totalCount}`}</span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
            aria-label="Close preview"
          >
            <IconX className="size-5" stroke={1.8} />
          </button>
        </div>

        {/* Media Preview Body */}
        <div
          className="relative flex max-h-[88vh] max-w-[92vw] items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <video
              src={asset.result_url}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.result_url}
              alt={asset.prompt || "Generated asset"}
              className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl select-none"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6 lg:p-8 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[92vh] w-full max-w-[1280px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#121217] shadow-2xl lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Preview Stage */}
        <div className="relative flex flex-1 items-center justify-center bg-[#09090c] p-4 sm:p-8 min-h-[300px]">
          {isVideo ? (
            <video
              src={asset.result_url}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.result_url}
              alt={asset.prompt || "Generated asset"}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />
          )}
        </div>

        {/* Right Details Panel */}
        <div className="flex w-full shrink-0 flex-col justify-between overflow-y-auto border-t border-white/10 bg-[#13131a] p-6 lg:w-[380px] lg:border-l lg:border-t-0 xl:w-[420px]">
          <div className="space-y-6">
            {/* Header Info with Close Button */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-zinc-400">
                  {formatDateLabel(asset.created_at)}
                </span>
                <span className="rounded-md border border-fuchsia-500/20 bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-fuchsia-300">
                  {isVideo ? "VIDEO" : "IMAGE"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/20 hover:text-white"
                aria-label="Close preview"
              >
                <IconX className="size-4" stroke={1.8} />
              </button>
            </div>


            {/* Prompt Section */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Prompt
                </h3>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
                >
                  {copied ? (
                    <>
                      <IconCheck className="size-3.5 text-fuchsia-400" />
                      <span className="text-fuchsia-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-2.5 max-h-56 overflow-y-auto rounded-2xl border border-white/5 bg-[#1a1b24] p-4 text-sm leading-relaxed text-zinc-200 select-text">
                {asset.prompt || "No prompt available"}
              </div>
            </div>

            {/* Information Section */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Information
              </h3>
              <div className="mt-2.5 space-y-2.5">
                {/* Model */}
                <div className="rounded-2xl border border-white/5 bg-[#1a1b24] p-3.5">
                  <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                    Model
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-200">
                    <IconSparkles className="size-4 text-fuchsia-400" />
                    {formatModelName(asset)}
                  </div>
                </div>

                {/* Grid info: Resolution & Aspect */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-2xl border border-white/5 bg-[#1a1b24] p-3.5">
                    <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                      Resolution
                    </div>
                    <div className="mt-1 text-sm font-medium text-zinc-200">
                      {isVideo ? "720P" : "1K"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-[#1a1b24] p-3.5">
                    <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                      Aspect
                    </div>
                    <div className="mt-1 text-sm font-medium text-zinc-200">
                      {asset.aspect_ratio || "16:9"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}
          </div>

          {/* Action Footer Buttons */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2.5">
            {/* Recreate Button */}
            <button
              type="button"
              onClick={handleRecreate}
              className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.35)] transition hover:from-fuchsia-400 hover:to-purple-500 active:scale-[0.98]"
            >
              <IconSparkles className="size-4 fill-white/20" stroke={2} />
              Recreate
            </button>


            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Download asset"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              {downloading ? (
                <IconLoader2 className="size-4 animate-spin text-zinc-400" />
              ) : (
                <IconDownload className="size-4" stroke={1.8} />
              )}
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Delete asset"
              title="Delete"
              className="inline-flex size-11 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition hover:bg-rose-500/20 hover:text-rose-300 disabled:opacity-50"
            >
              {deleting ? (
                <IconLoader2 className="size-4 animate-spin text-rose-300" />
              ) : (
                <IconTrash className="size-4" stroke={1.8} />
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
