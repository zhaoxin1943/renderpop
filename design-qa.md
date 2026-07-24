# Dance Page Design QA

## Comparison Target

- Desktop source visual truth: `/Users/zx/.codex/generated_images/019f920f-0ff6-7812-bd93-9b1a92dbe68a/call_BtfN3qsTsP5czXaJVNDncypo.png`
- Mobile source visual truth: `/Users/zx/.codex/generated_images/019f920f-0ff6-7812-bd93-9b1a92dbe68a/call_tJBztx88eC1PtUpT2XsttiFC.png`
- Desktop implementation screenshot: `/private/tmp/renderpop-dance-desktop-qa.png`
- Mobile implementation screenshots:
  - `/private/tmp/renderpop-dance-mobile-qa-top.png`
  - `/private/tmp/renderpop-dance-mobile-qa-operation-v2.png`
- Focused photo-sheet screenshot: `/private/tmp/renderpop-dance-mobile-photo-sheet.png`
- Full-view comparison evidence:
  - `/private/tmp/renderpop-dance-desktop-comparison.png`
  - `/private/tmp/renderpop-dance-mobile-comparison-3up.png`

## Viewports And Normalization

- Desktop implementation: `1440 × 1024` CSS px, `devicePixelRatio: 1`, screenshot `1440 × 1024`.
- Desktop source: `1487 × 1058`. For comparison, source and implementation were each fit into a `720 × 512` frame and placed side by side.
- Mobile implementation: `390 × 844` CSS px, `devicePixelRatio: 1`, screenshots `390 × 844`.
- Mobile source: `853 × 1844`. For comparison, it was normalized to `390 × 842` and padded to `390 × 844`; the two native implementation viewport states were placed beside it.
- The source mobile mock is a long-page composition rather than one physical viewport, so the implementation is represented by separate top/video and scrolled/conversion states.

## State

- Dark theme.
- Initial conversion state with template 1 selected, autoplay on, muted on, and no photo uploaded.
- Desktop and mobile screenshots use the signed-out header state; authenticated interaction checks were also completed.
- Real user-supplied template 1 media replaces the concept mock's generated dancer image.

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: Geist matches the existing RenderPop system and preserves the source hierarchy. The mobile conversion copy is centered while desktop copy remains left aligned. Display scale, weight, line height, and wrapping are visually consistent with the source intent.
- Spacing and layout rhythm: desktop preserves the immersive stage/right conversion-column split, a large 9:16 player, side navigation, and one dominant CTA. Mobile preserves the video-first sequence and moves the conversion content immediately below it. The extra mobile section height keeps the focused conversion area separate from the global footer.
- Colors and tokens: the existing RenderPop black surfaces and violet-magenta-coral CTA are retained. Border opacity, muted copy, playback controls, and background treatment are consistent with the selected direction.
- Image quality and asset fidelity: the implementation uses the real S3 MP4 and PNG assets, not placeholders or CSS-drawn media. Desktop uses the actual poster as a blurred stage backdrop. Object-fit and 9:16 framing stay sharp at both tested sizes.
- Copy and content: the implementation keeps the agreed low-friction message: one clear photo, no prompt, about two minutes, one primary upload action, and a secondary custom-video action. A concise consent note is included.
- Icons: Tabler icons are used consistently for upload, playback, sound, navigation, clock, trend, and state feedback.
- Accessibility: controls have accessible labels, keyboard arrow navigation works, touch targets are at least 44 px, focus rings are present on media controls, reduced-motion users do not autoplay, and the upload guidance uses a semantic modal.

## Comparison History

### Iteration 1

- [P1] The secondary custom-video action rendered as a solid gradient rectangle rather than gradient-accented text.
  - Fix: removed the conflicting background-clip composition and used a stable magenta text treatment with an underline.
  - Post-fix evidence: `/private/tmp/renderpop-dance-desktop-qa.png` and `/private/tmp/renderpop-dance-mobile-qa-operation-v2.png`.
- [P2] The desktop stage backdrop was black because the optimized remote poster failed to render in the blurred background layer.
  - Fix: rendered the public S3 poster directly as the real backdrop asset.
  - Post-fix evidence: `/private/tmp/renderpop-dance-desktop-qa.png`.
- [P2] Mobile conversion copy was left aligned and the footer entered the focused conversion viewport too early.
  - Fix: centered the mobile conversion hierarchy, preserved desktop left alignment, and increased the mobile conversion section height without moving the content group down.
  - Post-fix evidence: `/private/tmp/renderpop-dance-mobile-qa-operation-v2.png`.

