"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconPhoto,
  IconPlayerPause,
  IconPlayerPlay,
  IconSparkles,
  IconTrendingUp,
  IconUpload,
  IconVideo,
  IconVolume,
  IconVolumeOff,
  IconX,
} from "@tabler/icons-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type TouchEvent,
} from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/common/Toast";
import { useI18n } from "@/i18n/I18nContext";
import { ApiError, apiFetch } from "@/lib/api";
import type {
  AssetResponse,
  CreationSession,
  DanceTemplate,
  DanceTemplatesResponse,
  GenerationQuoteResponse,
  GenerationTaskResponse,
  UploadIntentResponse,
} from "@/lib/types";

const ASSET_ORIGIN =
  "https://s3.us-east-2.amazonaws.com/renderpop-assets/dance/templates";

const FALLBACK_TEMPLATES: DanceTemplate[] = [
  ["dance-01", "Blue Tempo", 13, 1],
  ["dance-02", "Soft Bounce", 6, 2],
  ["dance-03", "Midnight Step", 8, 3],
  ["dance-04", "Pop Routine", 9, 4],
  ["dance-05", "Ribbon Walk", 12, 5],
  ["dance-06", "Balcony Beat", 10, 6],
  ["dance-07", "After Dark", 8, 7],
  ["dance-08", "Bodyline", 10, 8],
  ["dance-09", "Side Step", 6, 9],
].map(([id, title, duration, index], sortIndex) => ({
  id: String(id),
  title: String(title),
  duration_seconds: Number(duration),
  video_url: `${ASSET_ORIGIN}/${index}.mp4`,
  poster_url: `${ASSET_ORIGIN}/${index}.png`,
  aspect_ratio: "9:16",
  sort_order: (sortIndex + 1) * 10,
}));

type ReadyAsset = {
  assetId: string;
  name: string;
  previewUrl: string;
  aspect: string;
};

const ACCEPTED_IMAGES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ACCEPTED_VIDEOS = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const ASPECTS = [
  { value: "9:16", ratio: 9 / 16 },
  { value: "3:4", ratio: 3 / 4 },
  { value: "1:1", ratio: 1 },
  { value: "4:3", ratio: 4 / 3 },
  { value: "16:9", ratio: 16 / 9 },
] as const;

function closestAspect(width: number, height: number) {
  const ratio = width / height;
  return ASPECTS.reduce((best, option) =>
    Math.abs(option.ratio - ratio) < Math.abs(best.ratio - ratio)
      ? option
      : best,
  ).value;
}

function readImage(file: File) {
  return new Promise<{ previewUrl: string; width: number; height: number }>(
    (resolve, reject) => {
      const previewUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () =>
        resolve({
          previewUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      image.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        reject(new Error("Could not read image."));
      };
      image.src = previewUrl;
    },
  );
}

function readVideo(file: File) {
  return new Promise<{ previewUrl: string; width: number; height: number }>(
    (resolve, reject) => {
      const previewUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () =>
        resolve({
          previewUrl,
          width: video.videoWidth,
          height: video.videoHeight,
        });
      video.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        reject(new Error("Could not read video."));
      };
      video.src = previewUrl;
    },
  );
}

function isStubUpload(url: string) {
  return url.includes("example.com") || url.includes("stub-upload");
}

