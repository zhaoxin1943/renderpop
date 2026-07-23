"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import {
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconAlertCircle,
  IconX,
} from "@tabler/icons-react";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastOptions = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  icon?: ReactNode;
};

export type ToastItem = ToastOptions & {
  id: string;
};

export type ToastContextType = {
  toast: {
    success: (title: string, description?: string, options?: Partial<ToastOptions>) => void;
    error: (title: string, description?: string, options?: Partial<ToastOptions>) => void;
    warning: (title: string, description?: string, options?: Partial<ToastOptions>) => void;
    info: (title: string, description?: string, options?: Partial<ToastOptions>) => void;
    custom: (options: ToastOptions) => void;
  };
  /** Downward compatible signature */
  showToast: (title: string, description?: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const id = crypto.randomUUID();
    const duration = options.duration ?? 2800;
    const item: ToastItem = { ...options, id, type: options.type ?? "success" };

    setToasts((prev) => [...prev, item]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showToast = useCallback(
    (title: string, description?: string, type: ToastType = "success") => {
      addToast({ title, description, type });
    },
    [addToast]
  );

  const toastHelpers = {
    success: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "success" }),
    error: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "error" }),
    warning: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "warning" }),
    info: (title: string, description?: string, options?: Partial<ToastOptions>) =>
      addToast({ ...options, title, description, type: "info" }),
    custom: (options: ToastOptions) => addToast(options),
  };

  return (
    <ToastContext.Provider value={{ toast: toastHelpers, showToast }}>
      {children}
      {/* Global Top-Right Floating Toast Drawer */}
      <aside
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-16 right-4 z-[100] flex w-full max-w-[360px] flex-col gap-2.5 px-3 sm:right-6 sm:px-0"
      >
        {toasts.map((item) => {
          const type = item.type ?? "success";

          // Theme Variant Configurations (Taste-Skill compliant: dark tech, high contrast accent, restrained glow)
          const theme =
            type === "error"
              ? {
                  bar: "bg-gradient-to-r from-rose-500 to-amber-500/80",
                  iconBox: "border-rose-500/25 bg-rose-500/10 text-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.22)]",
                  IconComponent: IconAlertCircle,
                }
              : type === "warning"
              ? {
                  bar: "bg-gradient-to-r from-amber-400 to-orange-500/80",
                  iconBox: "border-amber-500/25 bg-amber-500/10 text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.22)]",
                  IconComponent: IconAlertTriangle,
                }
              : type === "info"
              ? {
                  bar: "bg-gradient-to-r from-sky-400 to-indigo-500/80",
                  iconBox: "border-sky-500/25 bg-sky-500/10 text-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.22)]",
                  IconComponent: IconInfoCircle,
                }
              : {
                  // Default success
                  bar: "bg-gradient-to-r from-emerald-400 via-teal-400 to-fuchsia-500/60",
                  iconBox: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.25)]",
                  IconComponent: IconCheck,
                };

          const IconComp = theme.IconComponent;

          return (
            <div
              key={item.id}
              className="pointer-events-auto group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c0c10]/95 p-3.5 pr-4 shadow-[0_16px_45px_rgba(0,0,0,0.75)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-3"
            >
              {/* Top hairline ambient glow indicator */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.bar}`} />

              {/* Custom or Preset Icon */}
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${theme.iconBox}`}>
                {item.icon ? item.icon : <IconComp className="size-4" stroke={2.1} />}
              </div>

              {/* Toast Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold tracking-wide text-white leading-tight">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1 text-[11px] font-medium text-zinc-400 truncate leading-snug">
                    {item.description}
                  </p>
                ) : null}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg text-zinc-500 opacity-60 transition hover:bg-white/[0.08] hover:text-white hover:opacity-100"
                aria-label="Close"
              >
                <IconX className="size-3.5" stroke={2} />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}
