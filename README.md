# RenderPop (web)

Thin Next.js frontend for **RenderPop** — AI image generation (Fast daily quota + Pro credits), membership, and Dodo checkout.

Backend lives in a separate repo:

```text
/Users/zx/python_workspace/renderpop_server
```

This app is a **from-scratch** client. Old face-swap / IGRecent migration scaffolds were removed.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- pnpm

## Layout

```text
src/
  app/                 # routes (generate, pricing, sign-in, account, payment)
  components/layout/   # Header, Footer
  lib/                 # api client, types, site config
public/
```

Business logic, auth sessions, credits, generation, and webhooks stay on the Python API. The browser only talks to same-origin `/api/*`.

## Local development

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (metadata) |
| `API_ORIGIN` | Python API base (default `http://127.0.0.1:8000`) |

`next.config.ts` rewrites:

```text
/api/*  →  ${API_ORIGIN}/api/*
```

so cookies stay first-party during OAuth/session work.

Start the API separately (see backend README / HANDOFF).

## Product scope (MVP)

| In scope | Deferred |
|----------|----------|
| Generate (Fast / Pro) | AI Dance |
| Sign-in (Google + session) | Admin |
| Pricing + checkout | Face swap (retired) |
| Account (me / credits / history) | |

## Status

Homepage vertical slice (MVP):

- `/` — Free AI Image Generator studio (Fast, default **9:16**)
- Visitor id in `localStorage` → `X-Visitor-Id`
- Free daily Fast quota from `GET /api/v1/me/entitlements`
- Showcase waterfall from `GET /api/v1/showcase` (Try this prompt)
- Other routes still shells: pricing, sign-in, account, payment

Backend needs to be running on `API_ORIGIN` (default `http://127.0.0.1:8000`).
