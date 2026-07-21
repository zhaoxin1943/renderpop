<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16 with breaking API and convention changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project context

RenderPop frontend — thin Next.js App Router client for the independent Python API.

- Backend repo: `/Users/zx/python_workspace/renderpop_server`
- Product: AI image generation (Fast daily quota + Pro credits), membership, Dodo payments
- Browser talks same-origin `/api/*`; `next.config.ts` rewrites to `API_ORIGIN`
- Do not put business logic, DB, or payment provider secrets in this repo
