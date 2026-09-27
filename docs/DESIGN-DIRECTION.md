# Design direction for the rebuild (final)

This is the source of truth for the UI rebuild. It combines:

- **Base**: direction A, "Golden Hour". Its full spec is `docs/design/golden-hour-spec.md` and its prototype source is `docs/design/proto/`:
  - `lib/topo.mjs`: Tanaka-lit contour renderer.
  - `lib/art.mjs`: botanical leaf/specimen generator.
  - `styles.css`: tokens and components.
  - `build.mjs`: screen markup.

  Contact sheets for all three directions are in `docs/design/shots/{a,b,c}-{light,dark}.webp`. Full-resolution frames (390×844 @2x) are at `/tmp/claude-0/-home-user-Fall-Trip/d2f1237e-ef4a-5ce9-95b8-ee6f79055070/scratchpad/proto-{a,b,c}/shots/<screen>-<light|dark>.png`, where screen is `today-before`, `today-during`, `plan-sat`, `kids-hunt` or `devotion-sat`. The generated prototype HTML is at `.../proto-a/index.html`; open `index.html#frame=<screen>-<mode>`.
- **Grafts** from B ("Sierra Morning", `docs/design/b/`) and C ("Editorial Bold", `docs/design/c/`), chosen by two independent judges and the lead.
- **Must-fixes** found in judging.

Where this file and the Golden Hour spec disagree, **this file wins**.

## 0. Principles

