# AssetsGallery Specification

## Overview

- Target file: `src/components/assets/AssetsGallery.tsx`
- Visual truth: user-supplied Creen My Assets screenshot and the live `https://www.creen.ai/my-assets` page.
- Interaction model: click-driven media tabs and asset links; otherwise static/native scroll.

## Desktop measurements

- Browser viewport: `1387 × 1226` CSS px at DPR 2.
- Content edge: `x = 77.5px`; usable content width: `1232px`.
- Toolbar sits about `50px` below the 64px site header.
- Date label: 12px Inter, 700 weight, 16px line-height, `0.6px` tracking, `rgb(113, 113, 122)`.
- Asset cards: `height: 190px`, `border-radius: 20px`, 16px horizontal/vertical gap. Measured 16:9 widths are `337.77px`; measured 9:16 widths are `106.875px`.
- Badge: top/right 12px, semi-transparent black with 1px white/10 border, 6px radius, 12px icon and copy.
- Empty terminal text: 14px Inter, 500 weight, 20px line-height, `0.7px` tracking, `rgb(113, 113, 122)`.

## Responsive behavior

- Desktop: date groups are a horizontal flex-wrap row; media keeps a 190px height.
- Small screen: cards reduce to a 160px height; card aspect ratio is retained.
- Content gutter contracts from roughly 5.6vw desktop to 16px mobile.

## Product substitutions

- RenderPop uses its existing shared navigation and media URLs from the authenticated API, rather than Creen branding or user-owned sample media.
- The client requests only successful output assets. Uploaded source files do not appear in this library.