export function DanceStudio() {
  const router = useRouter();
  const { t } = useI18n();
  const { requireAuth } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const templateRailRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const customVideoInputRef = useRef<HTMLInputElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const [templates, setTemplates] =
    useState<DanceTemplate[]>(FALLBACK_TEMPLATES);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<ReadyAsset | null>(null);
  const [customVideo, setCustomVideo] = useState<ReadyAsset | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [credits, setCredits] = useState(120);

  const activeTemplate = templates[selectedIndex] ?? FALLBACK_TEMPLATES[0];
  const activeVideoUrl = customVideo?.previewUrl ?? activeTemplate.video_url;
  const posterUrl = customVideo ? undefined : activeTemplate.poster_url ?? undefined;
  const sourceAspect = customVideo?.aspect ?? activeTemplate.aspect_ratio;

  useEffect(() => {
    let active = true;
    void apiFetch<DanceTemplatesResponse>("/dance/templates")
      .then((response) => {
        if (!active || response.templates.length === 0) return;
        setTemplates(
          [...response.templates].sort(
            (left, right) => left.sort_order - right.sort_order,
          ),
        );
      })
      .catch(() => {
        // The public fallback catalog keeps the landing experience available.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setPlaying(false), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (playing) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [activeVideoUrl, muted, playing]);

  useEffect(() => {
    const rail = templateRailRef.current;
    const selectedTemplate = rail?.querySelector(
      `[data-template-index="${selectedIndex}"]`,
    ) as HTMLElement | null;
    if (!rail || !selectedTemplate) return;
    rail.scrollTo({
      behavior: "smooth",
      left:
        selectedTemplate.offsetLeft -
        rail.clientWidth / 2 +
        selectedTemplate.clientWidth / 2,
    });
  }, [selectedIndex]);

  useEffect(() => {
    let active = true;
    void apiFetch<GenerationQuoteResponse>("/generations/quote", {
      method: "POST",
      body: { job_type: "DANCE_VIDEO" },
    })
      .then((quote) => {
        if (active) setCredits(quote.credits_required);
      })
      .catch(() => {
        // Keep the server's public non-member default visible.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      if (customVideo?.previewUrl) URL.revokeObjectURL(customVideo.previewUrl);
    },
    [customVideo?.previewUrl, photo?.previewUrl],
  );

  function selectTemplate(index: number) {
    if (templates.length === 0) return;
    if (customVideo?.previewUrl) URL.revokeObjectURL(customVideo.previewUrl);
    setCustomVideo(null);
    setSelectedIndex((index + templates.length) % templates.length);
    setPlaying(true);
  }

  function goPrevious() {
    if (customVideo) {
      setCustomVideo(null);
      setPlaying(true);
      return;
    }
    selectTemplate(selectedIndex - 1);
  }

  function goNext() {
    if (customVideo) {
      setCustomVideo(null);
      setPlaying(true);
      return;
    }
    selectTemplate(selectedIndex + 1);
  }

  function openPhotoSheet() {
    if (!requireAuth()) return;
    setPhotoSheetOpen(true);
  }

  function openCustomVideoPicker() {
    if (!requireAuth()) return;
    if (customVideoInputRef.current) customVideoInputRef.current.value = "";
    customVideoInputRef.current?.click();
  }

  async function uploadPhoto(file: File) {
    if (!ACCEPTED_IMAGES.has(file.type) || file.size > 20_000_000) {
      toast.error(t("dance.photoError"), t("dance.photoFormat"));
      return;
    }

    setPhotoUploading(true);
    let previewUrl: string | null = null;
    try {
      const dimensions = await readImage(file);
      previewUrl = dimensions.previewUrl;
      const intent = await apiFetch<UploadIntentResponse>(
        "/assets/upload-intents",
        {
          method: "POST",
          body: {
            purpose: "dance_photo",
            filename: file.name,
            content_type: file.type,
            byte_size: file.size,
          },
        },
      );
      if (!isStubUpload(intent.upload_url)) {
        const response = await fetch(intent.upload_url, {
          method: "PUT",
          headers: intent.headers,
          body: file,
        });
        if (!response.ok) throw new Error("Upload failed.");
      }
      const completed = await apiFetch<AssetResponse>(
        `/assets/${intent.asset_id}/complete`,
        { method: "POST", body: {} },
      );
      if (completed.status !== "READY") throw new Error("Photo is not ready.");

      if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      setPhoto({
        assetId: completed.asset_id,
        name: file.name,
        previewUrl,
        aspect: closestAspect(dimensions.width, dimensions.height),
      });
      previewUrl = null;
      setPhotoSheetOpen(false);
      toast.success(t("dance.photoReady"), t("dance.photoReadyHint"));
    } catch (error) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (error instanceof ApiError && error.code === "AUTH_REQUIRED") {
        requireAuth();
      } else {
        toast.error(
          t("dance.photoError"),
          error instanceof Error ? error.message : t("dance.tryAgain"),
        );
      }
    } finally {
      setPhotoUploading(false);
    }
  }

  async function uploadCustomVideo(file: File) {
    if (!ACCEPTED_VIDEOS.has(file.type) || file.size > 100_000_000) {
      toast.error(t("dance.videoError"), t("dance.videoFormat"));
      return;
    }

    setVideoUploading(true);
    let previewUrl: string | null = null;
    try {
      const dimensions = await readVideo(file);
      previewUrl = dimensions.previewUrl;
      const intent = await apiFetch<UploadIntentResponse>(
        "/assets/upload-intents",
        {
          method: "POST",
          body: {
            purpose: "dance_reference_video",
            filename: file.name,
            content_type: file.type,
            byte_size: file.size,
          },
        },
      );
      if (!isStubUpload(intent.upload_url)) {
        const response = await fetch(intent.upload_url, {
          method: "PUT",
          headers: intent.headers,
          body: file,
        });
        if (!response.ok) throw new Error("Upload failed.");
      }
      const completed = await apiFetch<AssetResponse>(
        `/assets/${intent.asset_id}/complete`,
        { method: "POST", body: {} },
      );
      if (completed.status !== "READY") throw new Error("Video is not ready.");

      if (customVideo?.previewUrl) URL.revokeObjectURL(customVideo.previewUrl);
      setCustomVideo({
        assetId: completed.asset_id,
        name: file.name,
        previewUrl,
        aspect: closestAspect(dimensions.width, dimensions.height),
      });
      previewUrl = null;
      setPlaying(true);
      toast.success(t("dance.videoReady"), t("dance.videoReadyHint"));
    } catch (error) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (error instanceof ApiError && error.code === "AUTH_REQUIRED") {
        requireAuth();
      } else {
        toast.error(
          t("dance.videoError"),
          error instanceof Error ? error.message : t("dance.tryAgain"),
        );
      }
    } finally {
      setVideoUploading(false);
    }
  }

  async function generateVideo() {
    if (!photo) {
      openPhotoSheet();
      return;
    }
    if (!requireAuth() || generating) return;

    setGenerating(true);
    try {
      const session = await apiFetch<CreationSession>("/creation-sessions", {
        method: "POST",
      });
      const created = await apiFetch<GenerationTaskResponse>("/generations", {
        method: "POST",
        body: {
          job_type: "DANCE_VIDEO",
          prompt: null,
          aspect_ratio: sourceAspect,
          input_asset_id: photo.assetId,
          template_id: customVideo ? undefined : activeTemplate.id,
          reference_video_asset_id: customVideo?.assetId,
          session_id: session.id,
          client_request_id: crypto.randomUUID(),
        },
        headers: { "Idempotency-Key": crypto.randomUUID() },
      });
      router.push(`/create/${created.session_id ?? session.id}`);
    } catch (error) {
      if (error instanceof ApiError && error.code === "AUTH_REQUIRED") {
        requireAuth();
      } else {
        toast.error(
          t("dance.generateError"),
          error instanceof Error ? error.message : t("dance.tryAgain"),
        );
      }
    } finally {
      setGenerating(false);
    }
  }

  function onPhotoInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadPhoto(file);
  }

  function onCustomVideoInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadCustomVideo(file);
  }

  function onTouchStart(event: TouchEvent) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStartXRef.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const delta = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(delta) < 42) return;
    if (delta > 0) goPrevious();
    else goNext();
  }

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-[#050505] text-white">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onPhotoInput}
      />
      <input
        ref={customVideoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="sr-only"
        onChange={onCustomVideoInput}
      />

      <div className="lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.16fr)_minmax(30rem,0.84fr)]">
        <section
          className="relative isolate overflow-hidden border-white/[0.08] lg:border-r"
          aria-label={t("dance.previewLabel")}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") goPrevious();
            if (event.key === "ArrowRight") goNext();
          }}
        >
          {posterUrl ? (
            <div className="absolute inset-[-7%] hidden scale-110 opacity-55 blur-3xl lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterUrl}
                alt=""
                aria-hidden="true"
                className="size-full object-cover"
              />
            </div>
          ) : null}
          <div className="absolute inset-0 hidden bg-black/25 lg:block" />

          <div className="relative flex h-[min(64svh,570px)] items-center justify-center overflow-hidden bg-[#08080a] lg:min-h-[calc(100svh-4rem)] lg:h-auto lg:px-16 lg:py-8">
            {posterUrl ? (
              <div className="absolute inset-[-10%] scale-110 opacity-45 blur-2xl lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl}
                  alt=""
                  aria-hidden="true"
                  className="size-full object-cover"
                />
              </div>
            ) : null}
            <div
              className="relative h-full w-full overflow-hidden bg-transparent shadow-[0_24px_80px_rgba(0,0,0,0.5)] lg:h-[min(78svh,760px)] lg:w-auto lg:aspect-[9/16] lg:rounded-2xl lg:border lg:border-white/[0.1] lg:bg-black"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <video
                key={activeVideoUrl}
                ref={videoRef}
                src={activeVideoUrl}
                poster={posterUrl}
                autoPlay
                loop
                muted={muted}
                playsInline
                preload="auto"
                className="relative size-full object-contain lg:aspect-auto"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                {t("dance.videoFallback")}
              </video>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/90 via-black/40 to-transparent lg:h-44 lg:from-black/80" />

              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-xl sm:left-6 sm:top-6">
                {customVideo ? (
                  <IconVideo className="size-4 text-[#d946a7]" stroke={2} />
                ) : (
                  <IconTrendingUp
                    className="size-4 text-[#d946a7]"
                    stroke={2}
                  />
                )}
                {customVideo
                  ? t("dance.yourVideo")
                  : t("dance.trendingDance")}
              </div>

              <h1 className="pointer-events-none absolute inset-x-5 bottom-20 z-10 max-w-[15rem] text-[clamp(2.65rem,12vw,3.5rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-white lg:hidden">
                {customVideo ? t("dance.yourVideo") : t("dance.mobileTitle")}
              </h1>

              <button
                type="button"
                onClick={() => setPlaying((current) => !current)}
                className="absolute bottom-5 left-5 z-20 inline-flex size-12 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:bottom-[10.5rem] lg:left-6"
                aria-label={
                  playing ? t("dance.pauseVideo") : t("dance.playVideo")
                }
              >
                {playing ? (
                  <IconPlayerPause className="size-5" stroke={2.1} />
                ) : (
                  <IconPlayerPlay className="size-5" stroke={2.1} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMuted((current) => !current)}
                className="absolute bottom-5 right-5 z-20 inline-flex size-12 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:bottom-[10.5rem] lg:right-6"
                aria-label={muted ? t("dance.unmuteVideo") : t("dance.muteVideo")}
              >
                {muted ? (
                  <IconVolumeOff className="size-5" stroke={2} />
                ) : (
                  <IconVolume className="size-5" stroke={2} />
                )}
              </button>

              <div className="absolute inset-x-16 bottom-7 hidden flex-col items-center gap-2.5">
                <div className="flex items-center gap-2" aria-label={t("dance.templatePosition")}>
                  {templates.map((template, index) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => selectTemplate(index)}
                      className={`size-2.5 rounded-full transition ${
                        !customVideo && index === selectedIndex
                          ? "scale-110 bg-white"
                          : "bg-white/35 hover:bg-white/65"
                      }`}
                      aria-label={`${t("dance.chooseTemplate")} ${index + 1}`}
                      aria-current={
                        !customVideo && index === selectedIndex
                          ? "true"
                          : undefined
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white/85">
                  {customVideo
                    ? t("dance.custom")
                    : `${selectedIndex + 1} / ${templates.length}`}
                </span>
              </div>
            </div>

            {!customVideo ? (
              <>
                <button
                  type="button"
                  onClick={goPrevious}
                  className="absolute left-5 top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl transition hover:scale-105 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:left-[calc(50%-18rem)] lg:inline-flex"
                  aria-label={t("dance.previousDance")}
                >
                  <IconArrowLeft className="size-6" stroke={1.8} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-5 top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl transition hover:scale-105 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:right-[calc(50%-18rem)] lg:inline-flex"
                  aria-label={t("dance.nextDance")}
                >
                  <IconArrowRight className="size-6" stroke={1.8} />
                </button>
              </>
            ) : null}
          </div>

          {!customVideo ? (
            <div className="relative z-20 -mt-5 lg:absolute lg:inset-x-0 lg:bottom-7 lg:mx-auto lg:mt-0 lg:max-w-[34rem]">
              <div
                ref={templateRailRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-2 lg:px-0 lg:pb-3"
                aria-label={t("dance.templatePosition")}
              >
                {templates.map((template, index) => {
                  const selected = index === selectedIndex;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      data-template-index={index}
                      onClick={() => selectTemplate(index)}
                      className={`relative h-36 w-28 shrink-0 snap-center overflow-hidden rounded-2xl border bg-zinc-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc66df] lg:h-32 lg:w-[5.1rem] lg:rounded-xl ${
                        selected
                          ? "border-[#d95ee4] ring-2 ring-[#d95ee4]/70"
                          : "border-white/[0.16] opacity-75 hover:opacity-100"
                      }`}
                      aria-label={`${t("dance.chooseTemplate")} ${index + 1}`}
                      aria-current={selected ? "true" : undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          template.poster_url ??
                          FALLBACK_TEMPLATES[index]?.poster_url ??
                          ""
                        }
                        alt={template.title}
                        className="size-full object-cover"
                      />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/55 to-transparent" />
                    </button>
                  );
                })}
              </div>
              <div className="mx-auto h-1 w-[58%] max-w-[14rem] rounded-full bg-gradient-to-r from-[#7747ec] via-[#d83eb6] to-[#ef6690] lg:max-w-[18rem]" />
            </div>
          ) : (
            <p className="px-5 pt-5 text-center text-sm text-zinc-400 lg:hidden">
              {t("dance.customSelected")}
            </p>
          )}

          <div className="relative hidden items-center justify-center gap-3 bg-[#050505] py-4 text-sm text-zinc-500">
            <IconArrowLeft className="size-4" stroke={1.7} />
            <span>
              {customVideo
                ? t("dance.customSelected")
                : t("dance.changeDanceHint")}
            </span>
            <IconArrowRight className="size-4" stroke={1.7} />
          </div>
        </section>

        <section className="flex min-h-0 items-start bg-[#050505] px-5 pb-8 pt-4 sm:px-10 lg:min-h-0 lg:items-center lg:px-[clamp(2.75rem,5vw,6.5rem)] lg:py-16">
          <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:max-w-md lg:text-left">
            <div className="hidden items-center gap-2 text-sm font-medium text-[#d86ab8] lg:inline-flex">
              <IconSparkles className="size-4" stroke={2} />
              {t("dance.eyebrow")}
            </div>
            <h1 className="mt-5 hidden text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl lg:block lg:text-[clamp(3.2rem,4vw,5rem)]">
              {t("dance.title")}
            </h1>
            <p className="mt-6 hidden text-base leading-7 text-zinc-400 sm:text-lg lg:block">
              {t("dance.subtitle")}
            </p>
            <div className="mt-4 hidden items-center justify-center gap-2 text-sm text-zinc-400 sm:text-base lg:flex lg:justify-start">
              <IconClock className="size-4 shrink-0" stroke={1.8} />
              <span>{t("dance.easeLine")}</span>
            </div>

            {!customVideo ? (
              <div className="mt-7 hidden items-center gap-3 border-y border-white/[0.08] py-3 lg:flex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeTemplate.poster_url ?? ""}
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-9 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-zinc-500">
                    {t("dance.trendingDance")}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-zinc-200">
                    {activeTemplate.title}
                  </p>
                </div>
                <span className="text-sm tabular-nums text-zinc-500">
                  {selectedIndex + 1} / {templates.length}
                </span>
              </div>
            ) : null}

            {photo ? (
              <div className="mt-9 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-4 text-left">
                <div className="flex items-center gap-4">
                  <NextImage
                    src={photo.previewUrl}
                    alt={t("dance.uploadedPhotoAlt")}
                    width={80}
                    height={80}
                    unoptimized
                    className="size-20 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-300">
                      <IconCheck className="size-4" stroke={2.2} />
                      {t("dance.photoReady")}
                    </div>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {photo.name}
                    </p>
                    <button
                      type="button"
                      onClick={openPhotoSheet}
                      className="mt-2 text-xs font-medium text-zinc-300 underline decoration-white/25 underline-offset-4 transition hover:text-white"
                    >
                      {t("dance.changePhoto")}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={photo ? generateVideo : openPhotoSheet}
              disabled={photoUploading || generating}
              className={`brand-cta mx-auto inline-flex h-12 w-4/5 max-w-[20rem] items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold text-white shadow-none transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 lg:mx-0 lg:mt-8 lg:h-[4rem] lg:w-full lg:max-w-none lg:gap-3 lg:px-6 lg:text-lg lg:shadow-[0_18px_45px_rgba(186,55,184,0.2)] ${
                photo ? "mt-3" : "mt-1"
              }`}
            >
              {generating ? (
                <span className="size-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              ) : photo ? (
                <IconSparkles className="size-6" stroke={2} />
              ) : (
                <>
                  <IconUpload className="hidden size-6 lg:block" stroke={2} />
                  <IconArrowRight
                    className="order-last size-6 lg:hidden"
                    stroke={2.1}
                  />
                </>
              )}
              {generating
                ? t("dance.starting")
                : photo
                  ? `${t("dance.generate")} · ${credits} ${t("dance.credits")}`
                  : <><span className="lg:hidden">{t("dance.useThisDance")}</span><span className="hidden lg:inline">{t("dance.uploadPhoto")}</span></>}
            </button>

            <button
              type="button"
              onClick={openCustomVideoPicker}
              disabled={videoUploading}
              className="mx-auto mt-3 flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-white disabled:opacity-55 lg:mt-7 lg:gap-2 lg:text-base lg:font-semibold lg:underline lg:decoration-[#c84cc3]/65 lg:underline-offset-8"
            >
              <IconVideo
                className="size-3.5 text-zinc-500 lg:size-4 lg:text-[#c85cca]"
                stroke={2}
              />
              <span className="text-zinc-400 lg:text-[#d45ab4]">
                {videoUploading
                  ? t("dance.uploadingVideo")
                  : customVideo
                    ? t("dance.replaceOwnVideo")
                    : t("dance.useOwnVideo")}
              </span>
            </button>
            {customVideo ? (
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(customVideo.previewUrl);
                  setCustomVideo(null);
                  setPlaying(true);
                }}
                className="mx-auto mt-4 block text-xs font-medium text-zinc-500 transition hover:text-zinc-200"
              >
                {t("dance.backToTemplates")}
              </button>
            ) : null}

            <p className="mt-8 hidden text-center text-xs leading-5 text-zinc-600 lg:block">
              {t("dance.consent")}
            </p>
          </div>
        </section>
      </div>

      {photoSheetOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-end bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
          role="presentation"
          onMouseDown={() => !photoUploading && setPhotoSheetOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="dance-photo-title"
            className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#121214] p-5 shadow-2xl shadow-black/70 sm:p-7"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5">
              <div className="flex size-11 items-center justify-center rounded-xl border border-[#c448bc]/25 bg-[#c448bc]/10 text-[#e86bbf]">
                <IconPhoto className="size-5" stroke={2} />
              </div>
              <button
                type="button"
                onClick={() => setPhotoSheetOpen(false)}
                disabled={photoUploading}
                className="inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
                aria-label={t("dance.closePhotoSheet")}
              >
                <IconX className="size-4" stroke={2} />
              </button>
            </div>

            <h2
              id="dance-photo-title"
              className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white"
            >
              {t("dance.photoSheetTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {t("dance.photoSheetSubtitle")}
            </p>

            <ul className="mt-5 space-y-3 text-sm text-zinc-300">
              {[
                t("dance.photoTipOne"),
                t("dance.photoTipTwo"),
                t("dance.photoTipThree"),
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-3">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <IconCheck className="size-3.5" stroke={2.3} />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                if (photoInputRef.current) photoInputRef.current.value = "";
                photoInputRef.current?.click();
              }}
              disabled={photoUploading}
              className="brand-cta mt-7 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl px-5 text-base font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {photoUploading ? (
                <span className="size-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              ) : (
                <IconUpload className="size-5" stroke={2} />
              )}
              {photoUploading
                ? t("dance.uploadingPhoto")
                : t("dance.choosePhoto")}
            </button>
            <p className="mt-4 text-center text-xs text-zinc-600">
              {t("dance.photoFormats")}
            </p>
            <p className="mt-2 text-center text-xs leading-5 text-zinc-600">
              {t("dance.consent")}
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
