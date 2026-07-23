"use client";

import { startTransition, useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconArrowUp,
  IconBolt,
  IconChevronDown,
  IconCrown,
  IconDownload,
  IconLoader2,
  IconMusic,
  IconPhoto,
  IconUpload,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useI18n } from "@/i18n/I18nContext";
import { ApiError, apiFetch } from "@/lib/api";
import {
  ASPECT_RATIOS,
  DEFAULT_ASPECT_RATIO,
  type AspectRatio,
  type AssetResponse,
  type EntitlementsResponse,
  type GenerationJobOptions,
  type GenerationOptionsResponse,
  type GenerationQuoteResponse,
  type GenerationTaskResponse,
  type UploadIntentResponse,
} from "@/lib/types";
import type { StudioTaskSubmission } from "@/lib/studio-sessions";

const TERMINAL = new Set([
  "SUCCEEDED",
  "FAILED",
  "REJECTED",
  "CANCELED",
  "EXPIRED",
]);

const VIDEO_RESOLUTIONS = ["480p", "720p", "1080p"] as const;
type VideoResolution = (typeof VIDEO_RESOLUTIONS)[number];
type Workspace = "IMAGE" | "VIDEO";

type VideoAsset = {
  assetId: string | null;
  name: string;
  previewUrl: string;
  aspect: AspectRatio;
  status: "uploading" | "ready";
};

type ImageAsset = Omit<VideoAsset, "aspect">;

const FAST_I2I_FALLBACK_ASPECTS = ["auto", "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
const PRO_I2I_FALLBACK_ASPECTS = ["empty", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9", "1:4", "4:1", "1:8", "8:1"];
const PRO_I2I_FALLBACK_RESOLUTIONS = ["1k", "2k", "4k"];
const STUDIO_DRAFT_KEY = "renderpop:studio-draft";

type StudioDraft = {
  workspace: Workspace;
  prompt: string;
  aspect: AspectRatio;
  mode: "FAST" | "PRO";
  videoLength: 5 | 10;
  videoResolution: VideoResolution;
  generateAudio: boolean;
};

type StudioProps = {
  seedPrompt?: string | null;
  seedAspect?: string | null;
  onSeedConsumed?: () => void;
  /** When supplied, hand a new job to the session workspace instead of polling in place. */
  onTaskCreated?: (submission: StudioTaskSubmission) => void;
  /** Creates a durable session before the task is submitted. */
  createSessionForTask?: () => Promise<string>;
  /** Existing durable session that owns every task created in this studio. */
  sessionId?: string;
  variant?: "default" | "session";
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function closestAspectRatio(width: number, height: number): AspectRatio {
  const sourceRatio = width / height;
  return ASPECT_RATIOS.reduce((closest, candidate) => {
    const candidateRatio = Number(candidate.split(":")[0]) / Number(candidate.split(":")[1]);
    const closestRatio = Number(closest.split(":")[0]) / Number(closest.split(":")[1]);
    return Math.abs(Math.log(sourceRatio / candidateRatio)) < Math.abs(Math.log(sourceRatio / closestRatio))
      ? candidate
      : closest;
  }, ASPECT_RATIOS[0]);
}

function readImageDimensions(file: File): Promise<{ width: number; height: number; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight, previewUrl });
    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("Could not read this image."));
    };
    image.src = previewUrl;
  });
}

function readStudioDraft(): StudioDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(STUDIO_DRAFT_KEY) ?? "null");
    if (!value || typeof value !== "object") return null;
    const draft = value as Partial<StudioDraft>;
    if (
      (draft.workspace !== "IMAGE" && draft.workspace !== "VIDEO")
      || typeof draft.prompt !== "string"
      || !ASPECT_RATIOS.includes(draft.aspect as AspectRatio)
      || (draft.mode !== "FAST" && draft.mode !== "PRO")
      || (draft.videoLength !== 5 && draft.videoLength !== 10)
      || !VIDEO_RESOLUTIONS.includes(draft.videoResolution as VideoResolution)
      || typeof draft.generateAudio !== "boolean"
    ) return null;
    return draft as StudioDraft;
  } catch {
    return null;
  }
}