## Primary Interactions Tested

- Template 2 button updates the selected indicator and changes the live video source to `2.mp4`.
- Pause changes the video to a paused state and exposes the Play label.
- The primary upload CTA opens the photo-guidance sheet.
- The photo-guidance sheet exposes all guidance, format limits, a working close control, and the file chooser action.
- Browser console checked after desktop/mobile rendering and interactions: no errors or warnings.

## Focused Region Evidence

- The photo-guidance sheet was inspected separately because its text, spacing, state iconography, bottom-sheet treatment, and CTA are too small to assess in the full-page comparisons.
- Evidence: `/private/tmp/renderpop-dance-mobile-photo-sheet.png`.

## Follow-up Polish

- P3: production authenticated headers will show the user's balance/avatar rather than the signed-out state used in the final screenshots.
- P3: actual file transfer and paid generation were not triggered during visual QA to avoid storing test user media or consuming credits.

### Iteration 2 — mobile template-rail hero

- Source visual truth: `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-8c951fb4-0e03-40bf-82bf-cd886f9ab518.png`.
- Browser-rendered implementation: `/private/tmp/renderpop-dance-mobile-template-rail-final-top.png`.
- Viewport: `390 × 844` CSS px. Browser reported `devicePixelRatio: 2`; the captured implementation evidence is `390 × 844` px. The source is `853 × 1844` px, which normalizes to the same `390 × 844` composition at approximately `2.19×` density.
- State: English, no photo selected, template 1 selected, autoplay on, muted on. The source and implementation images were opened together in the QA comparison input.

**Findings**

- [P1, fixed] The first rail pass left playback controls visually behind the first thumbnail and placed the CTA too far below the first viewport.
  - Fix: reduced the mobile stage height, lifted the title into the reference position, kept the controls immediately above the rail, and tightened the rail-to-CTA handoff.
  - Post-fix evidence: `/private/tmp/renderpop-dance-mobile-template-rail-final-top.png`.
- [P2, fixed] Centering the active thumbnail with `scrollIntoView()` could move the page vertically in browser automation.
  - Fix: scroll only the horizontal template rail using its own `scrollLeft` target.
  - Post-fix evidence: template 2 selection changed the active state and live MP4 source while preserving the rail interaction.

**Required Fidelity Surfaces**

- Fonts and typography: the mobile headline keeps the source's dense two-line hierarchy; small helper copy remains subdued and the CTA label has one clear reading order.
- Spacing and layout rhythm: the player, rail, progress line, CTA, helper line, and custom-video link now all enter the initial mobile composition in that order. Touch controls remain clear of the rail.
- Colors and visual tokens: the existing RenderPop black, translucent playback chrome, and violet-to-coral CTA are retained. The real poster is softly expanded behind a contained foreground video to avoid cropping a person's head or body.
- Image quality and asset fidelity: the rail uses the real uploaded template PNGs and selection updates the real S3 MP4; no placeholder or hand-drawn media is used.
- Copy and app content: `Make this dance yours` introduces selection, `Use this dance` starts the existing photo path, and `1 photo · about 2 min` explains the commitment before the secondary video path.

**Focused Region Evidence**

- The rail/CTA boundary was inspected in the browser screenshot because it carries both the template-selection state and the conversion path. No separate crop was needed; all controls remain legible at the verified viewport.

**Primary Interactions Tested**

- Template 2 becomes selected and updates the video source to `https://s3.us-east-2.amazonaws.com/renderpop-assets/dance/templates/2.mp4`.
- `Use this dance` opens the existing clear-photo guidance dialog; no test media was uploaded.
- Browser console: no errors or warnings.

**Accepted intentional difference**

- The reference is a full-bleed editorial still. The implementation uses a full, uncropped live 9:16 video over its own softened poster backdrop, per the decision to protect every template's subject framing.

### Iteration 3 — compact mobile action tray

- Source visual truth: `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-f3ef8b91-2df7-4981-89fc-60c5ed3f70f6.png`.
- Browser-rendered implementation: `/private/tmp/renderpop-dance-mobile-compact-cta.png`.
- Viewport: `390 × 844` CSS px; implementation screenshot `390 × 844` px. The source is `866 × 1858` px and was compared at the same mobile composition in the QA input.
- State: English, no photo selected, first template selected, live video playing muted.

**Findings**

