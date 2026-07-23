"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconCompass,
  IconCopy,
  IconDownload,
  IconFolder,
  IconLoader2,
  IconMenu2,
  IconPhoto,
  IconPlus,
  IconRefresh,
  IconSparkles,
  IconTrash,
  IconVideo,
  IconWand,
  IconX,
} from "@tabler/icons-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/common/Toast";
import { GenerateStudio } from "@/components/generate/GenerateStudio";
import { AssetPreviewModal } from "@/components/assets/AssetPreviewModal";

import { apiFetch } from "@/lib/api";
import type {
  CreationSession,
  CreationSessionListResponse,
  GeneratedAsset,
  GenerationTaskResponse,
} from "@/lib/types";
import type { StudioTaskSubmission } from "@/lib/studio-sessions";

const TERMINAL = new Set(["SUCCEEDED", "FAILED", "REJECTED", "CANCELED", "EXPIRED"]);

type SessionTask = {
  jobId: string;
  taskType: GenerationTaskResponse["task_type"];
  status: GenerationTaskResponse["status"];
  prompt: string;
  sourcePreviewUrl: string | null;
  resultUrl: string | null;
  createdAt: string;
  completedAt: string | null;
  failureCode: string | null;
  aspectRatio: string | null;
  rawTask?: GenerationTaskResponse;
};

type SessionData = {
  id: string;
  tasks: SessionTask[];
};

function toSessionTask(
  task: GenerationTaskResponse,
  sourcePreviewUrl = task.input_url,
): SessionTask {
  return {
    jobId: task.job_id,
    taskType: task.task_type,
    status: task.status,
    prompt: task.prompt,
    sourcePreviewUrl,
    resultUrl: task.result_urls?.[0] ?? null,
    createdAt: task.created_at ?? new Date().toISOString(),
    completedAt: task.completed_at,
    failureCode: task.failure_code,
    aspectRatio: task.aspect_ratio ?? null,
    rawTask: task,
  };
}

function toSessionData(session: CreationSession): SessionData {
  return { id: session.id, tasks: session.tasks.map((task) => toSessionTask(task)) };
}

function isVideoTask(task: SessionTask) {
  return task.taskType === "TEXT_VIDEO" || task.taskType === "IMAGE_VIDEO" || task.taskType === "DANCE_VIDEO";
}

function statusLabel(status: SessionTask["status"]) {
  if (!TERMINAL.has(status)) {
    return "Processing";
  }
  return status.replaceAll("_", " ").toLowerCase();
}

function getAspectClass(aspectRatio?: string | null) {
  switch (aspectRatio) {
    case "9:16":
      return "aspect-[9/16] w-full max-w-[180px]";
    case "3:4":
      return "aspect-[3/4] w-full max-w-[215px]";
    case "4:5":
      return "aspect-[4/5] w-full max-w-[235px]";
    case "1:1":
      return "aspect-square w-full max-w-[260px]";
    case "4:3":
      return "aspect-[4/3] w-full max-w-[320px]";
    case "16:9":
      return "aspect-[16/9] w-full max-w-[360px]";
    case "21:9":
      return "aspect-[21/9] w-full max-w-[400px]";
    case "3:2":
      return "aspect-[3/2] w-full max-w-[330px]";
    case "2:3":
      return "aspect-[2/3] w-full max-w-[205px]";
    case "5:4":
      return "aspect-[5/4] w-full max-w-[290px]";
    default:
      return "aspect-[16/9] w-full max-w-[360px]";
  }
}

