# Fall Trip, Direction C: Editorial Bold

The idea: a magazine cover you can use with one thumb. Big confident type (a condensed serif set very large, with an italic accent), and a working grotesk for everything you tap or scan. Fall shows up as four color fields (rust, ochre, olive, plum) on bone paper. Each field has one job, so color doubles as navigation. The pictures are real: contour lines traced from the drive's actual terrain, and leaf specimens drawn in crisp vector.

Prototype: `index.html` (built by `build.mjs` from the app's real content modules; `art.mjs` generates the leaf specimens), `styles.css`, screenshots in `shots/`, contrast measured by `contrast.mjs`.

---

## 1. Color

### Semantic fields: one hue per job
| Field | Job | Where it appears |
|---|---|---|
| **Rust** | Time: now, countdown, the route | Home hero, the Now card, now-line, anchors, accent text |
| **Ochre** | Kids | Leaf hunt tile, active kid, found tiles, golden-hour arc, festival option |
| **Olive** | Places and the plan | Plan tile, the plan's map inset |
| **Plum** | Faith | Devotions tile, devotion header, "Saturday devotion" buttons |
| **Bone** | Everything else | Paper, cards, chips |

A screen gets **at most one full-bleed field**. Everything else sits on bone. That limit is why the color reads as bold rather than loud.

### Tokens
| Token | Light | Dark | Notes |
|---|---|---|---|
| `--bg` | `#F3ECDF` bone | `#120E0B` warm black | Page |
| `--bg-2` | `#E9E0CE` | `#1D1713` | Chips, segmented track, idle kid tabs |
| `--paper` | `#FBF8F2` | `#211A15` | Raised cards, unfound hunt tiles |
| `--ink` | `#1F1712` | `#EFE4D2` | Never pure black or pure white |
| `--ink-2` | `#4F4237` | `#C3B4A0` | Notes, secondary |
| `--ink-3` | `#6F6052` | `#9A8B78` | Kickers, meta |
| `--hair` / `--hair-2` | ink @ 12% / 20% | bone @ 10% / 18% | 1px rules and inset borders |
| `--accent` | `#9E3A17` | `#EE9166` | Rust as text on bone (links, "now", italics) |
| `--rust` / `--on-rust` | `#9F3A18` / `#FFF1E6` | `#5E2310` / `#FFE3D2` | |
| `--ochre` / `--on-ochre` | `#E2A73C` / `#2B1A08` | `#4B3510` / `#F7D796` | Ochre flips to dark text in light mode |
| `--olive` / `--on-olive` | `#4E5527` / `#F2EFCF` | `#262A13` / `#E0E0AE` | |
| `--plum` / `--on-plum` | `#4B2139` / `#F8E5EE` | `#2E1422` / `#F1D3E1` | |
| `--on-*-2` | on-color @ 76–84% | @ 70–74% | Secondary text on a field (a token, never an `opacity:` hack) |
| `--found-bg` | `#F3DFB4` | `#33260F` | Found hunt tile |
| `--water` | `#6D959A` | `#3F5C60` | Mono Lake, drawn from the 1,960 m contour |
| `--tab-bg` | paper @ 72% + blur | paper @ 70% + blur | Floating tab bar |
| `--tab-on-bg` / `-fg` | ink / bone | `#3A2C22` / `#F7D796` | Active tab and segment pill; no bright pill at night |

Dark mode is built for night use, not made by inverting light mode. Fields drop to 25–35% lightness. The brightest pixel on any dark screen is `#FFE3D2`. Accents turn warm (`#EE9166`, `#F7D796`), never blue-white. Grain drops from 9% to 6%.

### Measured contrast (WCAG 2.x, alpha composited onto the actual surface)
From `node contrast.mjs`. Every text pair clears 4.5:1 in both modes.

| Pair | Use | Light | Dark |
|---|---|---|---|
| `--ink` on `--bg` | Body text | 15.03 | 15.27 |
| `--ink-2` on `--bg` | Secondary text | 8.25 | 9.47 |
| `--ink-3` on `--bg` | Tertiary / kicker | 5.15 | 5.80 |
| `--ink-3` on `--paper` | Tertiary on card | 5.71 | 5.18 |
| `--ink-3` on `--bg-2` | Tertiary on chip | 4.62 | 5.35 |
| `--ink-2` on `--found-bg` | Label on found tile | 7.40 | 7.27 |
| `--accent` on `--bg` | Accent text / links | 5.82 | 8.12 |
| `--accent` on `--paper` | Accent on card | 6.45 | 7.26 |
| `--on-rust` on `--rust` | Text on rust field | 6.14 | 9.96 |
| `--on-rust-2` on `--rust` | Secondary on rust | 4.81 | 6.17 |
| `--on-rust` (92%) on smoky glass over rust | Hero glass bar | 6.81 | 10.64 |
| `--on-ochre` on `--ochre` | Text on ochre | 7.84 | 8.32 |
| `--on-ochre-2` on `--ochre` | Secondary on ochre | 5.23 | 5.36 |
| `--on-olive` on `--olive` | Text on olive | 6.79 | 10.85 |
| `--on-olive-2` on `--olive` | Secondary on olive | 4.73 | 6.10 |
| `--on-plum` on `--plum` | Text on plum | 11.06 | 12.22 |
| `--on-plum-2` on `--plum` | Secondary on plum | 7.05 | 6.90 |
| `--tab-on-fg` on `--tab-on-bg` | Active tab / segment | 15.45 | 9.67 |
| `--ink-2` on `--tab-bg` | Inactive tab label | 8.89 | 8.80 |
| `--rust` on `--on-rust` | Bone button on rust | 6.14 | 9.96 |

Text over the map was also checked against the rendered pixels. In the hero screenshots, the 95th-percentile *lightest* background pixel, contour lines included, gives bone text 4.88:1 (light) and 6.78:1 (dark) beside the countdown, and 5.2–5.4 (light) / 7.2–7.4 (dark) under the stop labels, which also carry a dark halo. The hero's smoky glass was switched from a lightening tint, which failed at 4.29, to a darkening one, now 6.81.

---

## 2. Type

**Two families, both OFL, self-hosted:**
- **Instrument Serif** (roman + italic) for display only, 22 px and up. It is condensed, so very large sizes still fit a 390 px screen: a 170 px countdown takes about 160 px of width. The italic marks the one word that matters: *gold*, *hunt*, *its kind*, *hour*.
- **Bricolage Grotesque** (variable: `opsz` 12–96, `wdth` 75–100, `wght` 200–800) for all UI. `font-optical-sizing: auto` opens up the small sizes for sunlight and tightens the large ones. It has real `tnum`, which is on globally so times line up in columns.

| Role | Family | Size / line-height | Weight | Tracking | Example |
|---|---|---|---|---|---|
| Mega | Serif | 170 / 0.72 | 400 | −0.05em | Countdown "12" |
| Display 1 | Serif | 58–60 / 0.9 | 400 | −0.028em | "Into the *gold*", "Saturday", "Leaf *hunt*" |
| Display 2 | Serif | 42–44 / 0.95 | 400 | −0.02em | Now title, devotion title |
| Display 3 | Serif | 25–27 / 1.0 | 400 | −0.012em | Current timeline item, choice title, tile titles |
| Scripture | Serif | 20.5 / 1.27 | 400 | −0.003em | Passage (with `text-wrap: pretty`) |
| Numeral-serif | Serif | 23 / 0.9 | 400 | −0.01em | Sun times |
| Title | Sans | 16–16.5 / 1.25 | 640–660 | −0.01em | Timeline titles, next-up |
| Body | Sans | 16 / 1.45 | 440 | 0 | Devotion steps |
| Callout | Sans | 14–15 / 1.4 | 440–460 | 0 | Notes |
| Time | Sans | 15.5–19 / 1 | 680–700, `tnum` | −0.01em | "11:00" + am at 0.62em, 650 |
| Footnote | Sans | 12.5–13 / 1.3 | 500–580 | 0 | Meta, tile subs |
| Kicker | Sans | 11.5 / 1.1 caps | 700 | +0.1em | "NOW", "LEAVING IN", "02 READ" |
| Tab label | Sans | 10.5 / 1 | 640 | +0.005em | Tab bar |
| Legal | Sans | 11.5 / 1.4 | 480 | 0 | Scripture notice (the smallest text anywhere) |

Build note: sizes are rem-based and scale with the user's text size (Dynamic Type through `-apple-system-body`). Display sizes use `clamp()` so a larger text size grows body text faster than headlines. The "Aa" button on devotions switches Body to 19/1.5 and Scripture to 24/1.3 for kids reading aloud.

---

## 3. Space, shape, elevation

- **Spacing:** 4 pt base. 4 · 8 · 12 · 16 · 20 · 24 · 32. Fields and bento tiles sit on a **12 px gutter** so the blocks feel edge to edge. Running text sits at **16–20 px**. Bento gap is 8; the gap between sections is 18–24.
- **Radius:** 12 small controls · 16 choice options · 18 segments and kid tabs · 22 hunt tiles and glass bar · 24 bento tiles · 30 hero and Now fields · 32 tab capsule (half its height). Use `corner-shape: squircle` where supported for continuous corners. Nested radii follow the rule outer = inner + padding.
- **Safe areas:** status bar 47 pt; the floating tab bar sits `env(safe-area-inset-bottom) − 13px` from the bottom edge (21 pt on a 34 pt home-indicator device). Scroll content pads the bottom by 120 pt. A 104 pt scrim, bone to transparent, fades content under the bar so labels never sit on top of text.
- **Elevation:**
  | Level | Use | Treatment |
  |---|---|---|
  | e0 | Color fields | Flat. No shadow. The color itself is the depth. |
  | e1 | Bone tiles, unfound hunt tiles | 1 px inset hairline, no shadow |
  | e2 | The current timeline item | `0 12px 28px -18px rgba(60,30,10,.45)` + hairline |
  | e3 | Floating tab bar | Blur 22 px, saturate 1.7, 1 px hairline, `0 12px 32px -12px rgba(60,30,10,.38)`, top inner highlight |
  | e4 | Sheets | `0 -8px 40px rgba(0,0,0,.25)`; the page behind scales to 0.94 with a 12 px radius |

---

## 4. Materials

- **Fields:** flat color plus **grain**: SVG `feTurbulence` fractal noise (0.85 frequency, 3 octaves), overlay blend, 9% light / 6% dark. It gives the fields a printed, riso-like feel without faking paper.
- **Glass:** used in two places. (1) The tab bar: bone at 72% with background blur. (2) The hero's bottom bar: smoky glass (`rgba(60,12,0,.24)` + blur 14) so bone text keeps 6.8:1 over the map. Glass always has a 1 px inner highlight at 16–18% so its edge reads in sunlight.
- **Light:** one soft-light radial "sun" in the hero's lower right (warm, 28%). The light-aware theme (section 9) moves it.
- **No:** paper textures, torn edges, tape, stamps, handwriting fonts, or drop shadows under text. A soft glow sits only under the countdown numeral, to separate it from the contours.

---

## 5. Iconography

Custom 24 px icons with 1.7–1.8 px strokes, round caps and joins, sized to match Bricolage's weight at 15 px. Rendered sizes: 14 / 17 / 20 / 23 / 30.
- Tabs: **Today** (sun on a horizon), **Plan** (timed list), **Activities** (compass), **Kids** (aspen leaf with a midrib), **Devotions** (open book).
- **Maps** uses the Apple Maps road-sign diamond with a turn arrow, so it reads as "directions" at a glance. It appears as an icon button (44 pt target) on timeline rows and as a labeled pill on the current item.
- Status icons stay outlined. Active state comes from the pill behind the icon, not from filling it. Icons live in one `icons.tsx` file; any extras come from Phosphor Regular at the same weight.

---

## 6. Imagery

**Real topography** (`route.json`, `eastside.json`). It is defined once as SVG `<symbol>`s and placed with `<use>`. Styling comes entirely from inherited custom properties (`--tf`, `--tfo`, `--ts`, `--tso`, `--tsiw`), so one dataset serves every context and both themes.
- **Hypsometric tonal steps:** each 150 m band adds about 3.6% of a darker field tone, so the Sierra crest shows up as depth without a legend. Contours are bone at 16%. Index contours (every 750 m route / 300 m eastside) are 34% and 0.9 px. `vector-effect: non-scaling-stroke` keeps hairlines at hairline width at any zoom.
- **Route:** a Catmull-Rom spline through the real stop coordinates. Bone line 2.6 px over a 6.5 px dark casing. The destination has a ring. Labels are set in Bricolage 12.5/680 with a paint-order halo, placed on the side away from the numerals.
- **Water:** Mono Lake is the complement of the 1,960 m contour, filled `--water`. It shows up on the plan inset.
- **Now card:** eastside at 3× around Lundy Canyon, masked with a 100° gradient so the text sits on clean rust and the terrain fades in behind the "you are here" pulse.
- **Production:** simplify paths per zoom level at build time (Douglas–Peucker), precache both JSONs, and lazy-parse `eastside.json`.

**Leaf specimens** (`art.mjs`): 14 procedural SVGs, not paintings.
- Leaves come from an egg-curve outline (half width, half length, egg factor, acuminate tip pull, cordate notch). Margins get teeth: crenate for aspen and cottonwood, serrate for willow, doubly serrate for water birch. Veins are pinnate secondaries, plus basal veins on cordate shapes. The maple (*Acer glabrum*) is a polygon union of five toothed lobes with palmate veins.
- Other items (cone, granite, dam with a chewed stump, tufa, aspen eyes, deer track, obsidian) are drawn with the same stroke language.
- **Two states from one symbol:** unfound is a line drawing in `currentColor`, which is the reference picture a 6-year-old matches against. Found sets `--f1/--l1/--d1` per item and the drawing becomes flat autumn color (aspen `#E6AE2C`, red maple `#B9322A`, and so on). No second asset is needed.
- The "Biggest leaf" is drawn deliberately oversized and bleeds off its tile.

**Light:** golden hour, sunset, and dark come from `trip.js` and drive the sun-arc tile and the theme (section 9).

---

## 7. Layout patterns

- **Bento (Home):** a 4-column grid with 86 / 86 / 84 / 56 rows. Plan takes 2×2 in olive. Leaf hunt (ochre) and Devotions (plum) take 2×1. Color report and Activities are bone 2×1. Packing and Before you go are slim 2×1 rows. All 7 entry points are visible above the tab bar at 390×844.
- **Timeline (Plan):** 58 pt time column (right-aligned `tnum`, drive time under it), 20 pt rail, then content. Anchors (fixed times) get a filled rust node; flexible items get a hollow one; the choice gets ochre. Past items fold into one "Show 2" row. The current item is raised to e2 and set in serif. A rust **now-line** carries the live time. Maps is a 44 pt icon on every row that has a place.
- **Choice rows:** two side-by-side options (ochre field vs bone) with an italic "or" coin between them. The copy comes straight from `trip.js`.
- **Hunt grid:** 3 columns at 142 pt with 8 pt gaps. Kid tabs are 58 pt tall. The tally pairs a 72 pt serif numeral with 11 leaf-shaped pips that fill left to right.

---

## 8. Motion language

Built on `motion/react` v12 with `<MotionConfig reducedMotion="user">`. Springs are named so they are reused, not tuned one screen at a time. Values are listed as physical (stiffness / damping / mass) and as their approximate `visualDuration` / `bounce` equivalents.

| Name | Spring | ≈ | Used for |
|---|---|---|---|
| `snap` | 700 / 45 / 1 | 0.20 s, bounce 0 | Press release, segment pills, toggles |
| `glide` | 500 / 38 / 0.9 | 0.28 s, bounce 0.08 | Tab pill (layoutId), kid tabs, chips |
| `settle` | 420 / 42 / 1 | 0.36 s, bounce 0 (ζ≈1.02) | Page push/pop, list reflow |
| `morph` | 360 / 34 / 1 | 0.42 s, bounce 0.05 | Card→detail shared elements |
| `sheet` | 400 / 40 / 1 | 0.38 s, bounce 0 | Bottom sheets |
| `pop` | 600 / 18 / 0.8 | 0.34 s, bounce 0.35 | Found badge, check marks |
| `bloom` | 520 / 14 / 0.8 | 0.5 s, bounce 0.45 | Found leaf scale-up |
| `roll` | 260 / 28 / 1 | 0.45 s, bounce 0.05 | Countdown and tally digits |

| Interaction | Behavior | Reduced motion |
|---|---|---|
| **Page push / pop** | Incoming page `x: 100% → 0` (`settle`). Outgoing page `x: 0 → −28%` with a 12% black dim. The large title shares `layoutId="page-title"` with the inline nav title (scale-corrected), so "Leaf *hunt*" shrinks into the bar as you scroll or push. Edge-swipe back is interactive and hands its release velocity to the spring. | 160 ms opacity crossfade; titles swap in place |
| **Tab switch** | Active pill uses `layoutId="tab-pill"` (`glide`); the label color crossfades over 120 ms. Content: outgoing `opacity → 0` over 90 ms; incoming `opacity 0→1, y 6→0` (`snap`). Each tab keeps its own scroll position. | Pill jumps (layout `duration: 0`); content cut plus a 120 ms fade |
| **Card → detail** | Devotion tile to devotion page: the plum field shares `layoutId="field-dev-sat"` and radius animates 24 → 30 (bottom corners only). The title shares `layoutId` and morphs 25 → 42 px (via `layout="position"` + `scale`). The whose-turn chips and steps stagger in after 120 ms. The Now card works the same way into its plan item, and the hero map into the route story. | 200 ms crossfade; no geometry change |
| **Bottom sheet** (Vaul) | Opens with `sheet`. Drag has 0.35 rubber-band past the top. Dismisses when velocity > 500 px/s or offset > 35% of its height. Backdrop opacity follows progress 0 → 0.4. The page behind scales to 0.94 with a 12 px radius (iOS card stack). | Fade in/out 180 ms; no scale |
| **Check-off** (packing, before-you-go) | Press scales to 0.92. The tick draws with `pathLength 0 → 1` over 220 ms `[0.65,0,0.35,1]`, the box fills over 120 ms, and a strike line wipes the label left to right (`scaleX`, 240 ms). After 600 ms the row moves to "Done" through a layout animation (`settle`). | Instant tick + color, no wipe; the row moves without animating |
| **Hunt: found** | See signature moment 2. | Tile color crossfades over 150 ms; badge appears; the numeral swaps |
| **Countdown digits** | Each digit sits in its own clip mask. The old digit moves `y 0 → −100%` while the new one comes up from `+100%` (`roll`), with a 1.5 px motion blur at peak velocity. Minutes tick live; the serif "12" changes once a day. Nothing moves on first paint. | 120 ms crossfade per digit |
| **Route-story scroll** | See signature moment 1. `useScroll` on the chapter container; each chapter card snaps (`scroll-snap-align: center`). | Static crop per chapter; that chapter's route segment fades in (no drawing, no camera moves, no parallax) |
| **List stagger** | Children `opacity 0→1, y 10→0` with `settle`, 30 ms apart, capped at 8 items (240 ms). Runs only on first entry to a route, never on back-navigation. | None; the content is simply there |
| **Press states** | Tiles scale to 0.97, icon buttons to 0.94, on pointer-down (`snap`). Release uses 500/22 for a hint of overshoot. Bone surfaces also get a 6% ink overlay; fields get 8% black. Nothing moves on hover-less touch until the press lasts 60 ms (no flicker while scrolling). | Overlay only, no scale |
| **ESV ⇄ NIV** | See signature moment 3. | Whole-passage crossfade over 150 ms |
| **Now progress / sun arc** | The bar width and the sun dot move with the clock (1-minute ticks, `settle`). The live dot "breathes" (scale 1 → 1.35, opacity 0.22 → 0, 2.4 s loop) on the Now kicker only. | Static; updates in place |

---

## 9. Five signature moments

1. **The Sierra rises.** Tap *Route* on the home hero. The rust card expands through `layoutId="route-hero"` into a full-bleed sticky stage, and the viewBox animates out to the whole drive: Bay shoreline at the bottom, crest at the top. As you scroll the eight chapters, the route draws itself along its real spline: `pathLength` is mapped per chapter to the actual arc length between stops. The camera eases from stop to stop, zooming to 2.4× at Tioga. The contour layers reveal by elevation as the route climbs (layer opacity = `clamp((routeElevation − level) / 300)`), so the mountains literally rise out of the page before Tioga Pass. At Lee Vining the map crossfades to the 60 m `eastside.json` detail and Mono Lake fills with water. A small elevation-profile strip along the bottom tracks your position (sea level to 9,945 ft).
2. **Found.** A kid taps the line drawing of a willow leaf. Its tile floods with `--found-bg` from the tap point (`clip-path: circle()` over 420 ms). The drawing fills with its real autumn color and scales 1 → 1.12 → 1 (`bloom`). The check badge pops (`pop`, 80 ms delay). Six tiny copies of *that same leaf* spin out on gravity arcs for 600 ms. The tally numeral rolls 6 → 7 and the next pip fills. When a kid finds all 11, leaves fall across the whole screen for 2.4 s, gentle and not confetti, and that kid's tab gets a gold leaf mark.
3. **Translation morph.** Toggling ESV ⇄ NIV runs a word-level diff (LCS). Words both translations share stay put and reflow with layout animation; only the differing words dissolve (a 4 px blur plus opacity). You can *see* where the translations differ. The reference line and the copyright notice swap to the right publisher's wording at the same moment.
4. **Light-aware app.** The day's sun times drive the theme. At golden hour (5:50 on Saturday) the fields get a warm soft-light wash, the sun dot on the arc glows, and the Now card's radial light moves lower. After *dark* (7:52) on New Moon night, the "New Moon stargazing" item offers **Night red**: a red-only dark palette (`#1A0000` bg, `#E0503A` text at 5.1:1, no color above 0.22 relative luminance) that protects dark-adapted eyes. It is one tap in and one tap out.
5. **The countdown becomes Now.** On Friday at noon the hero's digits roll to 0. The rust card keeps its `layoutId` and re-lays out into the first **Now** card ("Leave home · ~2 hr to Oakdale"). The route on its map lights its first segment. Before-trip Home becomes during-trip Home in one continuous motion, with no reload and no new screen.

---

## 10. Copy rules

Plain and useful, no theme voice. Kickers are nouns ("Now", "Next", "Light", "Choose one"). Sentences are short instructions ("Leave Friday at noon", "Pour the cocoa. Stay 20 min"). Every fact comes from `src/js/content/*.js`. Placeholder kid names are "Kid 1–3"; real names are entered in Settings and stored in localStorage only. Offline status is stated plainly ("Offline · all saved").