- [P1, fixed] The previous 72px CTA carried too much visual weight and competed with the media stage.
  - Fix: reduced the mobile CTA to 56px with 18px type, a smaller arrow and lighter shadow; tightened the helper and secondary-action spacing; increased the uncropped video stage from `55svh` to `59svh`.
  - Post-fix evidence: `/private/tmp/renderpop-dance-mobile-compact-cta.png`.

**Required Fidelity Surfaces**

- Typography and copy: the headline remains the strongest text element; the compact CTA has a clear second-level hierarchy and the helper copy stays quiet.
- Layout rhythm: the recovered action height is returned to the video stage, while the CTA remains fully visible in the initial mobile viewport.
- Colors and assets: the real MP4 and template PNG assets, translucent controls, and brand gradient remain unchanged.
- Interaction: the CTA still opens the existing photo chooser, and the template rail retains its active-selection behavior.

**Accepted intentional difference**

- The real source video is contained over its softened poster backdrop so every template keeps its subject framing; the editorial reference is a full-bleed still.

### Iteration 4 — restrained mobile confirmation tray

- Before-state evidence: `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-c52e51e6-a329-4681-ab7e-74623a10ca63.png`.
- Browser-rendered implementation: `/private/tmp/renderpop-dance-mobile-restrained-cta-final.png` at `390 × 844` CSS px.
- State: English, no photo selected, first template selected, muted autoplay.

**Findings**

- [P1, fixed] The action area still read as a second conversion module: a wide gradient CTA, helper line, highlighted secondary link, and page-level consent copy all competed with the video.
  - Fix: expanded the uncropped player to `64svh`; converted the primary control to a centered 48px confirmation button; removed the helper line; demoted custom-video upload to muted text; and moved consent into the photo chooser immediately before file selection.
  - Post-fix evidence: `/private/tmp/renderpop-dance-mobile-restrained-cta-final.png`.

**Required Fidelity Surfaces**

- Typography and hierarchy: the dance title and live media remain first; the CTA is now clearly subordinate while remaining a 48px accessible touch target.
- Spacing and layout: the released operation space is returned to the video stage, with the template rail visually bridging media and confirmation.
- Colors and imagery: real S3 video/poster assets and the single brand CTA remain intact; the custom path is intentionally neutral.
- Copy and interaction: the page exposes one direct action; the legal consent appears in the photo chooser, where users act on it. The CTA still opens that chooser and its photo-format requirements.

final result: passed

### Iteration 5 — desktop stage + confirmation console

- Source visual truth: the browser-rendered desktop baseline at `/private/tmp/renderpop-dance-desktop-before.png`, grounded by the user-provided starting state at `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-5210a9a4-6be8-4611-b0ac-55b73b21377d.png`.
- Browser-rendered implementation: `/private/tmp/renderpop-dance-desktop-stage-console.png`.
- Viewport and normalization: the before and after browser captures are both `1600 × 1313` px full-page images from the same desktop state, so they were opened together at matching pixel dimensions for the visual comparison. The supplied starting screenshot is a wider browser capture and was used only to confirm the existing desktop visual language, not to compare literal placement.
- State: English, no photo or custom video, template 1 active, muted autoplay. The desktop template 2 state was also verified at `/private/tmp/renderpop-dance-desktop-template-selected.png`.

**Findings**

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: the existing Geist display hierarchy and compact metadata treatment remain intact. The selected-template summary uses a deliberately quiet label/name/count stack, so it reinforces the decision without competing with the headline.
- Spacing and layout rhythm: the former hard two-column split is softened by a more balanced desktop grid, closer stage controls, and a bottom-edge template rail. The right-hand content reads as one compact confirmation path rather than a second competing landing-page hero.
- Colors and visual tokens: the black stage, subdued white borders, translucent controls, and RenderPop violet-to-coral CTA remain consistent. The removed desktop divider reduces a visual break without changing the brand's dark, high-contrast environment.
- Image quality and asset fidelity: the player and template rail use the existing real S3 MP4/PNG catalog. The foreground player keeps `object-contain` on desktop as well, preserving each dancer's framing rather than cropping for fill.
- Copy and content: the product promise, one-photo explanation, duration, primary upload, custom-video fallback, and consent copy remain unchanged. The active dance's existing title and position now provide direct context for the primary action.
- Interaction and accessibility: desktop template buttons retain names, selection state, keyboard navigation, visible focus rings, and 44px playback controls. Clicking `Choose dance template 2` updated the active video and the console summary from `Blue Tempo · 1 / 9` to `Soft Bounce · 2 / 9`.

**Focused Region Evidence**

