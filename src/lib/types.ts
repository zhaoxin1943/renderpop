/** Shared API shapes - keep in sync with renderpop_server. */

export type TaskType = "FAST_IMAGE" | "PRO_IMAGE";

/** Matches renderpop_server TaskStatus StrEnum values. */
export type TaskStatus =
  | "CREATED"
  | "MODERATING"
  | "QUEUED"
  | "SUBMITTING"
  | "PROCESSING"
  | "SUCCEEDED"
  | "REJECTED"
  | "FAILED"
  | "CANCEL_REQUESTED"
  | "CANCELED"
  | "EXPIRED";

export type FastImageQuota = {
  daily_limit: number;
  used: number;
  remaining: number;
  resets_at: string;
};

export type CreditBalance = {
  available: number;
  reserved: number;
  expiring_soon: number;
  next_expiration_at: string | null;
};

export type EntitlementsResponse = {
  plan: string;
  membership_active: boolean;
  current_period_end: string | null;
  fast_image: FastImageQuota;
  credits: CreditBalance;
  concurrent_job_limit: number;
};

export type GenerationTaskResponse = {
  job_id: string;
  task_type: TaskType;
  status: TaskStatus;
  aspect_ratio: string;
  credits_reserved: number;
  result_transfer_status: string | null;
  result_urls: string[] | null;
  failure_code: string | null;
  created_at: string | null;
  completed_at: string | null;
};

export type ShowcaseItem = {
  id: string;
  title: string | null;
  prompt: string;
  image_url: string;
  aspect_ratio: string;
};

export type ShowcaseListResponse = {
  items: ShowcaseItem[];
};

export const ASPECT_RATIOS = ["9:16", "16:9", "1:1", "3:4", "4:3"] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];
export const DEFAULT_ASPECT_RATIO: AspectRatio = "9:16";