function TaskPreview({
  task,
  compact = false,
  onPreview,
  onDownload,
}: {
  task: SessionTask;
  compact?: boolean;
  onPreview?: (task: SessionTask) => void;
  onDownload?: (task: SessionTask) => void;
}) {
  const video = isVideoTask(task);
  const mediaClass = compact
    ? "size-[48px] rounded-xl object-cover"
    : "block max-h-[280px] max-w-[min(100%,360px)] rounded-2xl border border-white/[0.08] bg-[#0c0c0f] object-contain shadow-2xl transition hover:border-white/20 cursor-pointer";

  if (compact) {
    if (task.status === "SUCCEEDED" && task.resultUrl) {
      return video ? (
        <video className={`${mediaClass} bg-[#111116]`} src={task.resultUrl} muted playsInline preload="metadata" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={mediaClass} src={task.resultUrl} alt="Generated result" />
      );
    }

    if (TERMINAL.has(task.status)) {
      return (
        <div className="flex size-[48px] items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-300">
          <IconAlertTriangle className="size-4 text-rose-400" stroke={1.8} />
        </div>
      );
    }

    // Active generating state thumbnail
    return (
      <div className="relative flex size-[48px] items-center justify-center overflow-hidden rounded-xl border border-fuchsia-500/30 bg-[#0c0c10] shadow-inner">
        {task.sourcePreviewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={task.sourcePreviewUrl} alt="Source" className="h-full w-full object-cover blur-[2px] opacity-40 scale-110" />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/20 via-purple-500/10 to-transparent animate-pulse" />
        )}
        {/* Sweeping shimmer */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />

        {/* Outer Rotating Arc */}
        <div className="absolute size-6 rounded-full border border-fuchsia-400/30 border-t-fuchsia-400 animate-spin" />
        {/* Inner Sparkle */}
        <IconSparkles className="size-3 text-fuchsia-400 animate-pulse" stroke={1.8} />
      </div>
    );
  }

  // Full-size Main Thread Task View
  if (task.status === "SUCCEEDED" && task.resultUrl) {
    return (
      <div className="group/preview relative inline-block max-w-full">
        {video ? (
          <video
            className={`${mediaClass} bg-[#111116]`}
            src={task.resultUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={mediaClass}
            src={task.resultUrl}
            alt="Generated result"
            onClick={() => onPreview?.(task)}
          />
        )}

        {/* Bottom-right Glassmorphism Download Floating Button */}
        {onDownload ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(task);
            }}
            className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-black/85 active:scale-95"
            aria-label="Download media"
            title="Download media"
          >
            <IconDownload className="size-4" stroke={1.8} />
          </button>
        ) : null}
      </div>
    );
  }

  if (TERMINAL.has(task.status)) {
    return (
      <div className={`relative ${getAspectClass(task.aspectRatio)} rounded-2xl border border-rose-500/20 bg-rose-950/10 flex flex-col items-center justify-center p-5 text-center text-rose-300 shadow-xl`}>
        <IconAlertTriangle className="size-7 mb-1.5 text-rose-400" stroke={1.7} />
        <span className="text-xs font-semibold sm:text-sm">Generation Failed</span>
        <span className="mt-1 text-[11px] text-rose-300/80">{task.failureCode ? `Code: ${task.failureCode}` : "An error occurred during rendering."}</span>
      </div>
    );
  }

  // Active Generation / Processing Placeholder Card
  const aspectClass = getAspectClass(task.aspectRatio);

  return (
    <div className={`relative ${aspectClass} overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0c0c10] shadow-[0_12px_45px_rgba(0,0,0,0.75)] transition-all duration-500`}>
      {/* Background 1: Reference Backdrop Blur (for Image-to-Image / Video) */}
      {task.sourcePreviewUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={task.sourcePreviewUrl}
            alt="Reference backdrop"
            className="h-full w-full object-cover blur-2xl scale-125 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/70 to-[#0c0c10]/40" />
        </div>
      ) : (
        /* Ambient Breathing Radial Glow */
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-500/15 via-purple-500/8 to-transparent animate-pulse" />
      )}

      {/* Ambient Shimmer Beam Light Sweeping */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer" />

      {/* Top Right Aspect & Mode Pill Tag */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-md shadow-lg">
        <span className="inline-block size-1.5 rounded-full bg-fuchsia-400 animate-ping" />
        <span>{task.aspectRatio || (video ? "Video" : "Image")}</span>
      </div>

      {/* Center Loading & Feedback Section */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <div className="relative mb-3 flex items-center justify-center">
          {/* Outer Rotating Glowing Ring */}
          <div className="absolute size-11 rounded-full border-2 border-fuchsia-400/25 border-t-fuchsia-400 animate-spin" />
          {/* Inner Pulsing Sparkles Icon */}
          <div className="flex size-8 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_20px_rgba(217,70,167,0.35)]">
            <IconSparkles className="size-4 animate-pulse" stroke={1.8} />
          </div>
        </div>

        <p className="text-xs font-semibold tracking-wide text-white sm:text-sm">
          {video ? "Synthesizing AI Video..." : "Rendering AI Artwork..."}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          Applying neural diffusion & high-res details
        </p>
      </div>
    </div>
  );
}

function ThreadTask({
  task,
  onRegenerate,
  onDeleteTask,
  onPreview,
  onDownload,
}: {
  task: SessionTask;
  onRegenerate?: (task: SessionTask) => Promise<void> | void;
  onDeleteTask?: (jobId: string) => Promise<void> | void;
  onPreview?: (task: SessionTask) => void;
  onDownload?: (task: SessionTask) => void;
}) {
  const { toast } = useToast();
  const video = isVideoTask(task);
  const failed = task.status === "FAILED" || task.status === "REJECTED";
  const prompt = task.prompt.trim() || (video ? "Animate the reference image." : "Create an image.");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRegenerateClick = async () => {
    if (isRegenerating || !onRegenerate) return;
    setIsRegenerating(true);
    try {
      await onRegenerate(task);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyClick = async () => {
    const textToCopy = task.prompt.trim();
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Prompt Copied", "Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to Copy", "Clipboard access denied");
    }
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting || !onDeleteTask) return;
    setIsDeleting(true);
    try {
      await onDeleteTask(task.jobId);
      setConfirmOpen(false);
    } catch {
      // Error notification handled by parent handler
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="session-task group w-full py-6 first:pt-0 sm:py-7">
      <div className="session-task-prompt flex min-w-0 items-start gap-4 sm:gap-5">
        <span className="mt-0.5 inline-flex shrink-0 items-center rounded-md border border-fuchsia-400/25 bg-fuchsia-500/[0.06] px-2.5 py-1 text-[10px] font-bold leading-4 tracking-wide text-fuchsia-400">
          PROMPT
        </span>
        <p className="line-clamp-3 max-w-[680px] pt-0.5 text-sm leading-5 text-zinc-500 sm:text-[15px] sm:leading-6">&quot;{prompt}&quot;</p>
      </div>

      <div className="session-task-preview mt-6">
        <TaskPreview task={task} onPreview={onPreview} onDownload={onDownload} />
      </div>

      <div className="session-task-footer mt-3 flex items-center justify-between gap-4">
        <span className="session-task-caption inline-flex items-center gap-2 text-xs font-medium text-zinc-500">
          {video ? <IconVideo className="size-4" stroke={1.8} /> : <IconSparkles className="size-4" stroke={1.8} />}
          {video ? "RenderPop Video" : "RenderPop Image"}
          {!TERMINAL.has(task.status) ? <span className="inline-flex items-center gap-1.5 text-zinc-600"><IconLoader2 className="size-3 animate-spin" />{statusLabel(task.status)}</span> : null}
          {failed ? <span className="text-rose-300">{statusLabel(task.status)}</span> : null}
        </span>

        <div className="session-task-actions flex items-center gap-2 opacity-80 transition group-hover:opacity-100">
          {/* <button type="button" className="session-action" aria-label="Enhance result"><IconWand className="size-4" stroke={1.7} /></button> */}
          <button
            type="button"
            onClick={() => void handleRegenerateClick()}
            disabled={isRegenerating}
            className="session-action disabled:opacity-50"
            aria-label="Regenerate"
            title="Regenerate task"
          >
            <IconRefresh className={`size-4 ${isRegenerating ? "animate-spin text-fuchsia-400" : ""}`} stroke={1.7} />
          </button>
          <button
            type="button"
            onClick={() => void handleCopyClick()}
            className="session-action"
            aria-label="Copy prompt"
            title={copied ? "Copied!" : "Copy prompt"}
          >
            {copied ? <IconCheck className="size-4 text-emerald-400" stroke={2} /> : <IconCopy className="size-4" stroke={1.7} />}
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="session-action hover:text-rose-400 transition"
            aria-label="Delete task"
            title="Delete task"
          >
            <IconTrash className="size-4" stroke={1.7} />
          </button>
        </div>
      </div>

      {task.failureCode ? <p className="mt-3 text-xs text-rose-300">Generation failed: {task.failureCode}</p> : null}

      {/* Modern Confirmation Modal */}
      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          onClick={() => !isDeleting && setConfirmOpen(false)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#121217] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
              className="absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              aria-label="Close modal"
            >
              <IconX className="size-4" stroke={1.8} />
            </button>

            {/* Title & Body */}
            <h3 className="text-lg font-bold text-white tracking-wide">Delete</h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Are you sure you want to delete this data?
            </p>

            {/* Actions */}
            <div className="mt-7 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={isDeleting}
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteConfirm()}
                disabled={isDeleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition hover:bg-rose-500 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              >
                {isDeleting ? <IconLoader2 className="size-4 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}

/** Creen-style Hero Section for bare /create page */
function BareCreateHero() {
  const cards = [
    { src: "https://s3.us-east-2.amazonaws.com/renderpop-assets/media/showcase/create_card_1.webp", alt: "Create Card 1", rotate: "-rotate-[13deg] translate-y-3 hidden sm:block" },
    { src: "https://s3.us-east-2.amazonaws.com/renderpop-assets/media/showcase/create_card_2.webp", alt: "Create Card 2", rotate: "-rotate-[6deg] sm:-rotate-[4deg] -translate-y-1" },
    { src: "https://s3.us-east-2.amazonaws.com/renderpop-assets/media/showcase/create_card_3.webp", alt: "Create Card 3", rotate: "rotate-[6deg] sm:rotate-[4deg] -translate-y-1" },
    { src: "https://s3.us-east-2.amazonaws.com/renderpop-assets/media/showcase/create_card_4.webp", alt: "Create Card 4", rotate: "rotate-[13deg] translate-y-3 hidden sm:block" },
  ];

  return (
    <div className="mt-4 mb-auto flex flex-col items-center justify-center text-center select-none pt-6 pb-2 sm:pt-10">
      {/* Curved 3D Cards Fan Layout */}
      <div className="relative mb-10 flex items-center justify-center gap-2 pt-2 sm:gap-4 sm:mb-14 md:gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`group relative h-[160px] w-[120px] overflow-hidden rounded-[22px] border border-white/20 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out hover:z-20 hover:scale-105 hover:rotate-0 hover:border-fuchsia-400/50 hover:shadow-[0_0_30px_rgba(217,70,167,0.3)] sm:h-[210px] sm:w-[155px] md:h-[240px] md:w-[180px] ${card.rotate}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.src}
              alt={card.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* Hero Title */}
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
        Create or Edit Image with AI
      </h1>
    </div>
  );
}

/** Skeleton loader for session switching */
function SessionSkeletonLoader() {
  return (
    <div className="flex-1 space-y-10 animate-pulse pt-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-20 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30" />
          <div className="h-5 w-72 rounded-lg bg-white/10" />
        </div>
        <div className="h-[320px] w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#0c0c10]/90 flex flex-col items-center justify-center p-6 gap-3 shadow-2xl">
          <div className="size-10 rounded-full border-2 border-fuchsia-400/30 border-t-fuchsia-400 animate-spin" />
          <div className="h-3.5 w-32 rounded-full bg-white/15" />
        </div>
      </div>
      <div className="space-y-4 opacity-40">
        <div className="flex items-center gap-3">
          <div className="h-7 w-20 rounded-lg bg-white/10" />
          <div className="h-5 w-48 rounded-lg bg-white/10" />
        </div>
        <div className="h-[200px] w-full max-w-[360px] rounded-2xl border border-white/10 bg-[#0c0c10]/60" />
      </div>
    </div>
  );
}

export function CreateWorkspace({ sessionId }: { sessionId?: string }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sessions, setSessions] = useState<CreationSession[]>([]);
  const [ready, setReady] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<GeneratedAsset | null>(null);
  const [mobileSessionsOpen, setMobileSessionsOpen] = useState(false);
  const pollsRef = useRef(new Map<string, number>());
  const taskNodesRef = useRef(new Map<string, HTMLElement>());

  const handlePreviewTask = useCallback((task: SessionTask) => {
    if (!task.resultUrl) return;
    setPreviewAsset({
      job_id: task.jobId,
      session_id: sessionId ?? null,
      task_type: task.taskType,
      model_code: null,
      prompt: task.prompt,
      aspect_ratio: task.aspectRatio || "9:16",
      result_url: task.resultUrl,
      created_at: task.createdAt,
      completed_at: task.completedAt,
    });
  }, [sessionId]);

  const handleTaskDownload = useCallback(async (task: SessionTask) => {
    if (!task.resultUrl) return;
    const video = isVideoTask(task);
    const ext = video ? "mp4" : "png";
    const downloadFilename = `renderpop-${task.jobId.slice(0, 8)}.${ext}`;
    try {
      let blob: Blob;
      try {
        const res = await fetch(`/api/v1/generations/assets/${task.jobId}/download`);
        if (res.ok) {
          blob = await res.blob();
        } else {
          const directRes = await fetch(task.resultUrl);
          blob = await directRes.blob();
        }
      } catch {
        const directRes = await fetch(task.resultUrl);
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
    }
  }, []);

  // Fetch user's creation sessions list and active session details
  useEffect(() => {
    if (authLoading) return;
    let active = true;

    // Always load the user's historical creation sessions for the rail navigation
    void apiFetch<CreationSessionListResponse>("/creation-sessions")
      .then((list) => {
        if (active) setSessions(list.sessions);
      })
      .catch(() => {
        if (active) setSessions([]);
      });

    if (!sessionId) {
      setSession(null);
      setReady(true);
      setLoadingSessionId(null);
      return;
    }

    setReady(false);
    void apiFetch<CreationSession>(`/creation-sessions/${sessionId}`)
      .then((current) => {
        if (!active) return;
        setSession(toSessionData(current));
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) {
          setReady(true);
          setLoadingSessionId(null);
        }
      });

    return () => {
      active = false;
    };
  }, [sessionId, user, authLoading]);



  const syncTask = useCallback((task: GenerationTaskResponse) => {
    if (!sessionId) return;
    setSession((current) => current ? {
      ...current,
      tasks: current.tasks.map((item) => item.jobId === task.job_id
        ? toSessionTask(task, task.input_url ?? item.sourcePreviewUrl)
        : item),
    } : current);
    setSessions((current) => current.map((item) => item.id === sessionId ? {
      ...item,
      tasks: item.tasks.map((itemTask) => itemTask.job_id === task.job_id ? task : itemTask),
    } : item));
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    const pending = session?.tasks.filter((task) => !TERMINAL.has(task.status)) ?? [];
    if (!pending.length) return;

    let disposed = false;
    const poll = async () => {
      await Promise.all(pending.map(async (item) => {
        try {
          const count = (pollsRef.current.get(item.jobId) ?? 0) + 1;
          pollsRef.current.set(item.jobId, count);
          let task = await apiFetch<GenerationTaskResponse>(`/generations/${item.jobId}`);
          if (!TERMINAL.has(task.status) && count % 3 === 0) {
            task = await apiFetch<GenerationTaskResponse>(`/generations/${item.jobId}/poll`, { method: "POST" });
          }
          if (!disposed) syncTask(task);
        } catch {
          // Keep the message visible
        }
      }));
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 2_000);
    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, [sessionId, session?.tasks, syncTask]);

  const onTaskCreated = useCallback((submission: StudioTaskSubmission) => {
    if (sessionId) {
      const nextTask = toSessionTask(submission.task, submission.sourcePreviewUrl ?? submission.task.input_url);
      setSession((current) => current ? { ...current, tasks: [...current.tasks, nextTask] } : current);
      setSessions((current) => current.map((item) => item.id === sessionId ? {
        ...item,
        tasks: [...item.tasks, submission.task],
      } : item));
      window.setTimeout(() => taskNodesRef.current.get(submission.task.job_id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    } else {
      // If generated from bare /create page, navigate into the created task's session
      if (submission.task.session_id) {
        router.push(`/create/${submission.task.session_id}`);
      }
    }
  }, [sessionId, router]);

  const createSessionForTask = useCallback(async () => {
    const created = await apiFetch<CreationSession>("/creation-sessions", { method: "POST" });
    return created.id;
  }, []);

  const handleRegenerate = useCallback(async (task: SessionTask) => {
    const raw = task.rawTask;
    const taskSessionId = sessionId ?? (await createSessionForTask());
    const created = await apiFetch<GenerationTaskResponse>("/generations", {
      method: "POST",
      body: {
        job_type: task.taskType,
        prompt: task.prompt || null,
        aspect_ratio: task.aspectRatio || raw?.aspect_ratio || "9:16",
        length: raw?.length ?? undefined,
        resolution: raw?.resolution ?? undefined,
        generate_audio: raw?.generate_audio ?? undefined,
        input_asset_id: raw?.input_asset_id ?? undefined,
        template_id: raw?.template_id ?? undefined,
        session_id: taskSessionId,
        client_request_id: crypto.randomUUID(),
      },
      headers: { "Idempotency-Key": crypto.randomUUID() },
    });
    onTaskCreated({
      task: created,
      prompt: created.prompt || task.prompt,
      sourcePreviewUrl: task.sourcePreviewUrl ?? created.input_url,
    });
  }, [sessionId, createSessionForTask, onTaskCreated]);

  const handleDeleteTask = useCallback(async (jobId: string) => {
    try {
      await apiFetch(`/generations/assets/${jobId}`, { method: "DELETE" });
      setSession((current) => current ? {
        ...current,
        tasks: current.tasks.filter((t) => t.jobId !== jobId),
      } : current);
      setSessions((current) => current.map((item) => item.id === sessionId ? {
        ...item,
        tasks: item.tasks.filter((t) => t.job_id !== jobId),
      } : item));
      toast.success("Task deleted", "The task has been removed from this session.");
    } catch (err) {
      toast.error("Failed to delete", err instanceof Error ? err.message : "An error occurred while deleting.");
      throw err;
    }
  }, [sessionId, toast]);

  const createNewSession = useCallback(async () => {
    setCreatingSession(true);
    try {
      const created = await apiFetch<CreationSession>("/creation-sessions", { method: "POST" });
      router.push(`/create/${created.id}`);
    } finally {
      setCreatingSession(false);
    }
  }, [router]);

  const handleSessionSelect = (id: string) => {
    setMobileSessionsOpen(false);
    if (id === sessionId) return;
    setLoadingSessionId(id);
    router.push(`/create/${id}`);
  };

  useEffect(() => {
    if (!mobileSessionsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSessionsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileSessionsOpen]);

  const isBareCreatePage = !sessionId;

  return (
    <section className={`session-page relative w-full overflow-x-hidden bg-black text-white ${isBareCreatePage ? "h-[calc(100svh-4rem)] overflow-hidden" : "min-h-[calc(100svh-4rem)]"}`}>
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[360px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8e36dc]/[0.07] blur-[150px]" />

      {/* Left Navigation Rail (Only show on session or desktop) */}
      <aside className="session-rail fixed bottom-0 left-0 top-16 z-30 hidden w-[76px] border-r border-white/[0.055] bg-[#09090b] py-3 lg:flex lg:flex-col lg:items-center">
        <Link href="/" className="mb-5 inline-flex items-center gap-1 text-xs text-zinc-600 transition hover:text-zinc-200"><IconArrowLeft className="size-3.5" /> Back</Link>
        <button type="button" onClick={() => void createNewSession()} disabled={creatingSession} aria-label="New creation session" className="session-rail-button disabled:cursor-wait disabled:opacity-60"><IconPlus className="size-6" stroke={1.65} /></button>
        <Link href="/assets" aria-label="My assets" className="session-rail-button mt-3"><IconFolder className="size-5" stroke={1.65} /></Link>
        <span className="my-6 h-px w-7 bg-white/[0.1]" />
        <div className="flex flex-col items-center gap-4 overflow-y-auto pt-1.5 px-2 pb-3">
          {sessions.map((item) => {
            const previewTask = item.tasks.at(-1);
            const isLoadingThis = loadingSessionId === item.id || (!ready && item.id === sessionId);
            const isSelected = item.id === sessionId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSessionSelect(item.id)}
                className={`relative rounded-xl transition ${isSelected ? "ring-2 ring-fuchsia-400 ring-offset-2 ring-offset-[#09090b]" : "opacity-70 hover:opacity-100"}`}
                aria-label="Open creation session"
              >
                {previewTask ? (
                  <TaskPreview task={toSessionTask(previewTask)} compact />
                ) : (
                  <div className="flex size-[48px] items-center justify-center rounded-xl border border-white/[0.1] bg-[#141419] text-fuchsia-400/90 shadow-inner">
                    <IconSparkles className="size-5" />
                  </div>
                )}

                {isLoadingThis ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-[1px]">
                    <IconLoader2 className="size-5 animate-spin text-fuchsia-400" />
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>

      {mobileSessionsOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
            onClick={() => setMobileSessionsOpen(false)}
            aria-label="Close sessions"
          />
          <aside
            id="mobile-session-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Creation sessions"
            className="relative flex h-full w-[min(86vw,360px)] flex-col border-r border-white/[0.1] bg-[#15151a] shadow-[18px_0_50px_rgba(0,0,0,0.45)]"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
              <span className="text-base font-semibold text-white">Sessions</span>
              <button
                type="button"
                onClick={() => setMobileSessionsOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
                aria-label="Close sessions"
              >
                <IconX className="size-5" stroke={1.8} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-5">
              <button
                type="button"
                onClick={() => {
                  setMobileSessionsOpen(false);
                  void createNewSession();
                }}
                disabled={creatingSession}
                className="mb-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.05] px-3 text-sm font-medium text-zinc-100 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-400/[0.08] disabled:cursor-wait disabled:opacity-60"
              >
                {creatingSession ? <IconLoader2 className="size-4 animate-spin" /> : <IconPlus className="size-4" stroke={2} />}
                New creation
              </button>

              <p className="px-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Recent sessions</p>
              <div className="mt-3 space-y-1.5">
                {sessions.map((item) => {
                  const previewTask = item.tasks.at(-1);
                  const isSelected = item.id === sessionId;
                  const isLoadingThis = loadingSessionId === item.id || (!ready && item.id === sessionId);
                  const summary = previewTask?.prompt.trim() || "Untitled creation";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSessionSelect(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${isSelected ? "bg-white/[0.09]" : "hover:bg-white/[0.055]"}`}
                      aria-current={isSelected ? "page" : undefined}
                    >
                      <span className="relative shrink-0">
                        {previewTask ? (
                          <TaskPreview task={toSessionTask(previewTask)} compact />
                        ) : (
                          <span className="flex size-[48px] items-center justify-center rounded-xl border border-white/[0.1] bg-[#1d1d24] text-fuchsia-400">
                            <IconSparkles className="size-5" />
                          </span>
                        )}
                        {isLoadingThis ? (
                          <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
                            <IconLoader2 className="size-4 animate-spin text-fuchsia-400" />
                          </span>
                        ) : null}
                      </span>
                      <span className={`min-w-0 flex-1 truncate text-sm ${isSelected ? "font-medium text-white" : "text-zinc-400"}`}>
                        {summary}
                      </span>
                    </button>
                  );
                })}
                {!sessions.length ? (
                  <p className="px-2 py-8 text-center text-sm leading-6 text-zinc-500">Your recent creations will appear here.</p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {/* Main Content View */}
      <div className={`session-main px-4 lg:ml-[76px] lg:px-10 xl:px-14 ${isBareCreatePage ? "flex h-full flex-col pt-3 pb-[210px]" : "min-h-[calc(100svh-4rem)] pt-7 pb-[300px]"}`}>
        <div className={`mx-auto flex w-full flex-col ${isBareCreatePage ? "h-full max-w-[1680px] flex-1" : "max-w-[820px]"}`}>
          <div className="mb-5 flex items-center gap-2 text-xs text-zinc-600 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSessionsOpen(true)}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
              aria-expanded={mobileSessionsOpen}
              aria-controls="mobile-session-drawer"
            >
              <IconMenu2 className="size-4" stroke={1.8} />
              Sessions
            </button>
          </div>

          {isBareCreatePage ? (
            <BareCreateHero />
          ) : !ready ? (
            <SessionSkeletonLoader />
          ) : session ? (
            <div className="flex-1">
              {session.tasks.map((task) => (
                <div
                  key={task.jobId}
                  ref={(node) => {
                    if (node) taskNodesRef.current.set(task.jobId, node);
                    else taskNodesRef.current.delete(task.jobId);
                  }}
                  className="scroll-mt-24"
                >
                  <ThreadTask
                    task={task}
                    onRegenerate={handleRegenerate}
                    onDeleteTask={handleDeleteTask}
                    onPreview={handlePreviewTask}
                    onDownload={handleTaskDownload}
                  />
                </div>
              ))}
            </div>
          ) : (
            <section className="flex min-h-[calc(100svh-12rem)] items-center justify-center text-center">
              <div>
                <h1 className="text-xl font-semibold text-white">This creation session is unavailable</h1>
                <p className="mt-3 text-sm text-zinc-500">Start a new task from below to create a session.</p>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Floating session composer stays within the same visual column as task history. */}
      <div className="session-composer-shell fixed bottom-0 left-0 right-0 z-40 sm:bottom-4 sm:left-4 sm:right-4 lg:left-[76px] lg:right-0">
        <div className="mx-auto w-full max-w-[960px] rounded-t-2xl rounded-b-none border-t border-white/[0.1] border-x-0 border-b-0 bg-[#111116] p-1.5 shadow-[0_-10px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:rounded-[20px] sm:border sm:border-white/[0.1] sm:shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
          <GenerateStudio
            variant="session"
            sessionId={sessionId}
            createSessionForTask={createSessionForTask}
            onTaskCreated={onTaskCreated}
          />
        </div>
      </div>

      {/* Lightbox Fullscreen Media Preview Modal */}
      {previewAsset ? (
        <AssetPreviewModal
          asset={previewAsset}
          variant="lightbox"
          onClose={() => setPreviewAsset(null)}
        />
      ) : null}
    </section>
  );
}
