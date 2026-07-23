"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IconFolder, IconLoader2, IconPhoto, IconPlus, IconVideo } from "@tabler/icons-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError, apiFetch } from "@/lib/api";
import type { AssetMediaType, GeneratedAsset, GeneratedAssetListResponse } from "@/lib/types";
import { AssetPreviewModal } from "./AssetPreviewModal";

type AssetGroup = {
  label: string;
  items: GeneratedAsset[];
};

function parseAspectRatio(ratioStr: string): number {
  if (!ratioStr) return 9 / 16;
  const [w, h] = ratioStr.split(":").map(Number);
  if (!w || !h || Number.isNaN(w) || Number.isNaN(h) || w <= 0 || h <= 0) return 9 / 16;
  return w / h;
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

function AssetCard({
  asset,
  onSelect,
}: {
  asset: GeneratedAsset;
  onSelect: (asset: GeneratedAsset) => void;
}) {
  const video = asset.task_type.includes("VIDEO");
  const ratio = parseAspectRatio(asset.aspect_ratio);

  return (
    <button
      type="button"
      onClick={() => onSelect(asset)}
      className="group relative h-[250px] max-w-full shrink-0 overflow-hidden rounded-[20px] bg-[#121217] text-left transition duration-300 hover:ring-2 hover:ring-fuchsia-500/60 hover:shadow-[0_10px_30px_rgba(217,70,239,0.2)] focus:outline-none sm:h-[310px] lg:h-[350px]"
      style={{ aspectRatio: String(ratio) }}
      aria-label="Preview asset"
    >
      {video ? (
        <video
          className="size-full object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
          src={asset.result_url}
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="size-full object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
          src={asset.result_url}
          alt={asset.prompt || "Generated asset"}
        />
      )}

      {/* Subtle Bottom Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
    </button>
  );
}



function AssetsSkeleton() {
  return (
    <div className="space-y-11 animate-in fade-in duration-300">
      <section>
        <div className="h-3.5 w-32 rounded-md bg-white/10 animate-pulse" />
        <div className="mt-5 flex flex-wrap gap-4 sm:gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="h-[250px] shrink-0 rounded-[20px] bg-gradient-to-br from-[#1b1d28] via-[#14151e] to-[#1b1d28] animate-pulse sm:h-[310px] lg:h-[350px]"
              style={{ aspectRatio: "9/16" }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export function AssetsGallery() {
  const { user, isLoading } = useAuth();
  const [mediaType, setMediaType] = useState<AssetMediaType>("image");
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<GeneratedAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
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
  }, [mediaType, user, isLoading]);


  const groups = useMemo(() => groupAssets(assets), [assets]);

  function selectMediaType(nextMediaType: AssetMediaType) {
    if (nextMediaType === mediaType) return;
    setLoading(true);
    setMediaType(nextMediaType);
  }

  function handleAssetDeleted(jobId: string) {
    setAssets((prev) => prev.filter((item) => item.job_id !== jobId));
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
            <div className="inline-flex rounded-full border border-white/[0.08] bg-[#141417] p-1 text-sm">
              <button type="button" onClick={() => selectMediaType("image")} className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 font-medium transition ${mediaType === "image" ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)]" : "text-zinc-400 hover:text-white"}`}>
                <IconPhoto className="size-4" stroke={1.8} /> Image
              </button>
              <button type="button" onClick={() => selectMediaType("video")} className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 font-medium transition ${mediaType === "video" ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)]" : "text-zinc-400 hover:text-white"}`}>
                <IconVideo className="size-4" stroke={1.8} /> Video
              </button>
            </div>
          </div>
          <Link href="/create" className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] transition hover:from-fuchsia-400 hover:to-purple-500 active:scale-[0.98]">
            <IconPlus className="size-4" stroke={2.1} /> Create New
          </Link>

        </div>

        <div className="mt-9 flex flex-1 flex-col">
          {loading ? (
            <AssetsSkeleton />
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
                    <div className="mt-5 flex flex-wrap gap-4 sm:gap-5">
                      {group.items.map((asset) => (
                        <AssetCard key={asset.job_id} asset={asset} onSelect={setSelectedAsset} />
                      ))}
                    </div>

                  </section>
                ))}
              </div>
              <p className="mt-auto pb-8 pt-24 text-center text-sm font-medium tracking-[0.05em] text-zinc-500">— No more assets —</p>
            </>
          )}
        </div>
      </div>

      {/* Asset Full Preview Modal */}
      <AssetPreviewModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onDeleted={handleAssetDeleted}
      />
    </main>
  );
}
