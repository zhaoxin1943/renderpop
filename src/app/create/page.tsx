"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { CreationSession, LatestCreationSessionResponse } from "@/lib/types";

export default function CreateEntryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function openLatestSession() {
      try {
        const latest = await apiFetch<LatestCreationSessionResponse>("/creation-sessions/latest");
        const session = latest.session ?? await apiFetch<CreationSession>("/creation-sessions", { method: "POST" });
        if (active) router.replace(`/create/${session.id}`);
      } catch {
        if (active) setError("Could not open your creation session. Please try again.");
      }
    }

    void openLatestSession();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-black px-6 text-sm text-zinc-500">
      {error ?? "Opening your latest creation..."}
    </main>
  );
}
