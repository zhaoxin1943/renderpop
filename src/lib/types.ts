/** Shared API shapes - keep in sync with renderpop_server. */

export type TaskType =
  | "FAST_IMAGE"
  | "PRO_IMAGE"
  | "FAST_IMAGE_TO_IMAGE"
  | "PRO_IMAGE_TO_IMAGE"
  | "TEXT_VIDEO"
  | "IMAGE_VIDEO";

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
  length: number | null;
  resolution: string | null;
  generate_audio: boolean | null;
  result_transfer_status: string | null;
  result_urls: string[] | null;
  failure_code: string | null;
  created_at: string | null;
  completed_at: string | null;
};

export type GenerationQuoteResponse = {
  job_type: TaskType;
  credits_required: number;
  length: number;
  resolution: string;
  generate_audio: boolean | null;
  can_generate: boolean | null;
  available_credits: number | null;
  pricing_version: string | null;
};

export type GenerationJobOptions = {
  job_type: TaskType;
  aspect_ratios: string[];
  default_aspect_ratio: string;
  resolutions: string[] | null;
  default_resolution: string | null;
  requires_input_asset: boolean;
  requires_login: boolean;
  credits_required: number | null;
  credits_required_member: number | null;
  uses_fast_daily_quota: boolean;
};

export type GenerationOptionsResponse = {
  jobs: GenerationJobOptions[];
};

export type UploadIntentResponse = {
  asset_id: string;
  upload_url: string;
  storage_key: string;
  headers: Record<string, string>;
  expires_in: number;
  asset_type: string;
  status: string;
};

export type AssetResponse = {
  asset_id: string;
  asset_type: string;
  status: string;
  mime_type: string | null;
  byte_size: number | null;
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
