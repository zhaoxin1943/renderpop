"use client";

import React from "react";
import Image from "next/image";

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  avatarSrc: string;
  rating: number;
  contentHtml: React.ReactNode;
}

const reviewsData: ReviewItem[] = [
  {
    id: "review-1",
    name: "Alex Vance",
    role: "Digital Content Creator, LA",
    avatarSrc: "/avatars/alex_vance.webp",
    rating: 5,
    contentHtml: (
      <>
        "I turned a portrait photo into a hilarious viral clip using the{" "}
        <strong className="font-semibold text-white">photo to dance ai free</strong>{" "}
        generator. No sign up, no credit card. Generated in under 20 seconds!"
      </>
    ),
  },
  {
    id: "review-2",
    name: "Sofia Rodriguez",
    role: "Freelance Designer, Madrid",
    avatarSrc: "/avatars/sofia_rodriguez.webp",
    rating: 5,
    contentHtml: (
      <>
        "Finding a real{" "}
        <strong className="font-semibold text-white">free ai image generator no sign up</strong>{" "}
        is hard nowadays. RenderPop is completely frictionless. Open the page, prompt, and download."
      </>
    ),
  },
  {
    id: "review-3",
    name: "Kenji Sato",
    role: "Indie Game Dev, Tokyo",
    avatarSrc: "/avatars/kenji_sato.webp",
    rating: 5,
    contentHtml: (
      <>
        "The best{" "}
        <strong className="font-semibold text-white">image to video generator</strong> for quick concept art and character animation. The daily free Fast quota is a lifesaver for rapid prototyping."
      </>
    ),
  },
  {
    id: "review-4",
    name: "Marcus Thorne",
    role: "Social Media Specialist, London",
    avatarSrc: "/avatars/marcus_thorne.webp",
    rating: 5,
    contentHtml: (
      <>
        "RenderPop's{" "}
        <strong className="font-semibold text-white">free ai video generator no login</strong>{" "}
        allowed our team to test 50+ TikTok dance clip variations in one afternoon. The output quality is stellar."
      </>
    ),
  },
];

export function ReviewSection() {
  return (
    <section className="border-t border-white/[0.07] bg-[#08080a] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
            Loved by 100,000+ Creators Worldwide
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            See why creators switch to RenderPop for instant, sign-up-free AI generation.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviewsData.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0d0d12] p-6 transition duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-emerald-500/5"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-md">
                    <Image
                      src={review.avatarSrc}
                      alt={review.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-semibold text-white"
                      itemProp="author"
                    >
                      {review.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{review.role}</p>
                  </div>
                </div>

                <div
                  className="mt-3.5 text-xs tracking-widest text-emerald-400"
                  itemProp="reviewRating"
                  itemScope
                  itemType="https://schema.org/Rating"
                >
                  <meta itemProp="ratingValue" content={String(review.rating)} />
                  <meta itemProp="bestRating" content="5" />
                  {"★".repeat(review.rating)}
                </div>

                <blockquote
                  className="mt-4 text-xs leading-relaxed text-zinc-300 italic"
                  itemProp="reviewBody"
                >
                  {review.contentHtml}
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
