"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCompass,
  IconCopy,
  IconFolder,
  IconLoader2,
  IconPhoto,
  IconPlus,
  IconRefresh,
  IconSparkles,
  IconTrash,
  IconVideo,
  IconWand,
} from "@tabler/icons-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { GenerateStudio } from "@/components/generate/GenerateStudio";

import { apiFetch } from "@/lib/api";
import type {
  CreationSession,
  CreationSessionListResponse,
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
      return "aspect-[9/16] w-full max-w-[240px]";
    case "3:4":
      return "aspect-[3/4] w-full max-w-[280px]";
    case "4:5":
      return "aspect-[4/5] w-full max-w-[300px]";
    case "1:1":
      return "aspect-square w-full max-w-[320px]";
    case "4:3":
      return "aspect-[4/3] w-full max-w-[380px]";
    case "16:9":
      return "aspect-[16/9] w-full max-w-[440px]";
    case "21:9":
      return "aspect-[21/9] w-full max-w-[480px]";
    case "3:2":
      return "aspect-[3/2] w-full max-w-[400px]";
    case "2:3":
      return "aspect-[2/3] w-full max-w-[260px]";
    case "5:4":
      return "aspect-[5/4] w-full max-w-[350px]";
    default:
      return "aspect-[16/9] w-full max-w-[420px]";
  }
}

function TaskPreview({ task, compact = false }: { task: SessionTask; compact?: boolean }) {
  const video = isVideoTask(task);
  const mediaClass = compact
    ? "size-[48px] rounded-xl object-cover"
    : "block max-h-[380px] max-w-[min(100%,480px)] rounded-2xl border border-white/[0.08] bg-[#0c0c0f] object-contain shadow-2xl";

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
    return video ? (
      <video className={`${mediaClass} bg-[#111116]`} src={task.resultUrl} controls playsInline preload="metadata" />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={mediaClass} src={task.resultUrl} alt="Generated result" />
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

function ThreadTask({ task }: { task: SessionTask }) {
  const video = isVideoTask(task);
  const failed = task.status === "FAILED" || task.status === "REJECTED";
  const prompt = task.prompt.trim() || (video ? "Animate the reference image." : "Create an image.");

  return (
    <article className="group w-full py-8 first:pt-0 sm:py-10">
      <div className="flex min-w-0 items-start gap-4 sm:gap-5">
        <span className="mt-0.5 inline-flex shrink-0 items-center rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/[0.08] px-3 py-2 text-xs font-bold leading-4 tracking-wide text-fuchsia-400">
          PROMPT
        </span>
        <p className="line-clamp-3 max-w-5xl pt-0.5 text-[16px] leading-7 text-zinc-500 sm:text-lg sm:leading-7">&quot;{prompt}&quot;</p>
      </div>

      <div className="mt-6">
        <TaskPreview task={task} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500">
          {video ? <IconVideo className="size-4" stroke={1.8} /> : <IconSparkles className="size-4" stroke={1.8} />}
          {video ? "RenderPop Video" : "RenderPop Image"}
          {!TERMINAL.has(task.status) ? <span className="inline-flex items-center gap-1.5 text-zinc-600"><IconLoader2 className="size-3 animate-spin" />{statusLabel(task.status)}</span> : null}
          {failed ? <span className="text-rose-300">{statusLabel(task.status)}</span> : null}
        </span>

        <div className="flex items-center gap-2 opacity-80 transition group-hover:opacity-100">
          <button type="button" className="session-action" aria-label="Enhance result"><IconWand className="size-4" stroke={1.7} /></button>
          <button type="button" className="session-action" aria-label="Regenerate"><IconRefresh className="size-4" stroke={1.7} /></button>
          <button type="button" className="session-action" aria-label="Copy prompt"><IconCopy className="size-4" stroke={1.7} /></button>
          <button type="button" className="session-action" aria-label="Delete task"><IconTrash className="size-4" stroke={1.7} /></button>
        </div>
      </div>

      {task.failureCode ? <p className="mt-3 text-xs text-rose-300">Generation failed: {task.failureCode}</p> : null}
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
  const [session, setSession] = useState<SessionData | null>(null);
  const [sessions, setSessions] = useState<CreationSession[]>([]);
  const [ready, setReady] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const pollsRef = useRef(new Map<string, number>());
  const taskNodesRef = useRef(new Map<string, HTMLElement>());

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
    if (id === sessionId) return;
    setLoadingSessionId(id);
    router.push(`/create/${id}`);
  };

  const isBareCreatePage = !sessionId;

  return (
    <section className={`session-page relative bg-black text-white ${isBareCreatePage ? "h-[calc(100vh-4rem)] overflow-hidden" : "min-h-[calc(100vh-4rem)]"}`}>
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#8e36dc]/12 blur-[140px]" />

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

      {/* Main Content View */}
      <main className={`px-4 lg:ml-[76px] lg:px-10 xl:px-14 ${isBareCreatePage ? "flex h-full flex-col pt-3 pb-[210px]" : "min-h-[calc(100vh-4rem)] pt-7 pb-[340px]"}`}>
        <div className={`mx-auto flex w-full max-w-[1680px] flex-col ${isBareCreatePage ? "h-full flex-1" : "min-h-[calc(100vh-6rem)]"}`}>
          <div className="mb-5 flex items-center gap-2 text-xs text-zinc-600 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-zinc-300"><IconArrowLeft className="size-3.5" /> Back</Link>
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
                  <ThreadTask task={task} />
                </div>
              ))}
            </div>
          ) : (
            <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center text-center">
              <div>
                <h1 className="text-xl font-semibold text-white">This creation session is unavailable</h1>
                <p className="mt-3 text-sm text-zinc-500">Start a new task from below to create a session.</p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Floating Creen-style Bottom Studio Studio Control Bar */}
      <div className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-40 rounded-[20px] sm:rounded-[22px] border border-white/[0.1] bg-[#111116]/90 p-1.5 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:left-[116px] lg:right-10 xl:left-[132px] xl:right-14">
        <GenerateStudio
          variant="session"
          sessionId={sessionId}
          createSessionForTask={createSessionForTask}
          onTaskCreated={onTaskCreated}
        />
      </div>
    </section>
  );
}
