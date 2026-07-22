"use client";

import { useEffect, useState, useMemo } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

import { apiFetch } from "@/lib/api";
import type { ShowcaseItem, ShowcaseListResponse } from "@/lib/types";

type Props = {
  onTry: (item: ShowcaseItem) => void;
  variant?: "default" | "peek";
};

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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading gallery examples">
        {[0, 1, 2, 3].map((colIdx) => (
          <div key={colIdx} className="space-y-4">
            {[0, 1].map((itemIdx) => (
              <div key={itemIdx} className="aspect-[3/4] animate-pulse rounded-lg bg-white/[0.06]" />
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
        <div key={colIdx} className="flex flex-col gap-4">
          {colItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTry(item)}
              className="group block w-full overflow-hidden rounded-lg border border-white/[0.1] bg-[#121215] text-left transition duration-300 hover:-translate-y-1 hover:border-white/25 active:scale-[0.99]"
            >
              {/* Image rendered dynamically without fixed aspect ratio cropping, preserving full artwork */}
              <div className="relative w-full overflow-hidden bg-[#18181b]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title ?? "Example generation"}
                  className="h-auto w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-black/60 px-3 py-2.5 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span>Use prompt</span>
                  <IconArrowUpRight className="size-3.5" stroke={1.8} />
                </div>
              </div>
              {item.title ? (
                <div className="border-t border-white/[0.08] bg-[#121215] p-3">
                  <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-white">
                    {item.title}
                  </p>
                </div>
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
