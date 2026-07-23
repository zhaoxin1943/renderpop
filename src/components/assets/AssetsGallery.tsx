"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IconFolder, IconLoader2, IconPhoto, IconPlus, IconSparkles, IconVideo } from "@tabler/icons-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError, apiFetch } from "@/lib/api";
import type { AssetMediaType, GeneratedAsset, GeneratedAssetListResponse } from "@/lib/types";

type AssetGroup = {
  label: string;
  items: GeneratedAsset[];
};

function aspectRatio(asset: GeneratedAsset) {
  const [width, height] = asset.aspect_ratio.split(":").map(Number);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 16 / 9;
  return width / height;
}

function modelLabel(asset: GeneratedAsset) {
  if (asset.model_code) {
    return asset.model_code
      .replaceAll(/[-_]+/g, " ")
      .replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
  }
  return asset.task_type.includes("VIDEO") ? "RenderPop Video" : "RenderPop Image";
}

function dateLabel(date: Date, today: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const day = 86_400_000;
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date).toUpperCase();
  if (start === todayStart) return `TODAY · ${formatted}`;
  if (start === todayStart - day) return `YESTERDAY · ${formatted}`;
  return formatted;
}

function groupAssets(items: GeneratedAsset[]): AssetGroup[] {
  const today = new Date();
  const groups = new Map<string, GeneratedAsset[]>();
  for (const item of items) {
    const label = dateLabel(new Date(item.created_at), today);
    groups.set(label, [...(groups.get(label) ?? []), item]);
  }
  return [...groups.entries()].map(([label, group]) => ({ label, items: group }));
}

function AssetCard({ asset }: { asset: GeneratedAsset }) {
  const video = asset.task_type.includes("VIDEO");
  const ratio = aspectRatio(asset);

  return (
    <a
      href={asset.result_url}
      target="_blank"
      rel="noreferrer"
      className="group relative h-[160px] max-w-full shrink-0 overflow-hidden rounded-[20px] bg-[#15151a] transition duration-200 hover:ring-2 hover:ring-white/20 sm:h-[190px]"
      style={{ aspectRatio: String(ratio) }}
      aria-label={`Open ${modelLabel(asset)} result`}
    >
      {video ? (
        <video className="size-full object-cover opacity-90" src={asset.result_url} muted playsInline preload="metadata" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="size-full object-cover opacity-90" src={asset.result_url} alt={asset.prompt || "Generated asset"} />
      )}
      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-xs font-medium text-zinc-100 backdrop-blur-md">
        {video ? <IconVideo className="size-3" stroke={1.8} /> : <IconSparkles className="size-3" stroke={1.8} />}
        {modelLabel(asset)}
      </span>
    </a>
  );
}

export function AssetsGallery() {
  const { user, isLoading } = useAuth();
  const [mediaType, setMediaType] = useState<AssetMediaType>("image");
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void apiFetch<GeneratedAssetListResponse>(`/generations/assets?media_type=${mediaType}&limit=60`, { skipVisitor: true })
      .then((response) => {
        if (!active) return;
        setAssets(response.items);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setAssets([]);
        setError(cause instanceof ApiError ? cause.message : "Unable to load your assets.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mediaType, user]);

  const groups = useMemo(() => groupAssets(assets), [assets]);

  function selectMediaType(nextMediaType: AssetMediaType) {
    if (nextMediaType === mediaType) return;
    setLoading(true);
    setMediaType(nextMediaType);
  }

  if (isLoading) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-black"><IconLoader2 className="size-5 animate-spin text-zinc-500" /></div>;
  }

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-black px-6 text-center">
        <div>
          <IconFolder className="mx-auto size-7 text-zinc-500" stroke={1.5} />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">Your assets are waiting</h1>
          <p className="mt-2 text-sm text-zinc-500">Sign in to view every image and video you have created.</p>
          <Link href="/sign-in?return_to=/assets" className="mt-6 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200">Sign in</Link>
        </div>
      </section>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-black px-4 py-11 sm:px-8 lg:px-[5.6vw]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-white">My Assets</h1>
            <div className="inline-flex rounded-full bg-[#20212a] p-1 text-sm">
              <button type="button" onClick={() => selectMediaType("image")} className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-medium transition ${mediaType === "image" ? "bg-[#383944] text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                <IconPhoto className="size-4" stroke={1.8} /> Image
              </button>
              <button type="button" onClick={() => selectMediaType("video")} className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-medium transition ${mediaType === "video" ? "bg-[#383944] text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                <IconVideo className="size-4" stroke={1.8} /> Video
              </button>
            </div>
          </div>
          <Link href="/#create" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#11c9c9] px-4 text-sm font-semibold text-white transition hover:bg-[#19d7d1] active:scale-[0.98]">
            <IconPlus className="size-4" stroke={2.1} /> Create New
          </Link>
        </div>

        <div className="mt-9 flex flex-1 flex-col">
          {loading ? (
            <div className="flex h-48 items-center justify-center"><IconLoader2 className="size-5 animate-spin text-zinc-500" /></div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.05] px-5 py-4 text-sm text-rose-200">{error}</div>
          ) : assets.length === 0 ? (
            <div className="flex min-h-80 flex-1 flex-col items-center justify-center text-center">
              <IconFolder className="size-7 text-zinc-600" stroke={1.5} />
              <p className="mt-4 text-sm font-medium text-zinc-400">No {mediaType} assets yet</p>
              <p className="mt-1 text-sm text-zinc-600">Create something new and it will appear here.</p>
            </div>
          ) : (
            <>
              <div className="space-y-11">
                {groups.map((group) => (
                  <section key={group.label}>
                    <h2 className="text-xs font-bold tracking-[0.05em] text-zinc-500">{group.label}</h2>
                    <div className="mt-5 flex flex-wrap gap-4">
                      {group.items.map((asset) => <AssetCard key={asset.job_id} asset={asset} />)}
                    </div>
                  </section>
                ))}
              </div>
              <p className="mt-auto pb-8 pt-24 text-center text-sm font-medium tracking-[0.05em] text-zinc-500">— No more assets —</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