- The template rail and confirmation summary were examined in the selected-template browser capture because that linkage is the new desktop-specific behavior. Its selected outline, poster, title, and numeric position are all visible and synchronized.

**Primary Interactions Tested**

- `Choose dance template 2` is unique, interactive, and updates the preview and selected-template console.
- Desktop playback, audio, previous, and next controls remain exposed with their existing accessible names.
- The primary upload action remains visible and retains the existing authenticated photo-upload path; no media was uploaded or generation started.
- Browser console: no errors after the final desktop interaction.
- Type check, component lint, and the production build passed.

**Accepted intentional changes**

- The desktop rail replaces the former dot/pagination and swipe hint. This follows the agreed mouse-first control model while preserving keyboard arrows and explicit previous/next controls.
- The desktop stage is slightly shorter to make the real template rail visible within the first composition; mobile uses none of these `lg:` overrides and was separately rechecked at `390 × 844` in `/private/tmp/renderpop-dance-mobile-regression-final.png`.

final result: passed

### Iteration 6 — custom motion-video source flow

- Source visual truth: `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-94d8f6aa-c239-4326-917b-b6a2519d4d26.png`, the accepted desktop confirmation-console language. The custom-video chooser is a new state without a separate visual mock; it extends the existing dark dialog, violet-to-coral action, subdued legal copy, and compact secondary-flow treatment.
- Browser-rendered implementation: `/private/tmp/renderpop-dance-custom-video-desktop.png`.
- Viewport and normalization: the implementation is a `1280 × 1024` browser capture. The source is a portrait console crop, so this comparison evaluates the shared visual system and interaction state rather than literal placement. Both images were opened together in the same QA comparison input.
- State: English, no photo selected, template 1 active; `Or use your own video` has been activated and the dedicated motion-video dialog is open. No file was chosen, uploaded, or generated.

**Findings**

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: the new dialog uses the existing dense white heading, restrained gray explanation, and compact meta text. `Next:` is visually emphasized without interrupting the two-step reading order.
- Spacing and layout rhythm: the dialog is centered on desktop with the same dark, rounded surface, compact close target, 14px upload action, and quiet format/legal tail used elsewhere in the page. The underlying dance stage remains visible but defocused, preserving context without competing with the next action.
- Colors and visual tokens: the black veil, translucent violet icon surface, muted borders, and brand-gradient `Choose video` CTA extend the existing RenderPop console rather than introducing a second visual language.
- Image quality and asset fidelity: the obscured background continues to use the real dance template media already present in the selected path. The new dialog needs no synthetic imagery; its video and upload icons come from the existing icon system.
- Copy and content: the alternative path now explicitly communicates `Upload your motion video` → `Next: add one clear photo to place a person in it.` The template route's primary CTA is consistently `Use this dance`; after a custom video is ready, the primary action changes to `Add a photo` before `Generate video`.
- Interaction and accessibility: the custom-video entry button and dialog close control have unique accessible names. The dialog uses `aria-modal`, a labelled heading, blocking upload state, accepted-file metadata, and the same permission notice immediately before file selection.

**Focused Region Evidence**

- The custom motion-video dialog was inspected as the focused region because it is the new conversion step. Its title, explanatory sentence, next-step callout, action, format rule, and close control are simultaneously visible in `/private/tmp/renderpop-dance-custom-video-desktop.png`; a separate crop was not needed.

**Primary Interactions Tested**

- `Or use your own video` resolves uniquely and opens `Upload your motion video`; it does not navigate to the homepage's generic prompt-based Video composer.
- The dialog exposes one unique `Choose video` action and a unique `Close video chooser` control. A real file upload was intentionally not triggered because it would transmit local media and create a server asset.
- The existing template path still exposes one `Use this dance` button at desktop width.
- Browser console: no errors or warnings after opening the alternative source flow.
- Component lint, TypeScript, `git diff --check`, and the production build passed.

**Responsive check**

- The pre-existing mobile stage, template rail, and restrained `Use this dance` tray were not changed by this iteration. The new dialog is mobile-first (`items-end` with base padding) and only centers from the existing `sm:` breakpoint upward. The in-app browser's viewport override remained `1280 × 720` after a requested `390 × 844` override, so this iteration could not produce a new physical mobile capture; the prior accepted `390 × 844` baseline remains `/private/tmp/renderpop-dance-mobile-regression-final.png`.

final result: passed

### Iteration 7 — state-aware custom-video guidance

