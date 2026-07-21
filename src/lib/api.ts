/**
 * Same-origin API client.
 * Requests go to /api/v1/* and are rewritten to the Python backend.
 */

import { getVisitorId } from "@/lib/visitor";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  /** Skip attaching X-Visitor-Id (rare). */
  skipVisitor?: boolean;
};

function parseErrorMessage(data: unknown, status: number): {
  message: string;
  code: string | null;
} {
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string") {
      return {
        message: obj.message,
        code: typeof obj.code === "string" ? obj.code : null,
      };
    }
    if (typeof obj.detail === "string") {
      return { message: obj.detail, code: null };
    }
    if (
      typeof obj.detail === "object" &&
      obj.detail !== null &&
      "message" in obj.detail
    ) {
      const detail = obj.detail as Record<string, unknown>;
      return {
        message:
          typeof detail.message === "string"
            ? detail.message
            : `Request failed (${status})`,
        code: typeof detail.code === "string" ? detail.code : null,
      };
    }
  }
  return { message: `Request failed (${status})`, code: null };
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = path.startsWith("/api/")
    ? path
    : `/api/v1${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!options.skipVisitor && typeof window !== "undefined") {
    const visitorId = getVisitorId();
    if (visitorId) {
      headers.set("X-Visitor-Id", visitorId);
    }
  }

  const res = await fetch(url, {
    method: options.method ?? (options.body !== undefined ? "POST" : "GET"),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: "include",
    signal: options.signal,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const { message, code } = parseErrorMessage(data, res.status);
    throw new ApiError(message, res.status, code, data);
  }

  return data as T;
}