1. **Light carries meaning.** Amber and ember (and glow) mark only what is live, found, golden-hour, the route, or a deadline. Ordinary interactive elements (links, secondary buttons, the tab lens, segmented thumbs) use a neutral ink/fill treatment, never amber.
2. **Plain, useful copy.** No lyrical or themed phrasing ("Into the gold" is gone; day titles are now plain in `src/content/trip.js`). No journal, parchment, stamp, tape, or "field notes" motifs. One italic word inside a serif title is allowed only where it carries meaning (the countdown's "days"), not as a habit.
3. **It is an app first.** One-handed iPhone use in bright sun, iPad for kids in the car, frequently offline. Every practical answer (next step, leave-by time, gas warning, Maps) is at most one tap away.
4. **Craft bar**: Framer, motion.dev, Linear, Apple Weather and Journal, Vaul and Sonner. Precise type, rhythmic spacing, physical springs, shared-element and layout transitions, and interruptible gestures.

## 1. Theme and color

- **Themes**:
  - The theme **follows the device** by default, with an Automatic / Light / Dark override in Settings. The light theme is the sunrise version, which is the daytime primary for bright sun.
  - "Dark-first" is art direction only, not the default.
  - **Night vision** is a real feature: a third, red-shifted palette (`data-theme="night"`). It is offered with one tap after "Dark" on the trip evenings: on Today, and on the Night sky screen. It is also available in Settings. Text is `#D8563A` at three alpha steps on `#050202`, accents are `#8F2A18`, art and topography are red-shifted and dimmed, and there is no glow.
- **Dark palette uses night discipline** (from B):
  - Primary ink is capped at about `#E2DACD`, not the prototype's `#F8EFE6`.
  - Accents are slightly desaturated. Art and topography show at brightness(.86), and map fills sit at about 60%.
  - The countdown and Now glows are reduced. They turn off entirely after that day's "Dark" time.
  - The filled amber Maps pill becomes a tonal fill at night.
- **Light palette**:
  - Increase card-to-page separation (cards clearly lift off the page in direct sun) and reduce the ambient peach sky tint so the page isn't uniformly peach.
  - Re-verify `--accent-mark` (≥3:1) on the tinted sky area as well as on `--bg`.
- **Kid colors**: amber, ember, and **moss green**. Violet is not a kid color, because indigo/violet means night and devotion.
  - Re-measure every kid chip in every theme.
  - Numerals on kid avatars must pass AA (≥4.5:1 at small sizes).
- **Theme color**:
  - `<meta name="theme-color">` and `src/lib/theme.ts` `THEME_COLOR` must equal the final `--bg` of each theme.
  - The manifest `background_color` and `theme_color` must equal light `--bg`.

## 2. Type

Use Newsreader (variable, opsz) for display and reading, including Scripture with verse numbers. Use Inter (variable, `cv05`, tabular numerals) for all UI, times and numbers. Self-host both via `@fontsource-variable/*`, Latin subset only. Andika stays for the kids' large-print mode if a screen uses it.

Practical numbers (times, counts, sun times) are always tabular Inter. The only exception is the hero countdown number, which may be Newsreader.

## 3. Layout and components (grafts + fixes)

- **Tab bar**:
  - A floating glass capsule with a **scrim** under it: a 100–120 pt gradient from `--bg` to transparent. No content is ever readable through the tab labels.
  - Scroll content gets bottom padding equal to the tab bar height plus `env(safe-area-inset-bottom)` plus 16.
  - The lens is neutral (fill-2), with a filled icon for the active tab.
  - `backdrop-filter` is allowed only on the tab bar and the collapsed nav bar.
- **Home, before the trip**:
  - A **bento grid** (C's structure, A's tokens: cards and light, with no full-bleed color fields). Every destination is visible without horizontal scrolling: Plan, Activities, Leaf hunt, Devotions, Color report, Packing, Before you go (plus Night sky if it fits).
  - Tiles carry real data:
    - Plan lists the Fri/Sat/Sun titles.
    - Color report shows a fall-spectrum bar with a marker ("Conway near peak", from content).
    - Leaf hunt shows total found.
    - Before you go shows the count of unchecked items.
  - Optional: B's "Today → Oct 9–11" day strip under the countdown.
- **Home, during the trip**:
  - A Now card with:
    - B's ember **"Leave by HH:MM"** chip beside the title. The time is computed as the next item's start minus its drive time.
    - A progress bar with C's "15 min in" and "1 hr 15 left" end labels.
    - A **labeled Maps button** using C's road-sign diamond glyph (no unlabeled circles).
    - A "Devotion here" row.
    - C's inline **NEXT** row.
    - B's **map strip**: an eastside crop around the current place with a dashed ember next leg.
  - B's weather and roads card: "63° / 31° · Tioga Rd open. 10-min delays at Tuolumne.", taken from `conditions.js` and `trip.js`.
  - An "Offline · all saved" chip (crossed-out Wi-Fi icon) whenever `navigator.onLine` is false.
  - A's sun arc.
  - C's **continuous morph**: the countdown hero keeps its `layoutId` and re-lays out into the first Now card at departure.
- **Route story** (Home, before the trip):
  - Keep A's lit terrain, but **calmer relief in light mode**. Cut the Tanaka offset and sliver opacity by about half, and lean on the hypsometric fill and hairline index contours, so it reads as terrain and not parchment or wallpaper.
  - In dark mode, lower the lit-sliver intensity and feather the relief under label halos.
  - Draw **Mono Lake as water**: the band between the 1,900 m and 1,960 m surfaces. Register `eastside.json` onto `route.json` with an affine transform (B's approach) wherever detail is needed.
  - **Label collision avoidance**: drop minor stops at overview zoom, use leader lines, and never let a label sit on the route line (the Olmsted and Tenaya labels collided in the prototype).
  - C's **elevation-profile strip** runs along the bottom of the story (sea level to 9,945 ft) and tracks the route head.
  - Chapter copy is plain facts, not lyrical.
  - Performance:
    - Pre-render the relief per theme to WebP at build time (`scripts/relief.mjs`), or cache it to canvas once. Do not re-rasterize huge SVGs on scroll.
    - Keep the route, stops and labels as live SVG/HTML.
    - The "terrain rises" effect can use a moving mask.
    - It must hold 60 fps on a mid iPad; profile with CPU throttling.
- **Plan timeline**:
  - The time column holds **only the clock time**.
  - **Drive legs** are their own rows in the content column ("10 min drive", with a car glyph on the rail), from B.
  - Stay length goes in the meta line ("Stay 20 min").
  - B's **now-line** is an ember line with a live "9:30" bubble, moving each minute.
  - Past items fold into "2 earlier".
  - The current item is an E2 card with its title in serif (C). Other rows stay in Inter.
  - Every place row has a Maps action.
  - **Choice items** get a "Choose one" tag and a persisted radio selection (key `choice:<itemTime>`). The "Choose:" prefix is removed from the displayed title.
  - Everything respects the 16/20 gutter; nothing sits within 16 px of the screen edge.
  - The per-day topo thumbnail in the header (C) is optional.
- **Devotion**:
  - One scrolling page shows all five sections (Look, Read, Wonder, Pray, Do), numbered 01–05 as in C, so a family reading together sees everything.
  - A **bottom-docked stepper** (B) uses the strong material. It tracks the section in view (scroll-spy), jumps to a section on tap, and has a Next arrow within thumb reach.
  - Whose-turn chips use the kid colors, with a rotate button.
  - ESV/NIV lives inside the passage card. C's **word-diff morph** is optional: shared words hold and differing words dissolve, with a cross-fade under reduced motion.
  - The publisher notice sits directly under the passage.
  - B's place-contour watermark behind the title is optional.
- **Leaf hunt**:
  - A's botanical outline art with per-kid colors.
  - C's **found flood**: the warm fill floods the tile from the tap point with a clip-path circle, plus A's bounce, check badge and silhouette particles.
  - B's **progress rings** on the kid switcher, each in that kid's color.
  - Leaf pips fill **in order**.
  - "Biggest leaf" is drawn oversized and bleeds off its tile (C).
  - Hunt tiles are `<button data-hunt-item="<id>" aria-pressed>`. The offline test depends on this.
- **Segmented controls**: a layoutId thumb, and labels change color at the midpoint (B). Every segment has a 44 pt hit area.
- **Motion tokens**: use B's named springs (snap, glide, indicator, sheet, pop, camera) inside A's two families (*settle* = no bounce, for navigation and layout; *alive* = small bounce, only for moments of delight). Also:
  - A check-off reflows after 600 ms.
  - Presses have a 60 ms delay against scroll flicker (C).
  - The countdown digit roll has a 1.5 px motion blur (C).
  - `<MotionConfig reducedMotion="user">` wraps everything. Every effect has a reduced-motion fallback (opacity or instant).
- **Grain**: bake it into the page background layer (a small tiled image or CSS background). No full-screen blended overlay.

## 4. Non-negotiables (from the brief)

- **Privacy**: no names, home city, addresses, confirmation numbers or phone numbers of the family anywhere. Kid names come from Settings (localStorage); defaults are "Kid 1/2/3". Keep noindex and robots.
- **Offline**: every route, font, image and data file is precached. No runtime third-party requests. `npm run build && npm run test:offline` must print PASS.
- **Accessibility**:
  - WCAG AA in light, dark and night.
  - 44 pt targets, visible focus rings, landmarks, one `<main>` with exactly one `<h1>` per screen, `aria-current` on the tab, `aria-pressed` on toggles, and labels on every control.
  - Dynamic Type: rem sizes, and the root respects `-apple-system-body`.
- **iOS**:
  - Safe areas everywhere, standalone status bar matching the theme, no double-tap zoom, and `touch-action: manipulation`.
  - Edge-swipe back must not fight Safari's own gesture in the browser; only enable the custom edge-swipe in standalone mode.
- **Storage compatibility**: keep the existing keys.
  - Settings: `kids`, `parents`, `lodging`, `theme`, `sound`, `translation`, `debugNow`.
  - Checklists: `hunt:0`, `hunt:1`, `hunt:2`, `huntKid`, `pack`, `maybes`, `photos`, `sky`, `tracks`.
  - Devotions and journal: `done:<devotionId>`, `turn:<devotionId>`, `mv:<ESV|NIV>`, `journal:<day>:<i>`, `journalDay`, `kidReader`.
  - Activities: `exploreFilter`.
  - Use `src/lib/store.ts` (`useStored`, `useChecklist`).

## 5. Architecture and file ownership

- Vite + React 19 + TypeScript + `motion` (`motion/react`) + Tailwind v4 (utilities mapped to the CSS-variable tokens) + `vite-plugin-pwa`. Hash routing with `wouter` (`useHashLocation`). Icons: `@phosphor-icons/react`. Sheets: `vaul` is allowed.
- `src/lib/*` holds platform helpers: store, time, theme, family, links, feedback, pwa. **Shared**.
- `src/ui/*` holds the design system: tokens, motion, primitives, shell, icons. **Owned by the foundation.**
- `src/art/*` holds shared imagery: `Terrain` (lit topography plus projection helpers for both maps), leaves and specimens, glyphs. **Owned by the foundation.**
- `src/screens/<area>/*` holds screens. **Each area is owned by exactly one screen builder.** Screens must not edit `src/ui`, `src/art` or `src/lib`. If a shared change is truly needed, build a local component inside your area and report the request.
- `src/app/routes.tsx` maps every hash route to a lazily loaded screen component in `src/screens/...`. **Owned by the foundation**, which creates every screen file up front as a placeholder so screen builders only edit their own files.
- `src/content/*.js` holds content data. Screens may read it. Edits are allowed only to fix a factual bug or to remove themed copy; list any edits in your report.
