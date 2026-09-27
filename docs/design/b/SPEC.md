# Sierra Morning: design system spec

Direction: light-first, Apple-native precision. The canvas is warm white, titles are large, content sits in grouped inset cards, and sheets rise from the bottom. Fall color is used only where it carries meaning: **aspen gold** marks *now, found, golden hour*, **ember** marks the *route, the current time, and deadlines*, and **pine** marks *anything you can tap*. The imagery is real topography. Dark mode is a true night mode for stargazing: near-black, warm, dim, and without pure white anywhere.

Prototype: `index.html` (rendered by `build.mjs` from `/home/user/Fall-Trip/src/js/content/*.js` and `public/img/topo/*.json`), `styles.css`, `art.mjs` (the generated leaf and object art). Screenshots are in `shots/`. To rebuild, run `node build.mjs && node shoot.mjs && node contact.mjs`.

---

## 1. Color tokens

Tokens live on `[data-theme]`. The real app sets `data-theme` from `prefers-color-scheme` unless Settings overrides it (Automatic / Light / Dark). Alpha tokens are measured after compositing onto their real surface.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#F6F4EF` | `#0C0B0A` | Grouped canvas (warm white / warm near-black) |
| `--card` | `#FFFFFF` | `#171513` | Raised surface |
| `--card-2` | `#FBFAF7` | `#1D1A17` | Inset surface inside cards (choice options) |
| `--fill` / `--fill-2` | `rgba(92,74,44,.075/.12)` | `rgba(255,236,205,.07/.11)` | Segmented tracks, chips, empty pips |
| `--line` / `--line-2` | `rgba(60,46,22,.12/.2)` | `rgba(255,236,205,.08/.14)` | 0.5px hairlines |
| `--ink` | `#1A1814` | `#E2DACD` | Primary text (dark never uses #FFF) |
| `--ink-2` | `#5F594F` | `#A89F92` | Secondary text |
| `--ink-3` | `#736C62` | `#8A8174` | Tertiary, chevrons |
| `--tab-off` | `#8C857A` | `#7D766B` | Inactive tab glyphs (UI, 3:1) |
| `--tint` | `#2D5B47` pine | `#8CC0A3` | Interactive: links, buttons, selected tab |
| `--gold` | `#E4A62A` | `#D9A441` | Large decorative gold fills (active step pill, glows) |
| `--gold-ui` | `#C08413` | `#D9A441` | Gold state marks on white (pips, progress, sun arc) |
| `--gold-ink` | `#8A5D00` | `#E2B35A` | Gold as text ("NOW", "Golden hour", "READ") |
| `--ember` | `#B7461D` | `#E88259` | Route line, now-line, "Leave by", badges |
| `--water` | `#D6E4EA` | `#0F171A` | Mono Lake, the Bay |
| `--map-bg` / `--map-tint` | `#F5F1EA` / `#7A5238` | `#0E0D0B` / `#E9D9BB` | Map paper and hypsometric fill |
| `--map-line` / `-idx` | `rgba(128,86,60,.20/.36)` | `rgba(233,217,187,.085/.17)` | Contours / index contours |

Dark-mode rules for night use: text tops out at `#E2DACD` (L≈71%). Accents are desaturated and pushed warm, so ember and gold never read as blue-white glare. Leaf art is shown at `brightness(.86)`. The map fill is cut to about 40% of its light value, so the terrain reads as faint lines on black.

### Measured contrast (WCAG 2.x)

| Pair | Use | Light | Dark |
|---|---|---|---|
| ink / bg | Titles, body | **16.13** | **14.18** |
| ink / card | Body on cards | **17.73** | **13.13** |
| ink-2 / bg | Secondary | **6.31** | **7.53** |
| ink-2 / card | Secondary on cards | **6.93** | **6.97** |
| ink-3 / card | Tertiary | **5.18** | **4.75** |
| tab-off / tab material | Inactive tab (UI ≥3) | **3.35** | **4.17** |
| tint / card | Links, button text | **7.78** | **8.83** |
| tint / tint-soft | Tinted buttons | **6.69** | **6.99** |
| on-tint / tint | Filled buttons | **7.78** | **9.54** |
| gold-ink / card | Gold labels | **5.76** | **9.39** |
| gold-ink / gold-soft | "Now", "Choose one" tags | **5.14** | **7.38** |
| #2A1E05 / gold | Active step pill text | **7.61** | **7.26** |
| ember / card | "Devotion" label | **5.37** | **6.74** |
| ember / ember-soft | "Leave by 10:50" tag | **4.68** | **5.58** |
| #FFF / ember (dark: #0C0B0A / ember) | Badge "11", now-bubble "9:30" | **5.37** | **7.27** |
| map-label / map-bg | Map labels (plus halo) | **10.65** | **11.49** |
| ink / glass over map | Countdown | **16.98** | **13.22** |
| ink-2 / fill over bg | Segmented labels, chips | **5.62** | **6.58** |
| gold-ui / card | Pips, progress, sun arc (UI ≥3) | **3.21** | **8.10** |

Every text pair passes AA at its size. Decorative `--gold` (2.15:1 on white) is never the only carrier of state. Found/not-found always carries a check badge and a count.

## 2. Typography

Two OFL families, both self-hosted and precached:
- **Inter** (variable, `opsz` + `wght`, `font-optical-sizing: auto`, so display cuts switch on by themselves from about 20px). Features: `cv05` (l with tail, for I/l/1 legibility for kids), `ss03`, `calt`. `tnum` is on for every time, count, and countdown.
- **Newsreader** (variable, `opsz` + `wght`, plus italic). It sets large titles, Scripture, devotion titles, and water labels. It brings warmth and a sense of season through type, the way Apple uses New York in Books and Journal.

| Style | Family | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|---|
| Large title | Newsreader, opsz 60 | 34–40 / 1.06 | 580 | −0.018em | "Fall Trip", "Into the gold", "Leaf hunt" (text-wrap: balance) |
| Countdown | Inter Display | 64 / 0.86 | 640 | −0.05em, tnum | "12" |
| Stat | Inter Display | 28–40 / 1 | 650–700 | −0.04em, tnum | "63°", "6 of 11" |
| Title 3 | Inter | 20 / 1.2 | 650 | −0.022em | Card titles ("Lundy beaver ponds") |
| Section | Inter | 20 / 1.2 | 700 | −0.024em | Section headers |
| Headline | Inter | 16.5–17 / 1.24 | 620–640 | −0.02em | Timeline titles, list rows |
| Body | Inter | 17 / 1.42 | 400 | −0.013em | Reading text |
| Scripture | Newsreader, opsz 18 | 19 / 1.47 | 420 | −0.002em | Passages. Verse numbers are Inter 10/700 in gold-ink |
| Subhead | Inter | 14–15 / 1.36–1.38 | 400 | −0.01em | Notes |
| Footnote | Inter | 13 / 1.38 | 500 | −0.004em | Meta, captions |
| Eyebrow | Inter | 12–13 / 1.2 | 600–700 | +0.035–0.05em, uppercase | "SATURDAY, OCTOBER 10", "NOW", "READ" |
| Caption | Inter | 11–12 / 1.33 | 500–600 | 0 | Tab labels (10/600), notices (11) |

Everything is set in rem in the build (the prototype uses px 1:1). Body scales with `-apple-system-body` via `font: -apple-system-body` on `html`, with the scale expressed as rem multiples. Titles clamp at 1.35× to protect layout. The kid tiles and hunt tiles use 13.5–15px semibold minimum with 2-word labels ("Aspen leaf"). The full content names ("Quaking aspen leaf") appear in the item sheet.

## 3. Space, radius, elevation

- **Spacing** (4pt base): 2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40. Card gutter 16. Text gutter 20. Stacks between cards 12. Inside cards 14–16.
- **Radius**: 7–8 segment thumb · 9–10 segment track · 14 choice option · 16–18 buttons, list groups, launcher tiles · 20 timeline and hunt cards · 22 cards and widgets · 24–26 passage and glass countdown · capsules at 50%. Nested radii follow *outer − padding*.
- **Targets**: 44×44 minimum. Buttons are 32–36 tall with invisible 44 hit slop. Kid switcher is 64 tall. Hunt tiles are 113×146.
- **Elevation**
  - `e0` flat: the canvas.
  - `e1` card: `0 .5px 0 rgba(60,40,10,.05), 0 1px 3px rgba(60,40,10,.06)`. Dark uses a 0.5px warm hairline in place of a shadow.
  - `e2` raised: the current item or selected kid, `0 10px 30px -12px rgba(70,48,14,.22)`, plus a 1.5px gold inner ring when it means "now".
  - `e3` floating glass: the countdown, devotion stepper, and map chips. Material plus `e2`.

## 4. Materials

| Material | Light | Dark | Where |
|---|---|---|---|
| Bar | `rgba(248,246,242,.74)`, blur 22, saturate 180% | `rgba(22,20,18,.72)`, same | Tab bar and nav bar, with a 0.5px top/bottom hairline |
| Glass | `rgba(255,255,255,.66)`, blur 24, saturate 170%, inner 0.5px white edge | `rgba(28,25,22,.62)`, 0.5px warm edge | Countdown over terrain, "Now" chip, map buttons |
| Strong | `rgba(250,249,246,.86)`, blur 20 | `rgba(24,22,19,.86)` | Devotion stepper (sits over text, so it needs more opacity) |

No paper, no grain, no noise. Texture comes from real contour linework, and depth comes from light and blur. The one exception is the "morning light" radial wash on the hero map. Light mode uses `#F2B544` at 26% with multiply, anchored top-right where the sun rises over the Great Basin. Dark mode uses a 7% screen blend.

## 5. Iconography

- **Phosphor** (`@phosphor-icons/core`, MIT), bundled as inline SVG. There are no icon fonts and no runtime fetches.
  - *Regular* (1.5px at 24) for navigation and inactive tabs.
  - *Fill* for the selected tab and for state (navigation arrow, active step).
  - *Duotone* for the eight Today launcher tiles, tinted by kind: pine for logistics, gold for leaves and color, ember for devotions.
  - *Bold* at 13–15px for inline meta glyphs, so they hold weight next to 13px text.
- Tabs: Today `sun-horizon`, Plan `calendar-dots`, Activities `compass`, Kids `person-arms-spread`, Devotions `book-open-text`.
- Custom: the status-bar glyphs, and all hunt art (see below).

## 6. Imagery

**Real topography is the signature texture.**
- `route.json` (150 m contours) and `eastside.json` (60 m) are rendered as inline SVG. Each band is filled at a tiny alpha (`--map-a` about 0.009) so stacked bands build a quiet hypsometric relief: the crest reads darker than the basins with no shading data. Every fifth line is an index contour (0.85 vs 0.6px, `vector-effect: non-scaling-stroke`), so lines stay hairline at any zoom.
- Water is geometric truth, not a drawn guess. Mono Lake is the region inside the 1,900 m surface and outside the 1,960 m surface (the lake sits near 1,945 m). The Bay is the complement of the 0 m shoreline.
- The two datasets are both linear east-up projections, so one affine transform (`translate(22.1 27.97) scale(.5104 .5108)`) registers `eastside` onto `route`. The detail and overview maps line up exactly.
- The route is ember with a canvas-colored casing (6px under 2.6px) through the real stop coordinates. The build should replace the Catmull-Rom spline with OSM road geometry baked at build time. Stops are 3px rings. The destination is a filled ember dot. Labels are Inter 11/600 with a 3px halo in the canvas color.
- The same data appears at every scale:
  - Hero (the drive, with Tioga Pass at 9,945 ft).
  - Now card (Lundy Canyon walls, with a dashed next leg to Conway Summit).
  - A watermark behind each devotion: the contours of the place where it's read (Saturday uses Lundy Canyon), masked to fade by 380px.

**Leaves and objects** are generated vector art (`art.mjs`), not paintings:
- Each leaf is built from a half-width profile along the midrib. It gets the right margin (aspen: fine crenate with an acuminate tip; cottonwood and willow: serrate; water birch: doubly serrate; mountain maple: three-lobed and doubly serrate; heart: cordate) and pinnate or palmate venation in a lighter vein color.
- Objects: Jeffrey pine cone (scales in offset rows with inward umbos), salt-and-pepper granite with a sparkle, stick-lattice beaver dam, tufa towers in Mono Lake, aspen bark "eye", mule-deer track, faceted obsidian.
- "Biggest leaf" is drawn deliberately too big and is cropped by its tile.
- Every item also has a single-path silhouette: the not-yet-found slot, which kids can match against the real thing.

**Light** is the third motif. The Sun card draws the day's actual arc (sunrise 7:00, golden bands 7:00–7:34 and 5:50–6:25, sunset 6:25, dark 7:52). The elapsed part is gold and the rest is dotted. The sun dot sits at the current time.

## 7. Motion language

Built with `motion/react` v12 under `<MotionConfig reducedMotion="user">`. Springs are named tokens. ζ is the damping ratio.

| Token | Config | ζ | Feel |
|---|---|---|---|
| `snap` | `{type:'spring', stiffness:700, damping:45, mass:.8}` | 0.95 | Presses, toggles, digits. Settles in about 180ms with no overshoot |
| `glide` | `{type:'spring', stiffness:380, damping:36, mass:1}` | 0.92 | Page push/pop, shared elements. About 380ms |
| `indicator` | `{type:'spring', stiffness:500, damping:38}` | 0.85 | layoutId thumbs. A hint of settle |
| `sheet` | open `{duration:.5, ease:[.32,.72,0,1]}`; release `{type:'spring', stiffness:420, damping:40}` with drag velocity | 0.98 | Bottom sheets (Vaul curve) |
| `pop` | `{type:'spring', stiffness:520, damping:22, mass:.9}` | 0.51 | Celebrations and badges. One visible overshoot |
| `camera` | `useSpring(progress, {stiffness:120, damping:30})` | 1.37 | Scroll-linked map camera, heavily smoothed |

Each interaction, with its reduced-motion fallback (`prefers-reduced-motion: reduce`):

- **Page push/pop.** The incoming page moves `x: 100% → 0` on `glide`. The outgoing page moves `x: 0 → −28%` under a scrim fading to `rgba(0,0,0,.06)` (dark: `.25`). The large title collapses into the nav title: scale 1 → .47, translated to center, with a cross-fade at 60%. The back label morphs from the previous title. Edge-swipe back is interactive (progress = dragX/width). It commits if progress > .35 or velocity > 500px/s, and the spring takes the release velocity. *Reduced:* a 150ms opacity cross-fade with no translate.
- **Tab switch.** Content does not slide (tabs are places, not a sequence). The outgoing view fades out over 90ms and the incoming view fades in over 140ms, and each tab restores its own scroll. The selected icon swaps regular → fill with scale .88 → 1 on `snap`. Every segmented control (Fri/Sat/Sun, ESV/NIV, Kid 1/2/3, the devotion stepper) moves one shared `layoutId` thumb on `indicator`. Labels change color at the midpoint, never before the thumb arrives. *Reduced:* the thumb jumps and colors change instantly.
- **Card → detail (shared element).** Examples: a timeline card → item sheet, a hunt tile → item page, the Now card map → full map. The card's surface and its art or map share a `layoutId`. The radius animates 20 → 0 (layout-corrected with `style={{borderRadius}}`) on `glide`. Hunt art grows from 78 to 220px. Text inside fades and rises 8px after 45% of the flight (delay 80ms). Closing reverses, and a swipe down anywhere dismisses on `glide` with velocity. *Reduced:* cross-fade, no geometry.
- **Bottom sheet** (item details, route options, "Choose one"). It opens on the Vaul curve over 500ms. The page behind scales to .94 with a 12px radius and a scrim of .3 (dark .5). Snap points are 50% and 92%. Drag rubber-bands past the top (offset × .55, log-dampened). It dismisses when velocity > .4px/ms or when dragged past 25%. *Reduced:* opacity plus an instant position change, with no scale on the background.
- **Check-off** (packing, before-you-go, marking a devotion done). The box fill scales .6 → 1 on `pop`. The check draws `pathLength 0 → 1` over 220ms easeOut, 40ms later. A strike-through draws left to right over 240ms and the label moves to ink-2. After 600ms the item reflows to the bottom of its group with a `layout` animation on `glide`. *Reduced:* instant state and instant reflow.
- **Leaf found.** On press the tile goes to scale .96. On release, the silhouette dissolves into the art (opacity crossfade 180ms) while the art goes scale .7 → 1 and rotate −8° → 0 on `pop`. The check badge pops in at +120ms. Seven to nine tiny leaves in *that item's own palette* burst from the tile center: initial speed 180–320px/s across the upper 160°, gravity 900px/s², spin ±360°/s, fading over 700ms. The matching pip fills with a gold `scaleX` sweep (300ms), and the big count rolls a digit. Finding all 11 triggers a 2.4s full-screen fall of 24 leaves with sinusoidal sway, then a sheet: "All 11 found." *Reduced:* no particles or rotation. Art cross-fades and the pip fills instantly.
- **Countdown digits.** Each digit is its own tabular column. On change, the old digit exits `y 0 → −40%` with opacity → 0, and the new one enters from `+40%` on `snap`. Only changed columns move, and width never reflows. The day strip's "today" tick slides one cell at midnight on `indicator`. *Reduced:* a 120ms cross-fade per digit.
- **Route story scroll** (from "Follow the route"). The hero map is a shared element that expands to full screen on `glide`. Then `useScroll` progress p (0 → 1 across eight chapters) drives:
  - (a) A camera between per-chapter keyframes `{cx, cy, zoom}`, from the Bay at 1× to Tioga Road at 2.4×, smoothed by `camera`.
  - (b) The route `pathLength` mapped to cumulative stop distance. The drawn part is ember and the remainder is a 40% dotted line.
  - (c) An elevation readout ("Elevation 6,240 ft", tnum). The contour ring at the current elevation glows gold for 400ms as the route crosses it, so the climb to Tioga Pass is felt.
  - (d) Stops that `pop` in as the drawn tip reaches them.
  - (e) Sticky glass chapter cards: the incoming card rises 24px, and the previous one dims to .4.
  - (f) Light that follows the clock. The morning wash warms toward golden hour at Olmsted Point. At the New Moon chapter the map cross-fades to the night palette, and 60 star points fade in at random 0–600ms offsets.

  *Reduced:* no camera. Chapters render as a static list, each with its own still map crop, and the route is fully drawn.
- **List stagger.** On the first mount per session only: opacity 0 → 1 and y 8 → 0, 30ms stagger, capped at 8 animated rows, on `snap`. Revisits appear instantly. *Reduced:* none.
- **Press states.** Cards scale .97 and icon buttons .94 on pointer-down (`snap`), with a 4% ink overlay. Rows use the iOS table highlight: an instant `--fill`, fading over 200ms after release. `touch-action: manipulation` everywhere, so there is no 300ms delay. *Reduced:* the color feedback stays and the scale is dropped.
- **Ambient.** The "Now" dot pulses: a ring grows 0 → 8px and fades over a 2.4s loop, paused when off-screen or when the page is hidden. The Plan now-line advances in real time: `top` is interpolated by minute and moves once per minute on `glide`. *Reduced:* static.

## 8. Five signature moments

1. **The establishing shot.** Today opens on the real terrain of the drive, with the date and a countdown floating on glass over Tioga's contours. "Follow the route" lifts the map into full screen and flies the camera to the Bay Area. As you scroll, the route draws itself up the actual contour lines while an elevation counter climbs to 9,945 ft, and the ring at your altitude glints gold as you pass it.
2. **A sun that knows the day.** The Sun card is the real arc for Oct 10. The dot rides it live, the golden-hour bands brighten when you enter them, and at 7:52 ("dark") the app offers **Stargazing**: a red-shifted, even dimmer night palette that protects night vision. Stars fade into the empty sky of the arc.
3. **Leaf found.** A grey silhouette develops into a crisply veined leaf and bursts into tiny copies of itself in its own colors. A pip sweeps gold and the count rolls over. Each kid's ring on the switcher fills a little more.
4. **Devotions that carry their place.** Every devotion is laid over the real contours of where you'll read it: the Lundy Canyon walls behind "Each according to its kind", and Mono Lake's shoreline behind "Springs in the valley". Stepping Look → Read → Wonder → Pray → Do slides one gold thumb along the stepper while the terrain parallaxes at 0.3×. The reader and prayer rotate among the kids with a flip of the names.
5. **The now-line.** An ember line, as in Calendar, moves through Saturday in real time. Ten minutes before a "Leave by" it gently brightens. The rail behind finished stops fills gold as they pass, and drive legs between cards show the actual minutes. You always know where you are in the day at a glance, even offline.

## 9. Notes for the build

- The Scripture notice is shown under the passage in its short "non-saleable media" form: the (ESV®)/(NIV®) initials, the copyright line, and "Full notice in About". The publishers' full notices live on the About page, verbatim from the current app. The YouVersion link opens only on tap.
- The **Offline** chip appears on Today and Plan whenever `navigator.onLine` is false. It says nothing is wrong: every screen shown here works with no signal.
- Kid names come from Settings and are stored in localStorage only. The placeholders are "Kid 1/2/3". The switcher's initials and avatars derive from the entered name.
- Fonts: Inter (OFL, via `@fontsource-variable/inter`, file `inter-latin-opsz-normal.woff2`) and Newsreader (OFL, already in `src/fonts`). Both are precached. Nothing is fetched at runtime.