- Source visual truth: the user-provided paired state at `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-2b2962d5-a0c1-4a5a-a6c8-c79f2c5db469.png` (photo already ready) and `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-62054d69-1b5e-4741-b08b-9bc4db0959db.png` (the now-incorrect generic `Next` message).
- Browser-rendered implementation: `/private/tmp/renderpop-dance-video-dialog-no-photo.png`.
- State: English, no photo selected, custom-video dialog open. The source and implementation were opened together in the same QA comparison input; that comparison confirms the no-photo branch retains the prior, correct guidance.

**Findings**

No actionable P0, P1, or P2 differences remain.

- Copy and interaction: the dialog is state-aware. With no photo, it keeps `Next: add one clear photo…`; with a ready photo, it replaces that copy with a green `Photo ready` status and `Your photo will be placed in this video.` The secondary action also becomes `Use your own motion video` when a photo is ready.
- Fonts, spacing, colors, and assets: the ready-photo branch reuses the existing green confirmation treatment already used by the photo card, while retaining the dialog surface, type scale, spacing, icon family, and real media background.
- Accessibility: the state change is represented as visible text rather than color alone; the existing dialog and uploader controls retain their accessible names.

**Verification limits**

- I did not upload a real image solely to force the ready-photo state, because that would transmit test media and create an asset in the user's account. The conditional branch is type-checked and production-built; the untouched no-photo branch was browser-tested with no console errors.

**Primary Interactions Tested**

- The no-photo `Or use your own video` control uniquely opens the dialog and keeps the `Next` guidance.
- The component maps an existing `photo` state to the green ready-photo message and updated secondary-action label, then preserves the existing upload-to-generate path.
- Component lint, TypeScript, `git diff --check`, and the production build passed.

final result: passed

### Iteration 8 — completed custom-source state and lower controls

- Source visual truth: `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-d7ca4358-7865-46fd-a0d3-cdfb9c0ae9da.png` (desktop custom motion video with a photo already ready) and `/var/folders/vx/gcrlvvbx7_1_shz3qrlw85xc0000gn/T/codex-clipboard-c708573b-053b-48ed-af77-9475e5860ff9.png` (the intended lower-third control placement).
- Browser-rendered implementation: `/private/tmp/renderpop-dance-desktop-after-state-refinement.png` at the default desktop viewport, and `/private/tmp/renderpop-dance-mobile-after-state-refinement.png` at `390 × 844` CSS pixels.
- State: English dance landing page; the browser evidence verifies the unchanged template path and the mobile breakpoint. The custom-video + photo-ready state was already captured in the user-provided desktop screenshot before this iteration; no additional media was uploaded to recreate it for a test-only capture.

**Findings**

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: the completed state replaces the stale instruction with `Your motion video and photo are ready to generate.` The dynamic video-row status is a compact green check plus `Motion ready`, visually matching the existing `Photo ready` status without competing with the generation CTA.
- Spacing and layout rhythm: for a custom video only, playback and audio controls move from the mid/lower region to `4.5rem` above the player edge. This protects the face and upper-body framing while retaining a reliable margin above the fade. Template controls retain their prior rail-safe position.
- Colors and visual tokens: the complete state uses the existing emerald success palette for both ready inputs; the purple-to-coral generation action remains the sole high-emphasis next action.
- Image quality and asset fidelity: no visual media asset or crop behavior changed. The desktop player continues to preserve real video framing with `object-contain`; the mobile stage and template rail are untouched.
- Copy and content: `Next: add a photo` appears only when the photo input is absent. Once both source video and photo exist, the console explicitly confirms both inputs and leads directly to `Generate video · 120 credits`.
- Accessibility and interaction: the controls keep their existing unique pause/play and mute/unmute labels. The success state contains both a check icon and visible status wording, so it does not rely on color alone.

**Focused Region Evidence**

- The custom-source completion panel and the lower-player-control crop were compared against the user-provided desktop references. The responsive browser captures confirmed that the shared desktop template surface and the explicitly protected mobile surface remain visually stable.

**Verification limits**

- I did not upload a photo and custom video solely to reproduce the combined-ready state: that would transmit test media and create account assets. The already-rendered user screenshot establishes the source state; the conditional copy and classes were validated by lint, TypeScript, and production build, with the no-upload template and mobile views browser-checked after the change.

**Primary Interactions Tested**

- The desktop template route retains its stage controls, selected rail, and `Use this dance` conversion path.
- At `390 × 844`, the mobile stage, template rail, compact CTA, and playback controls retain the accepted layout.
- Browser console: no errors or warnings after desktop and mobile renders.
- Component lint, TypeScript, `git diff --check`, and the production build passed.

final result: passed
