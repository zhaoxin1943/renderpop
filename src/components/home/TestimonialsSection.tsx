"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nContext";

const CDN_BASE = "https://s3.us-east-2.amazonaws.com/renderpop-assets/avatars";

interface ReviewItem {
  nameKey: string;
  roleKey: string;
  textKey: string;
  avatarFile: string;
  initial: string;
  color: string;
}

export function TestimonialsSection() {
  const { t } = useI18n();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const reviews: ReviewItem[] = [
    {
      nameKey: "testimonials.t1Name",
      roleKey: "testimonials.t1Role",
      textKey: "testimonials.t1Text",
      avatarFile: "sarah.webp",
      initial: "S",
      color: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    },
    {
      nameKey: "testimonials.t2Name",
      roleKey: "testimonials.t2Role",
      textKey: "testimonials.t2Text",
      avatarFile: "alex.webp",
      initial: "A",
      color: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    },
    {
      nameKey: "testimonials.t3Name",
      roleKey: "testimonials.t3Role",
      textKey: "testimonials.t3Text",
      avatarFile: "elena.webp",
      initial: "E",
      color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
    {
      nameKey: "testimonials.t4Name",
      roleKey: "testimonials.t4Role",
      textKey: "testimonials.t4Text",
      avatarFile: "marcus.webp",
      initial: "M",
      color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      nameKey: "testimonials.t5Name",
      roleKey: "testimonials.t5Role",
      textKey: "testimonials.t5Text",
      avatarFile: "jihoon.webp",
      initial: "J",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      nameKey: "testimonials.t6Name",
      roleKey: "testimonials.t6Role",
      textKey: "testimonials.t6Text",
      avatarFile: "carlos.webp",
      initial: "C",
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
  ];

  return (
    <section className="bg-[#050505] py-16 sm:py-24 border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {t("testimonials.title")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-400">
            {t("testimonials.subtitle")}
          </p>
        </div>

        {/* 6 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item, idx) => {
            const avatarUrl = `${CDN_BASE}/${item.avatarFile}`;
            const hasError = failedImages[item.avatarFile];

            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d10] hover:border-violet-500/30 transition-all duration-300 group"
              >
                <div>
                  {/* User Header */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-white/15 shadow-md">
                      {!hasError ? (
                        <img
                          src={avatarUrl}
                          alt={t(item.nameKey)}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [item.avatarFile]: true }))
                          }
                        />
                      ) : (
                        <div className={`w-full h-full border flex items-center justify-center font-bold text-sm ${item.color}`}>
                          {item.initial}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-violet-200 transition-colors">
                        {t(item.nameKey)}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {t(item.roleKey)}
                      </p>
                    </div>
                  </div>

                  {/* 5 Star Rating */}
                  <div className="flex items-center gap-1 mb-3 text-violet-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text Quote */}
                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    &ldquo;{t(item.textKey)}&rdquo;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
