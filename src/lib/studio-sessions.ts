import type { GenerationTaskResponse, TaskStatus, TaskType } from "@/lib/types";

const STORAGE_KEY = "renderpop:create-sessions";
const MAX_SESSIONS = 30;

export type StudioTask = {
  jobId: string;
  taskType: TaskType;
  status: TaskStatus;
  prompt: string;
  sourcePreviewUrl: string | null;
  resultUrl: string | null;
  createdAt: string;
  completedAt: string | null;
  failureCode: string | null;
};

export type StudioSession = {
  id: string;
  createdAt: string;
  updatedAt: string;
  tasks: StudioTask[];
};

export type StudioTaskSubmission = {
  task: GenerationTaskResponse;
  prompt: string;
  sourcePreviewUrl: string | null;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function parseSessions(value: string | null): StudioSession[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((session): session is StudioSession => (
      typeof session === "object"
      && session !== null
      && typeof (session as StudioSession).id === "string"
      && Array.isArray((session as StudioSession).tasks)
    ));
  } catch {
    return [];
  }
}

function writeSessions(sessions: StudioSession[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
}

function toStudioTask(submission: StudioTaskSubmission): StudioTask {
  const { task } = submission;
  return {
    jobId: task.job_id,
    taskType: task.task_type,
    status: task.status,
    prompt: submission.prompt,
    sourcePreviewUrl: submission.sourcePreviewUrl,
    resultUrl: task.result_urls?.[0] ?? null,
    createdAt: task.created_at ?? new Date().toISOString(),
    completedAt: task.completed_at,
    failureCode: task.failure_code,
  };
}

export function createStudioSession(submission: StudioTaskSubmission): StudioSession {
  const now = new Date().toISOString();
  const session: StudioSession = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    tasks: [toStudioTask(submission)],
  };
  const sessions = getStudioSessions();
  writeSessions([session, ...sessions]);
  return session;
}

export function createEmptyStudioSession(): StudioSession {
  const now = new Date().toISOString();
  const session: StudioSession = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    tasks: [],
  };
  const sessions = getStudioSessions();
  writeSessions([session, ...sessions]);
  return session;
}

export function getStudioSessions(): StudioSession[] {
  if (!canUseStorage()) return [];
  return parseSessions(window.localStorage.getItem(STORAGE_KEY));
}

export function getStudioSession(id: string): StudioSession | null {
  return getStudioSessions().find((session) => session.id === id) ?? null;
}

export function appendStudioTask(sessionId: string, submission: StudioTaskSubmission): StudioSession | null {
  const sessions = getStudioSessions();
  const now = new Date().toISOString();
  let updated: StudioSession | null = null;
  const next = sessions.map((session) => {
    if (session.id !== sessionId) return session;
    updated = {
      ...session,
      updatedAt: now,
      tasks: [...session.tasks, toStudioTask(submission)],
    };
    return updated;
  });
  writeSessions(next);
  return updated;
}

export function updateStudioTask(
  sessionId: string,
  jobId: string,
  task: GenerationTaskResponse,
): StudioSession | null {
  const sessions = getStudioSessions();
  let updated: StudioSession | null = null;
  const next = sessions.map((session) => {
    if (session.id !== sessionId) return session;
    const hasTask = session.tasks.some((item) => item.jobId === jobId);
    if (!hasTask) return session;
    updated = {
      ...session,
      updatedAt: new Date().toISOString(),
      tasks: session.tasks.map((item) => item.jobId === jobId ? {
        ...item,
        taskType: task.task_type,
        status: task.status,
        resultUrl: task.result_urls?.[0] ?? item.resultUrl,
        completedAt: task.completed_at,
        failureCode: task.failure_code,
      } : item),
    };
    return updated;
  });
  writeSessions(next);
  return updated;
}
