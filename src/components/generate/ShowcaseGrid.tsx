"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import type { ShowcaseItem, ShowcaseListResponse } from "@/lib/types";

type Props = {
  onTry: (item: ShowcaseItem) => void;
};

export function ShowcaseGrid({ onTry }: Props) {
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

  if (failed) {
    return (
      <p className="text-center text-sm text-zinc-500">
        Showcase is temporarily unavailable.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-400">Loading examples…</p>
    );
  }

  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onTry(item)}
          className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-sm transition hover:border-violet-300 hover:shadow-md"
        >
          <div className="relative aspect-[9/16] w-full bg-zinc-100">
            <Image
              src={item.image_url}
              alt={item.title ?? "Example generation"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              unoptimized
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-xs font-medium text-white opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
              Try this prompt
            </span>
          </div>
          {item.title ? (
            <p className="truncate px-2.5 py-2 text-xs font-medium text-zinc-700">
              {item.title}
            </p>
          ) : null}
        </button>
      ))}
    </div>
  );
}
