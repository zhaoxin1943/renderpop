"use client";

import { useEffect, useState, useMemo } from "react";

import { apiFetch } from "@/lib/api";
import type { ShowcaseItem, ShowcaseListResponse } from "@/lib/types";

type Props = {
  onTry: (item: ShowcaseItem) => void;
  variant?: "default" | "peek";
};

// Preset varied aspect ratio columns to simulate a realistic waterfall layout while fetching API
const SKELETON_COLUMNS = [
  ["aspect-[9/16]", "aspect-[4/3]", "aspect-[3/4]"],
  ["aspect-[3/4]", "aspect-[9/16]", "aspect-[1/1]"],
  ["aspect-[1/1]", "aspect-[3/4]", "aspect-[9/16]"],
  ["aspect-[9/16]", "aspect-[1/1]", "aspect-[3/4]"],
];

function ShowcaseCard({ item, onTry }: { item: ShowcaseItem; onTry: (item: ShowcaseItem) => void }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert "9:16" -> "9 / 16" for standard CSS aspectRatio property
  const aspectRatioStyle = useMemo(() => {
    if (!item.aspect_ratio) return "3 / 4";
    return item.aspect_ratio.replace(":", " / ");
  }, [item.aspect_ratio]);

  return (
    <button
      type="button"
      onClick={() => onTry(item)}
      className="group relative block w-full overflow-hidden rounded-xl border border-white/[0.1] bg-[#121215] text-left transition duration-300 hover:-translate-y-1 hover:border-white/25 active:scale-[0.99]"
    >
      <div
        className="relative w-full overflow-hidden bg-[#18181b]"
        style={{ aspectRatio: aspectRatioStyle }}
      >
        {/* Placeholder skeleton before image download finishes */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_url}
          alt={item.title ?? "Example generation"}
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 group-hover:scale-[1.02] ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />

        {/* Hover overlay with brand-themed Create Similar button */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-black/25 to-transparent pb-4 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="brand-cta inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-950/40 transition duration-200 group-hover:scale-105 active:scale-95">
            Create Similar
          </span>
        </div>
      </div>
    </button>
  );
}

export function ShowcaseGrid({ onTry, variant = "default" }: Props) {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<ShowcaseListResponse>("/showcase?limit=24", {
          skipVisitor: true,
        });
        if (!cancelled) {
          setItems(data.items);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Split items into 4 columns for true Masonry layout on desktop
  const columns = useMemo(() => {
    const colCount = 4;
    const cols: ShowcaseItem[][] = Array.from({ length: colCount }, () => []);
    items.forEach((item, idx) => {
      cols[idx % colCount].push(item);
    });
    return cols;
  }, [items]);

  if (failed) {
    return (
      <p className="text-center text-xs text-[#71717a]">
        Showcase is temporarily unavailable.
      </p>
    );
  }

  if (items.length === 0) {
    if (variant === "peek") {
      return (
        <div className="grid grid-cols-3 gap-2" aria-label="Loading gallery examples">
          {[0, 1, 2].map((index) => (
            <div key={index} className="aspect-[4/5] animate-pulse rounded-lg bg-white/[0.06]" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Loading gallery examples">
        {SKELETON_COLUMNS.map((colAspects, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-3 sm:gap-4">
            {colAspects.map((aspectClass, itemIdx) => (
              <div
                key={itemIdx}
                className={`w-full overflow-hidden rounded-xl border border-white/[0.07] bg-[#121215] animate-pulse ${aspectClass}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "peek") {
    const visibleItems = items.slice(0, 6);
    return (
      <div className="grid max-h-[142px] grid-cols-3 gap-2 overflow-hidden sm:max-h-[170px]">
        {visibleItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTry(item)}
            className={`group block w-full overflow-hidden rounded-lg border border-white/[0.1] bg-[#121215] text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/25 active:translate-y-0 ${index > 2 ? "hidden sm:block" : ""}`}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#18181b]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title ?? "Example generation"}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {columns.map((colItems, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-3 sm:gap-4">
          {colItems.map((item) => (
            <ShowcaseCard key={item.id} item={item} onTry={onTry} />
          ))}
        </div>
      ))}
    </div>
  );
}