export function GenerateStudio({
  seedPrompt,
  seedAspect,
  onSeedConsumed,
  onTaskCreated,
  createSessionForTask,
  sessionId,
  variant = "default",
}: StudioProps) {
  const { t } = useI18n();
  const { user, isLoading: authLoading, requireAuth } = useAuth();

  const [initialDraft] = useState<StudioDraft | null>(() => readStudioDraft());
  const promptId = useId();
  const videoUploadId = useId();
  const imageUploadId = useId();
  const [workspace, setWorkspace] = useState<Workspace>(() => initialDraft?.workspace ?? "IMAGE");
  const [prompt, setPrompt] = useState(() => initialDraft?.prompt ?? "");
  const [aspect, setAspect] = useState<AspectRatio>(() => initialDraft?.aspect ?? DEFAULT_ASPECT_RATIO);
  const [mode, setMode] = useState<"FAST" | "PRO">(() => initialDraft?.mode ?? "FAST");
  const [videoLength, setVideoLength] = useState<5 | 10>(() => initialDraft?.videoLength ?? 5);
  const [videoResolution, setVideoResolution] = useState<VideoResolution>(() => initialDraft?.videoResolution ?? "720p");
  const [generateAudio, setGenerateAudio] = useState(() => initialDraft?.generateAudio ?? false);
  const [videoAsset, setVideoAsset] = useState<VideoAsset | null>(null);
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null);
  const [imageToImageAspect, setImageToImageAspect] = useState("auto");
  const [proImageToImageResolution, setProImageToImageResolution] = useState("2k");
  const [i2iOptions, setI2iOptions] = useState<Record<"FAST" | "PRO", GenerationJobOptions | null>>({ FAST: null, PRO: null });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [imageOptionsOpen, setImageOptionsOpen] = useState(false);
  const [videoQuote, setVideoQuote] = useState<GenerationQuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [entitlements, setEntitlements] = useState<EntitlementsResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultKind, setResultKind] = useState<"image" | "video" | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const retainedPreviewUrlsRef = useRef(new Set<string>());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const loadEntitlements = useCallback(async () => {
    try {
      const data = await apiFetch<EntitlementsResponse>("/me/entitlements");
      setEntitlements(data);
    } catch {
      // The studio can still be explored before sign-in.
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    void apiFetch<EntitlementsResponse>("/me/entitlements")
      .then((data) => {
        if (active) setEntitlements(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user, authLoading]);


  useEffect(() => {
    if (seedPrompt) {
      startTransition(() => {
        setWorkspace("IMAGE");
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

  const searchParams = useSearchParams();
  useEffect(() => {
    const urlPrompt = searchParams?.get("prompt");
    const urlAspect = searchParams?.get("aspect");
    if (urlPrompt) {
      startTransition(() => {
        setWorkspace("IMAGE");
        setPrompt(urlPrompt);
        if (urlAspect && ASPECT_RATIOS.includes(urlAspect as AspectRatio)) {
          setAspect(urlAspect as AspectRatio);
        }
      });
      textareaRef.current?.focus();
    }
  }, [searchParams]);

  useEffect(() => {
    const previewUrl = videoAsset?.previewUrl;
    const retainedPreviewUrls = retainedPreviewUrlsRef.current;
    return () => {
      if (previewUrl && !retainedPreviewUrls.has(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [videoAsset?.previewUrl]);

  useEffect(() => {
    const previewUrl = imageAsset?.previewUrl;
    const retainedPreviewUrls = retainedPreviewUrlsRef.current;
    return () => {
      if (previewUrl && !retainedPreviewUrls.has(previewUrl)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [imageAsset?.previewUrl]);

  useEffect(() => {
    if (workspace !== "IMAGE" || !imageAsset?.assetId) return;
    let active = true;
    void Promise.all([
      apiFetch<GenerationOptionsResponse>("/generations/options?job_type=FAST_IMAGE_TO_IMAGE"),
      apiFetch<GenerationOptionsResponse>("/generations/options?job_type=PRO_IMAGE_TO_IMAGE"),
    ])
      .then(([fast, pro]) => {
        if (!active) return;
        setI2iOptions({ FAST: fast.jobs[0] ?? null, PRO: pro.jobs[0] ?? null });
      })
      .catch(() => {
        // Local fallbacks keep the editor usable while catalog requests recover.
      });
    return () => {
      active = false;
    };
  }, [workspace, imageAsset?.assetId]);

  useEffect(() => {
    if (workspace !== "VIDEO") return;
    let active = true;
    const timer = window.setTimeout(() => {
      setQuoteLoading(true);
      void apiFetch<GenerationQuoteResponse>("/generations/quote", {
        method: "POST",
        body: {
          job_type: videoAsset?.assetId ? "IMAGE_VIDEO" : "TEXT_VIDEO",
          length: videoLength,
          resolution: videoResolution,
          generate_audio: generateAudio,
        },
      })
        .then((quote) => {
          if (active) setVideoQuote(quote);
        })
        .catch(() => {
          if (active) setVideoQuote(null);
        })
        .finally(() => {
          if (active) setQuoteLoading(false);
        });
    }, 220);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [workspace, videoAsset?.assetId, videoLength, videoResolution, generateAudio]);

  async function pollUntilDone(jobId: string, signal: AbortSignal) {
    for (let i = 0; i < 90; i++) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      const task = await apiFetch<GenerationTaskResponse>(`/generations/${jobId}`, { signal });
      setStatusLabel(task.status.replaceAll("_", " "));
      if (TERMINAL.has(task.status)) return task;
      if (i > 0 && i % 3 === 0) {
        try {
          await apiFetch<GenerationTaskResponse>(`/generations/${jobId}/poll`, {
            method: "POST",
            signal,
          });
        } catch {
          // The next status read will determine whether the job can continue.
        }
      }
      await sleep(2000);
    }
    throw new Error("Generation timed out. Please try again.");
  }

  function clearVideoAsset() {
    if (videoAsset?.previewUrl && !retainedPreviewUrlsRef.current.has(videoAsset.previewUrl)) {
      URL.revokeObjectURL(videoAsset.previewUrl);
    }
    setVideoAsset(null);
    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
  }

  function clearImageAsset() {
    if (imageAsset?.previewUrl && !retainedPreviewUrlsRef.current.has(imageAsset.previewUrl)) {
      URL.revokeObjectURL(imageAsset.previewUrl);
    }
    setImageAsset(null);
    setImageToImageAspect("auto");
    if (imageFileInputRef.current) imageFileInputRef.current.value = "";
  }

  function persistDraft() {
    try {
      window.sessionStorage.setItem(STUDIO_DRAFT_KEY, JSON.stringify({
        workspace,
        prompt,
        aspect,
        mode,
        videoLength,
        videoResolution,
        generateAudio,
      } satisfies StudioDraft));
    } catch {
      // Sign-in can still proceed if browser storage is unavailable.
    }
  }

  function requestStudioAuth() {
    if (user) return true;
    persistDraft();
    return requireAuth();
  }

  function canUploadImage() {
    setError(null);
    return requestStudioAuth();
  }

  function openImagePicker(target: Workspace) {
    if (canUploadImage()) {
      if (target === "VIDEO") videoFileInputRef.current?.click();
      else imageFileInputRef.current?.click();
    }
  }

  function startImageUpload(file: File, target: Workspace) {
    if (busy || uploading || imageUploading) return;
    if (canUploadImage()) {
      void uploadImage(file, target);
    }
  }

  async function uploadImage(file: File, target: Workspace) {
    const acceptedTypes = new Set(target === "VIDEO" ? ["image/jpeg", "image/png"] : ["image/jpeg", "image/png", "image/webp"]);
    if (!acceptedTypes.has(file.type) || file.size > 20_000_000) {
      setError(target === "VIDEO" ? t("hero.videoFormatError") : t("hero.imageFormatError"));
      return;
    }

    let previewUrl: string | null = null;
    try {
      const dimensions = await readImageDimensions(file);
      previewUrl = dimensions.previewUrl;
      const sourceRatio = dimensions.width / dimensions.height;
      if (target === "VIDEO" && (sourceRatio < 0.25 || sourceRatio > 4)) {
        URL.revokeObjectURL(previewUrl);
        setError(t("hero.videoRatioError"));
        return;
      }

      if (target === "VIDEO") setUploading(true);
      else setImageUploading(true);
      setError(null);
      if (target === "VIDEO") {
        setVideoAsset({
          assetId: null,
          name: file.name,
          previewUrl,
          aspect: closestAspectRatio(dimensions.width, dimensions.height),
          status: "uploading",
        });
      } else {
        setImageAsset({ assetId: null, name: file.name, previewUrl, status: "uploading" });
      }

      const intent = await apiFetch<UploadIntentResponse>("/assets/upload-intents", {
        method: "POST",
        body: {
          purpose: target === "VIDEO" ? "video_input" : "input_image",
          filename: file.name,
          content_type: file.type,
          byte_size: file.size,
        },
      });
      const isStubUpload = intent.upload_url.includes("example.com") || intent.upload_url.includes("stub-upload");
      if (!isStubUpload) {
        const putResponse = await fetch(intent.upload_url, {
          method: "PUT",
          headers: intent.headers,
          body: file,
        });
        if (!putResponse.ok) throw new Error("Upload failed.");
      }
      const completed = await apiFetch<AssetResponse>(`/assets/${intent.asset_id}/complete`, {
        method: "POST",
        body: {},
      });
      if (completed.status !== "READY") throw new Error("Image is not ready.");
      if (target === "VIDEO") {
        setVideoAsset((current) => current && ({ ...current, assetId: completed.asset_id, status: "ready" }));
      } else {
        setImageAsset((current) => current && ({ ...current, assetId: completed.asset_id, status: "ready" }));
        setImageToImageAspect(mode === "FAST" ? "auto" : "empty");
      }
    } catch (err) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (target === "VIDEO") setVideoAsset(null);
      else setImageAsset(null);
      if (err instanceof ApiError && err.code === "AUTH_REQUIRED") {
        requestStudioAuth();
      } else {
        setError(target === "VIDEO" ? t("hero.videoUploadError") : t("hero.imageUploadError"));
      }
    } finally {
      if (target === "VIDEO") setUploading(false);
      else setImageUploading(false);
    }
  }

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    const text = prompt.trim();
    const isVideo = workspace === "VIDEO";
    const isImageToVideo = Boolean(videoAsset?.assetId);
    const isImageToImage = Boolean(imageAsset?.assetId);
    if (busy || imageUploading || (isVideo ? (!isImageToVideo && !text) || uploading : !text)) {
      if (isVideo && !isImageToVideo && !text) setError(t("hero.videoPromptRequired"));
      if (!isVideo && !text) setError(t("hero.imagePromptRequired"));
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setError(null);
    setResultUrl(null);
    setResultKind(null);
    setStatusLabel(isVideo ? t("hero.videoGenerating") : "starting");

    try {
      const taskSessionId = sessionId ?? (createSessionForTask ? await createSessionForTask() : undefined);
      const created = await apiFetch<GenerationTaskResponse>("/generations", {
        method: "POST",
        body: isVideo
          ? {
              job_type: isImageToVideo ? "IMAGE_VIDEO" : "TEXT_VIDEO",
              prompt: text || null,
              aspect_ratio: isImageToVideo ? videoAsset?.aspect : aspect,
              length: videoLength,
              resolution: videoResolution,
              generate_audio: generateAudio,
              input_asset_id: videoAsset?.assetId,
              session_id: taskSessionId,
              client_request_id: crypto.randomUUID(),
            }
          : {
              job_type: isImageToImage
                ? (mode === "FAST" ? "FAST_IMAGE_TO_IMAGE" : "PRO_IMAGE_TO_IMAGE")
                : (mode === "FAST" ? "FAST_IMAGE" : "PRO_IMAGE"),
              prompt: text,
              aspect_ratio: isImageToImage ? imageToImageAspect : aspect,
              resolution: isImageToImage && mode === "PRO" ? proImageToImageResolution : undefined,
              input_asset_id: isImageToImage ? imageAsset?.assetId : undefined,
              session_id: taskSessionId,
              client_request_id: crypto.randomUUID(),
            },
        headers: { "Idempotency-Key": crypto.randomUUID() },
        signal: controller.signal,
      });

      setStatusLabel(created.status);
      if (onTaskCreated) {
        const sourcePreviewUrl = isVideo ? videoAsset?.previewUrl ?? null : imageAsset?.previewUrl ?? null;
        if (sourcePreviewUrl) retainedPreviewUrlsRef.current.add(sourcePreviewUrl);
        onTaskCreated({ task: created, prompt: text, sourcePreviewUrl });
        setPrompt("");
        window.sessionStorage.removeItem(STUDIO_DRAFT_KEY);
        await loadEntitlements();
        return;
      }
      const done = await pollUntilDone(created.job_id, controller.signal);
      if (done.status === "SUCCEEDED") {
        setResultUrl(done.result_urls?.[0] ?? null);
        setResultKind(isVideo ? "video" : "image");
        setStatusLabel("done");
        window.sessionStorage.removeItem(STUDIO_DRAFT_KEY);
      } else {
        setError(
          done.failure_code
            ? `Generation failed (${done.failure_code})`
            : "Generation failed. Your credits were returned when possible.",
        );
        setStatusLabel(done.status.toLowerCase());
      }
      await loadEntitlements();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (err instanceof ApiError) {
        if (err.code === "AUTH_REQUIRED") {
          requestStudioAuth();
        } else if (err.code === "DAILY_LIMIT_REACHED") {
          setError("Free daily Fast limit reached. Come back after reset, or sign in for a higher quota.");
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
  const isVideo = workspace === "VIDEO";
  const sourceReady = Boolean(videoAsset?.assetId);
  const imageSourceReady = Boolean(imageAsset?.assetId);
  const isImageToImage = !isVideo && imageSourceReady;
  const imageI2iCatalog = i2iOptions[mode];
  const imageI2iAspects = imageI2iCatalog?.aspect_ratios ?? (mode === "FAST" ? FAST_I2I_FALLBACK_ASPECTS : PRO_I2I_FALLBACK_ASPECTS);
  const imageI2iResolutions = imageI2iCatalog?.resolutions ?? PRO_I2I_FALLBACK_RESOLUTIONS;
  const imageAspectLabel = imageToImageAspect === "auto" ? t("hero.imageAspectAuto") : imageToImageAspect === "empty" ? t("hero.imageAspectOriginal") : imageToImageAspect;

  function selectImageMode(nextMode: "FAST" | "PRO") {
    setMode(nextMode);
    if (imageSourceReady) {
      setImageToImageAspect(nextMode === "FAST" ? "auto" : "empty");
      if (nextMode === "PRO") setProImageToImageResolution("2k");
    }
  }

  function selectWorkspace(nextWorkspace: Workspace) {
    setWorkspace(nextWorkspace);
    setError(null);
  }
  const canGenerateVideo = !busy && !uploading && (sourceReady || Boolean(prompt.trim()));
  const videoCtaLabel = quoteLoading
    ? t("hero.videoQuoteLoading")
    : videoQuote
      ? `${t("hero.btnGenerateVideo")} · ${t("hero.videoCredits").replace("{count}", String(videoQuote.credits_required))}`
      : t("hero.btnGenerateVideo");

  return (
    <div className={`w-full ${variant === "session" ? "session-composer" : ""}`}>
      <div className={`flex items-center gap-1 px-1 ${variant === "session" ? "session-composer-tabs" : ""}`}>
        <button
          type="button"
          onClick={() => selectWorkspace("IMAGE")}
          className={`relative inline-flex items-center gap-2 px-3 py-3.5 text-sm font-medium transition ${
            workspace === "IMAGE" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <IconPhoto className="size-4" stroke={1.75} />
          {t("hero.tabImage")}
          {workspace === "IMAGE" ? <span className="brand-signal absolute inset-x-2 bottom-0 h-0.5" /> : null}
        </button>
        <button
          type="button"
          onClick={() => selectWorkspace("VIDEO")}
          className={`relative inline-flex items-center gap-2 px-3 py-3.5 text-sm font-medium transition ${
            workspace === "VIDEO" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <IconVideo className="size-4" stroke={1.75} />
          {t("hero.tabVideo")}
          {workspace === "VIDEO" ? <span className="brand-signal absolute inset-x-2 bottom-0 h-0.5" /> : null}
        </button>
      </div>

      <form
        onSubmit={onGenerate}
        onDragEnter={(event) => {
          if (!busy && !uploading && !imageUploading && event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            setIsDraggingImage(true);
          }
        }}
        onDragOver={(event) => {
          if (!busy && !uploading && !imageUploading && event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDraggingImage(false);
          }
        }}
        onDrop={(event) => {
          if (busy || uploading || imageUploading) return;
          event.preventDefault();
          setIsDraggingImage(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void startImageUpload(file, isVideo ? "VIDEO" : "IMAGE");
        }}
        className="relative p-4 sm:p-6"
      >
        {isDraggingImage ? (
          <div className="pointer-events-none absolute inset-3 z-10 flex items-center justify-center rounded-xl border border-dashed border-[#d9459a]/80 bg-[#d9459a]/10 p-4">
            <span className="rounded-lg border border-[#eb71b4]/30 bg-[#17171a]/95 px-4 py-2 text-sm font-medium text-white shadow-xl">
              {isVideo
                ? (videoAsset ? t("hero.videoDropReplace") : t("hero.videoDropImage"))
                : (imageAsset ? t("hero.imageDropReplace") : t("hero.imageDropImage"))}
            </span>
          </div>
        ) : null}
        <div className={`relative flex gap-4 sm:gap-5 ${variant === "session" ? "session-composer-input-row items-center" : "items-start"}`}>
          <div className="relative shrink-0">
            <input
              ref={isVideo ? videoFileInputRef : imageFileInputRef}
              id={isVideo ? videoUploadId : imageUploadId}
              type="file"
              accept={isVideo ? "image/jpeg,image/png" : "image/jpeg,image/png,image/webp"}
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) startImageUpload(file, isVideo ? "VIDEO" : "IMAGE");
              }}
            />
            <button
              type="button"
              onClick={() => openImagePicker(isVideo ? "VIDEO" : "IMAGE")}
              disabled={busy || uploading || imageUploading}
              className={`${variant === "session" ? "session-upload-button" : ""} group relative flex h-28 w-20 flex-col items-center justify-center overflow-hidden rounded-xl border text-xs font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-32 sm:w-24 ${(isVideo ? videoAsset : imageAsset) ? "border-white/[0.16] bg-[#202025]" : "border-dashed border-white/[0.2] bg-white/[0.025] text-zinc-500 hover:border-[#dc499c]/75 hover:bg-[#dc499c]/[0.08] hover:text-zinc-100"}`}
              aria-label={(isVideo ? videoAsset : imageAsset) ? t("hero.videoChangeImage") : t("hero.videoUpload")}
            >
              {(isVideo ? videoAsset : imageAsset) ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={(isVideo ? videoAsset : imageAsset)?.previewUrl} alt={(isVideo ? videoAsset : imageAsset)?.name ?? ""} className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/0 to-transparent px-2 pb-2 text-center text-[11px] text-white opacity-0 transition group-hover:opacity-100">
                    {isVideo ? (uploading ? t("hero.videoUploadBusy") : t("hero.videoChangeImage")) : (imageUploading ? t("hero.imageUploadBusy") : t("hero.imageChangeImage"))}
                  </span>
                </>
              ) : (isVideo ? uploading : imageUploading) ? (
                <IconLoader2 className="size-5 animate-spin text-zinc-300" stroke={1.8} />
              ) : (
                <>
                  <IconUpload className="mb-2 size-5" stroke={1.7} />
                  <span>{t("hero.videoUpload")}</span>
                </>
              )}
            </button>
            {(isVideo ? videoAsset : imageAsset) ? (
              <button
                type="button"
                onClick={isVideo ? clearVideoAsset : clearImageAsset}
                disabled={isVideo ? uploading : imageUploading}
                className="absolute -right-2 -top-2 inline-flex size-6 items-center justify-center rounded-full border border-white/[0.14] bg-[#202025] text-zinc-400 shadow-lg transition hover:text-white disabled:opacity-40"
                aria-label={t("hero.videoRemoveImage")}
              >
                <IconX className="size-3.5" stroke={1.9} />
              </button>
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor={promptId} className="sr-only">
              {isVideo ? t("hero.videoPromptPlaceholder") : isImageToImage ? t("hero.imageToImagePromptPlaceholder") : t("hero.inputPlaceholder")}
            </label>
            <textarea
              ref={textareaRef}
              id={promptId}
              rows={variant === "session" ? 2 : 5}
              value={prompt}
              onInput={(e) => setPrompt(e.currentTarget.value)}
              placeholder={isVideo ? t("hero.videoPromptPlaceholder") : isImageToImage ? t("hero.imageToImagePromptPlaceholder") : t("hero.inputPlaceholder")}
              maxLength={2000}
              className="min-h-32 w-full resize-none border-0 bg-transparent px-0 py-1 text-base leading-relaxed text-white outline-none placeholder:text-zinc-500 focus:ring-0 sm:min-h-36"
              disabled={busy}
            />
          </div>
        </div>

        <div className={`flex items-center justify-between gap-2 pt-3 sm:pt-4 ${variant === "session" ? "session-composer-toolbar" : ""}`}>
          {isVideo ? (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setOptionsOpen(true)}
                className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/[0.1] bg-[#17171a] px-3 text-xs font-medium text-zinc-300 transition hover:border-white/[0.2] hover:text-white active:scale-[0.98]"
              >
                <IconAdjustmentsHorizontal className="size-3.5" stroke={1.9} />
                {t("hero.videoOptions")}
              </button>
              <span className="hidden text-xs text-zinc-500 sm:inline">
                {sourceReady ? `${t("hero.videoSourceAspect")} ${videoAsset?.aspect}` : `${videoLength}s · ${videoResolution}`}
              </span>
            </div>
          ) : (
            <div className="session-composer-controls flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar py-0.5 sm:overflow-visible">
              <div className="inline-flex shrink-0 rounded-lg border border-white/[0.1] bg-[#17171a] p-1">
                <button
                  type="button"
                  onClick={() => selectImageMode("FAST")}
                  className={`session-mode-button inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium transition ${mode === "FAST" ? "bg-white/[0.1] text-white" : "text-zinc-500 hover:text-white"}`}
                  title={t("hero.modeFast")}
                >
                  <IconBolt className="size-3.5" stroke={1.9} />
                  <span className="sm:hidden">{t("hero.modeFastCompact")}</span>
                  <span className="hidden sm:inline">{t("hero.modeFast")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectImageMode("PRO")}
                  className={`session-mode-button inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium transition ${mode === "PRO" ? "bg-[#8e36dc] text-white" : "text-zinc-500 hover:text-white"}`}
                  title={t("hero.modePro")}
                >
                  <IconCrown className="size-3.5" stroke={1.75} />
                  <span className="sm:hidden">
                    {t("hero.modeProCompact")}<span className="ml-1 hidden min-[375px]:inline">12</span>
                  </span>
                  <span className="hidden sm:inline">{t("hero.modePro")}</span>
                </button>
              </div>
              {isImageToImage ? (
                <>
                  <button
                    type="button"
                    onClick={() => setImageOptionsOpen(true)}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/[0.1] bg-[#17171a] px-3 text-xs font-medium text-zinc-300 transition hover:border-white/[0.2] hover:text-white active:scale-[0.98]"
                  >
                    <IconAdjustmentsHorizontal className="size-3.5" stroke={1.9} />
                    {t("hero.imageOptions")}
                  </button>
                  <span className="hidden text-xs text-zinc-500 sm:inline">
                    {mode === "PRO" ? `${imageAspectLabel} · ${proImageToImageResolution}` : imageAspectLabel}
                  </span>
                </>
              ) : (
                <div className="session-image-options relative flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setImageOptionsOpen((v) => !v)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#17171a] px-3 text-xs font-medium text-zinc-300 transition hover:border-white/[0.2] hover:text-white active:scale-[0.98]"
                  >
                    <span>{aspect}</span>
                    <IconChevronDown className="size-3.5 text-zinc-400" stroke={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageOptionsOpen((v) => !v)}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.1] bg-[#17171a] text-zinc-300 transition hover:border-white/[0.2] hover:text-white active:scale-[0.98]"
                    aria-label="Settings"
                  >
                    <IconAdjustmentsHorizontal className="size-4" stroke={1.9} />
                  </button>

                  {imageOptionsOpen ? (
                    <>
                      <div className="fixed inset-0 z-[60] bg-black/40 sm:bg-transparent" onClick={() => setImageOptionsOpen(false)} />
                      
                      <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="image-settings-title"
                        className="fixed inset-x-3 bottom-3 z-[70] w-auto rounded-2xl border border-white/[0.14] bg-[#16161d]/95 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:absolute sm:bottom-full sm:left-0 sm:right-auto sm:top-auto sm:mb-2.5 sm:w-[360px] animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
                          <h2 id="image-settings-title" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">{t("hero.imageOptionsTitle")}</h2>
                          <button type="button" onClick={() => setImageOptionsOpen(false)} className="inline-flex size-6 items-center justify-center rounded-md text-zinc-400 hover:bg-white/[0.1] hover:text-white transition-colors" aria-label={t("hero.imageCloseOptions")}>
                            <IconX className="size-3.5" stroke={1.75} />
                          </button>
                        </div>

                        <div className="mt-3.5 space-y-3.5">
                          {mode === "PRO" ? (
                            <fieldset>
                              <legend className="mb-1.5 text-xs font-medium text-zinc-400">{t("hero.imageQuality")}</legend>
                              <div className="grid grid-cols-3 gap-1.5">
                                {imageI2iResolutions.map((resolution) => (
                                  <button key={resolution} type="button" onClick={() => setProImageToImageResolution(resolution)} className={`h-8 rounded-lg border text-xs font-medium transition ${proImageToImageResolution === resolution ? "border-[#b737b8] bg-[#b737b8]/20 text-white font-semibold" : "border-white/[0.1] bg-[#121215] text-zinc-400 hover:text-white"}`}>{resolution}</button>
                                ))}
                              </div>
                            </fieldset>
                          ) : null}

                          <fieldset>
                            <legend className="mb-1.5 text-xs font-medium text-zinc-400">{t("hero.imageAspect")}</legend>
                            <div className="grid grid-cols-5 gap-1.5">
                              {(isImageToImage ? imageI2iAspects : (ASPECT_RATIOS as readonly string[])).map((ratio) => (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => {
                                    if (isImageToImage) setImageToImageAspect(ratio);
                                    else setAspect(ratio as AspectRatio);
                                  }}
                                  className={`h-8 rounded-lg border text-xs font-medium transition ${(isImageToImage ? imageToImageAspect : aspect) === ratio ? "border-[#b737b8] bg-[#b737b8]/20 text-white font-semibold shadow-[0_0_12px_rgba(183,55,184,0.3)]" : "border-white/[0.1] bg-[#121215] text-zinc-400 hover:text-white"}`}
                                >
                                  {ratio === "auto" ? t("hero.imageAspectAuto") : ratio === "empty" ? t("hero.imageAspectOriginal") : ratio}
                                </button>
                              ))}
                            </div>
                          </fieldset>
                        </div>

                        <button type="button" onClick={() => setImageOptionsOpen(false)} className="brand-cta mt-4 inline-flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold text-white active:scale-[0.98]">
                          {t("hero.imageCloseOptions")}
                        </button>
                      </section>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          )}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {!isVideo && (remaining != null && dailyLimit != null ? (
              <span className="hidden text-xs text-zinc-500 md:inline-block">
                <strong className="font-medium text-zinc-300">{remaining}</strong> / {dailyLimit} {t("common.freeDailyFast")}
              </span>
            ) : <span className="hidden text-xs text-zinc-500 md:inline-block">{t("common.freeDailyFast")}</span>)}
            <button
              type="submit"
              disabled={isVideo ? !canGenerateVideo : busy || !prompt.trim()}
              className="brand-cta inline-flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-40"
              title={t("hero.generate")}
            >
              {busy ? <IconLoader2 className="size-4 animate-spin" stroke={2} /> : <IconArrowUp className="size-4 sm:size-5" stroke={2.2} />}
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <div className="relative mx-4 mb-4 flex items-center justify-between gap-3.5 overflow-hidden rounded-xl border border-rose-500/25 bg-zinc-950/90 px-4 py-3 text-xs text-zinc-200 backdrop-blur-xl shadow-xl shadow-rose-950/20 sm:mx-6 sm:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <IconAlertTriangle className="size-4" stroke={1.8} />
            </div>
            <span className="font-medium tracking-wide text-zinc-200">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Dismiss"
          >
            <IconX className="size-3.5" stroke={2} />
          </button>
        </div>
      ) : null}

      {resultUrl ? (
        <div className="mx-4 mb-4 overflow-hidden rounded-xl border border-white/[0.1] bg-[#121215] sm:mx-6 sm:mb-6">
          {resultKind === "video" ? (
            <video src={resultUrl} controls className="mx-auto max-h-[70vh] w-full bg-black object-contain" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resultUrl} alt="Generated result" className="mx-auto max-h-[70vh] w-full object-contain" />
          )}
          <div className="flex justify-end border-t border-white/[0.1] px-4 py-2.5">
            <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white">
              <IconDownload className="size-3.5" stroke={1.75} />
              Download full resolution
            </a>
          </div>
        </div>
      ) : null}

      {optionsOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/65 p-3 sm:items-center sm:justify-center" role="presentation" onMouseDown={() => setOptionsOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-settings-title"
            className="w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#18181b] p-5 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 id="video-settings-title" className="text-base font-semibold text-white">{t("hero.videoOptionsTitle")}</h2>
              <button type="button" onClick={() => setOptionsOpen(false)} className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.07] hover:text-white" aria-label={t("hero.videoCloseOptions")}>
                <IconX className="size-4" stroke={1.75} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-zinc-200">{t("hero.videoQuality")}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {VIDEO_RESOLUTIONS.map((resolution) => (
                    <button key={resolution} type="button" onClick={() => setVideoResolution(resolution)} className={`h-10 rounded-lg border text-sm font-medium transition ${videoResolution === resolution ? "border-[#b737b8] bg-[#b737b8]/15 text-white" : "border-white/[0.1] bg-[#121215] text-zinc-400 hover:text-white"}`}>{resolution}</button>
                  ))}
                </div>
              </fieldset>

              {sourceReady ? (
                <div>
                  <p className="text-sm font-medium text-zinc-200">{t("hero.videoSourceAspect")}</p>
                  <p className="mt-2 rounded-lg border border-white/[0.1] bg-[#121215] px-3 py-2.5 text-sm text-zinc-400">{videoAsset?.aspect}</p>
                </div>
              ) : (
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-zinc-200">{t("hero.videoAspect")}</legend>
                  <div className="grid grid-cols-5 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button key={ratio} type="button" onClick={() => setAspect(ratio)} className={`h-10 rounded-lg border text-xs font-medium transition ${aspect === ratio ? "border-[#b737b8] bg-[#b737b8]/15 text-white" : "border-white/[0.1] bg-[#121215] text-zinc-400 hover:text-white"}`}>{ratio}</button>
                    ))}
                  </div>
                </fieldset>
              )}

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-zinc-200">{t("hero.videoDuration")}</legend>
                <div className="grid grid-cols-2 gap-2">
                  {[5, 10].map((length) => (
                    <button key={length} type="button" onClick={() => setVideoLength(length as 5 | 10)} className={`h-10 rounded-lg border text-sm font-medium transition ${videoLength === length ? "border-[#b737b8] bg-[#b737b8]/15 text-white" : "border-white/[0.1] bg-[#121215] text-zinc-400 hover:text-white"}`}>{length}s</button>
                  ))}
                </div>
              </fieldset>

              <button type="button" role="switch" aria-checked={generateAudio} onClick={() => setGenerateAudio((value) => !value)} className="flex w-full items-center justify-between rounded-xl border border-white/[0.1] bg-[#121215] p-3 text-left transition hover:border-white/[0.2]">
                <span className="flex items-center gap-3"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-300"><IconMusic className="size-4" stroke={1.75} /></span><span><span className="block text-sm font-medium text-zinc-100">{t("hero.videoAudio")}</span><span className="mt-0.5 block text-xs text-zinc-500">{t("hero.videoAudioHint")}</span></span></span>
                <span className={`relative h-5 w-9 rounded-full transition ${generateAudio ? "bg-[#c53b9f]" : "bg-zinc-700"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white transition ${generateAudio ? "left-4.5" : "left-0.5"}`} /></span>
              </button>
            </div>

            <button type="button" onClick={() => setOptionsOpen(false)} className="brand-cta mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-white active:scale-[0.98]">
              {t("hero.videoCloseOptions")}
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}
