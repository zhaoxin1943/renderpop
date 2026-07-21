const STORAGE_KEY = "renderpop_visitor_id";

/** Stable anonymous id for Fast daily quota (sent as X-Visitor-Id). */
export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length >= 8) {
      return existing;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return `v_session_${Date.now().toString(36)}`;
  }
}
