# Creen My Assets Topology

Source: `https://www.creen.ai/my-assets`, inspected in the in-app browser on 2026-07-23 at 1387 × 1226 CSS px (DPR 2). The selected visual reference is also attached in this task.

## Regions

1. Shared top navigation (outside this page-specific implementation scope).
2. Main asset library canvas: black background; content begins 77.5px from the viewport edge at the inspected desktop width.
3. Toolbar: `My Assets` title, Image/Video segmented control, and `Create New` action.
4. Date-grouped flex-wrap asset grid. Cards preserve each media aspect ratio at a fixed desktop height.
5. Centered terminal marker: `— No more assets —`.

## Interaction model

- Image/Video: click-driven segmented control; the active tab uses `rgb(37, 38, 48)`.
- Create New: navigation link.
- Asset cards: click-driven open-media action; desktop hover adds a subtle white ring.
- Page scrolling is native; no sticky in-page panels or scroll-driven transitions were observed.
