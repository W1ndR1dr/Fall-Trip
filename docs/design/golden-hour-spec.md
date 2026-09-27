# Golden Hour: design system spec

Direction A for the Fall Trip PWA. The app is dark-first and warm. Surfaces are warm near-black, and light arrives as amber and ember, the way a low sun does. Light mode is the same app at sunrise: warm white, long soft raked shadows, the same accents.

The rule behind every decision is simple. **Light carries meaning.** Glow, gradients and warmth mark what is live or important: the countdown, "Now", the route, found items. Everything else is quiet.

Prototype: `index.html` (built by `build.mjs` from the app's real `src/js/content/*.js` and `public/img/topo/*.json`). Screenshots are in `shots/`. `index.html#frame=<screen>-<light|dark>` shows a single frame at 390×844.

---

## 1. Color tokens

Tokens are CSS custom properties. In production they live on `:root` for light, `@media (prefers-color-scheme: dark)` for dark, and `[data-theme="light"|"dark"]` for the Settings override (Automatic / Light / Dark). `<meta name="theme-color">` and `apple-mobile-web-app-status-bar-style` follow `--bg`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0E0A07` | `#FAF6F0` | Page |
| `--bg-2` | `#17110D` | `#FFFFFF` | Cards, grouped surfaces |
| `--bg-3` | `#221913` | `#F3ECE3` | Raised controls, wells |
| `--fill` / `--fill-2` | `rgba(255,226,196,.06/.10)` | `rgba(70,40,15,.045/.08)` | Chips, secondary buttons, segmented tracks |
| `--line` / `--line-2` | `rgba(255,226,196,.085/.15)` | `rgba(70,40,15,.09/.16)` | Hairlines, rails |
| `--text` | `#F8EFE6` | `#1D140D` | Primary text |
| `--text-2` | `#C4B3A1` | `#5C4B3B` | Secondary text, notes |
| `--text-3` | `#9A8876` | `#7A6653` | Meta, captions (still AA) |
| `--accent` | `#FFB44F` | `#F29A2E` | Sun: button fills, badges (always with ink text) |
| `--accent-2` | `#FF8746` | `#D9541E` | Ember: gradient partner, sunset |
| `--accent-text` | `#FFC578` | `#A34F06` | Amber as text or links |
| `--accent-mark` | `#FFB44F` | `#C0620A` | Graphical marks: pips, progress, live dot, map stops |
| `--on-accent` | `#1E1004` | `#1E1004` | Ink on amber fills |
| `--accent-soft` | `rgba(255,170,80,.14)` | `rgba(242,154,46,.14)` | Active tab lens, tinted chips |
| `--night` | `#A9B1FF` | `#4A50C4` | The only cool color: dark, night sky, devotion glyphs |
| `--ok` | `#9ED49A` | `#2F7A3A` | Road open |
| `--kid-1/2/3` | `#FFB44F` `#FF7A55` `#B7A6FF` | `#E58A12` `#D9541E` `#6E5CE0` | Each child's color (avatar, turn chip) |

### Measured contrast (WCAG 2.x, alpha composited over the real backdrop; `node lib/contrast.mjs`)

| Theme | Pair | Ratio | Grade |
|---|---|---|---|
| dark | text / bg | 17.35:1 | AAA |
| dark | text / card | 16.46:1 | AAA |
| dark | text-2 / bg · card | 9.68 · 9.19:1 | AAA |
| dark | text-3 / bg · card | 5.78 · 5.49:1 | AA |
| dark | accent-text / bg · card | 12.68 · 12.04:1 | AAA |
| dark | accent-text / accent-soft (active tab, chips) | 9.31:1 | AAA |
| dark | on-accent / accent (primary button) | 10.52:1 | AAA |
| dark | night / card · night-soft | 9.28 · 7.44:1 | AAA |
| dark | ok / bg | 11.58:1 | AAA |
| dark | accent-mark / bg | 11.17:1 | UI ✓ |
| light | text / bg · card | 16.84 · 18.13:1 | AAA |
| light | text-2 / bg · card | 7.73 · 8.32:1 | AAA |
| light | text-3 / bg · card | 5.06 · 5.45:1 | AA |
| light | accent-text / bg · card | 5.30 · 5.71:1 | AA |
| light | accent-text / accent-soft | 5.13:1 | AA |
| light | on-accent / accent (primary button) | 8.34:1 | AAA |
| light | night / card · night-soft | 6.49 · 5.62:1 | AA |
| light | ok / bg | 4.92:1 | AA |
| light | accent-mark / bg · card | 3.91 · 4.21:1 | UI ✓ (≥3:1) |

`--accent` in light (`#F29A2E`) measures 2.07:1 against the page. For that reason it is **never** used on its own as a mark or as text. It only appears as a fill carrying ink (`--on-accent`, 8.34:1), which is why `--accent-mark` exists.

Text over the topography uses a halo in `--bg` (3 stacked text-shadows, or `paint-order: stroke` in SVG). Labels therefore sit on a solid background color no matter what terrain is underneath.

**Night vision (proposed, for stargazing).** After "Dark" (7:52 pm on Saturday), the app offers a one-tap red-shifted theme. All text uses `#D8563A` at three alpha steps on `#050202`, and accents use `#8F2A18`. Nothing is brighter than about 12 cd/m² on a dimmed phone, which keeps everyone's eyes dark-adapted under the New Moon.

---

## 2. Typography

The system is two families, and each has one job:

- **Newsreader** (OFL, variable `opsz` 6–72, `wght` 200–800, plus italic) is the display serif and the reading face. Optical size does real work: at 150 px it is a sharp, high-contrast display cut, and at 18 px it is a sturdy text face for Scripture read aloud in the sun.
- **Inter** (OFL, variable `opsz` + `wght`) is the precise grotesk for every UI string, time and label. `font-feature-settings: 'cv05'` turns on the tailed l, so l / I / 1 never blur in glare. Every time uses `font-variant-numeric: tabular-nums`.

| Role | Family | Size / line-height | Weight | Tracking | Notes |
|---|---|---|---|---|---|
| Countdown | Newsreader | 150 / 0.80 | 330 | −0.055em | opsz 72, lining + tabular, amber gradient fill + glow (dark) |
| Large title | Newsreader | 34 / 1.06 | 400 | −0.022em | Page titles ("Into the gold", "Leaf hunt") |
| Title 2 | Newsreader | 27 / 1.10 | 420 | −0.018em | "Now" card |
| Section serif | Newsreader | 23 / 1.0 | 400 | −0.015em | "The drive" |
| Units, italic | Newsreader Italic | 34 / 1.0 | 400 | −0.01em | "days" |
| Scripture | Newsreader | 19 / 1.50 | 400 | −0.004em | opsz 18, `hanging-punctuation: first` |
| Reading | Newsreader | 18.5 / 1.50 | 400 | −0.003em | Look / Wonder / Pray / Do |
| Headline | Inter | 16–16.5 / 1.30 | 600 | −0.012em | Timeline and list titles |
| Body | Inter | 15 / 1.47 | 400 | −0.006em | |
| Callout | Inter | 14 / 1.45 | 400 | 0 | Timeline notes |
| Footnote | Inter | 13 / 1.35 | 500 | 0 | Meta |
| Caption | Inter | 11.5 / 1.40 | 500 | 0 | Copyright notice, arc labels |
| Eyebrow | Inter | 12 / 16 | 600 | +0.06em, uppercase | At most one per block |
| Tab label | Inter | 10.5 / 1 | 600 | +0.005em | |
| Verse number | Inter | 10 / 1 | 700 | 0 | Superscript, `--accent-text` |

**Dynamic Type.** Sizes are authored in rem (the px values above are at 16 px). The root uses `font: -apple-system-body`, so the iOS text-size setting scales the whole scale. The countdown uses `clamp()`. Large-print mode for the devotion bumps reading to 22/1.5 and Scripture to 23/1.5.

---

## 3. Space, radius, elevation

- **Spacing** (4-pt base): 2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40 · 56. Screen gutter is 16 for cards and 20 for text blocks and titles. Gaps inside cards are 8–12, and gaps between sections are 18–22.
- **Touch targets**: at least 44×44 pt (Maps buttons 36 px visual inside a 44 px hit area, tab cells 70×54). Kid tiles are 114×136 and the kid switcher is 66 tall.
- **Radius** (concentric: inner = outer − padding): tag 6 · icon well 10–11 · segmented 12 (inner 9) · tile/chip 16 · card and button pill 20–22 · tab capsule 31 (lens 27) · sheet 44 (matches the display corner).
- **Elevation.** Depth comes from light, not from stacked shadows.
  - **E0, page.** `--bg` plus ambient sky gradient plus grain.
  - **E1, card.** Dark: `--bg-2` + 1 px hairline + a 1 px inner top highlight (`rgba(255,236,214,.07)`), with no drop shadow. Light: white + hairline + a *raked morning shadow* `6px 14px 28px -14px rgba(120,70,20,.20)`, offset slightly right, as if the sun were low.
  - **E2, live.** The "Now" card and found tiles get a 1 px `--accent-line` rim, a warm radial bloom from the top-left, and an ember under-glow (`0 16px 36px -20px rgba(255,120,30,.55)` in dark).
  - **E3, floating glass.** Tab bar, nav bar, story chapter card, map buttons (section 4).

---

## 4. Materials

- **Glass.** `backdrop-filter: blur(22px) saturate(180%)`, tinted `rgba(24,18,14,.62)` in dark and `rgba(252,249,244,.66)` in light. The rim is 0.5 px `--glass-line`, the top highlight is a 1 px inset, and the float shadow is `0 18px 40px -12px rgba(0,0,0,.7)` (dark) or a raked warm shadow (light). Glass is used only on elements that float over scrolling content: tab bar, collapsed nav, chapter card, map controls. Content cards are never glass.
- **Grain.** A 180 px SVG `feTurbulence` tile at 4.5% (dark, `overlay`) or 3.5% (light, `multiply`). It stops banding in the long dark gradients and gives the surfaces a photographic finish. It is `pointer-events: none` and sits above everything.
- **Glow.** Glow appears only on three things: the countdown number (`drop-shadow` 18 px + 48 px ember), live indicators (Now dot, route head, current timeline node), and the route line (a 3.2 px blurred copy underneath). Light mode has no glow; it uses crisp ink and raked shadows instead.
- **Sky.** Each screen has a 560 px ambient gradient at the top that says where the sun is:
  - Home before the trip: a low ember horizon glow behind the countdown.
  - During the trip at 9:30: a paler, higher gold from the upper right.
  - Devotion: a dim, candle-warm pool, for reading at night.

---

## 5. Iconography

- The set is **Phosphor**. Regular weight is 1.5 px at 24, which matches Inter's stems. **Fill** is used for the active tab and primary glyphs (navigation arrow). **Bold** is used at 16 px inside chips so tiny glyphs don't go thin.
- Sizes are 24 (tab bar), 20 (buttons), 18 (icon wells), 16 (chips and meta), 13 (inline meta).
- Tab icons: sun-horizon (Today), calendar-dots (Plan), compass (Activities), leaf (Kids), book-open-text (Devotions). Every navigation icon has a text label.
- Custom glyphs share the hunt-art construction: the aspen-leaf mark in the wordmark and app icon, leaf-shaped progress pips, the car glyph on drive legs, and map stop dots.

---

## 6. Imagery

**Real topography, lit by the theme's sun.** The contours come straight from `route.json` and `eastside.json` (east is up, so the drive runs bottom to top). Every elevation band is:

1. filled with a hypsometric ramp;
2. drawn twice more, shifted about 0.9 units toward and away from the sun. This is the *Tanaka illuminated-contour* method, so each slope facing the sun gets a lit sliver and each slope facing away gets a shadow sliver.

Dark mode is **evening**: the sun is low in the west (the bottom of the map), and the lit slivers are amber. Light mode is **sunrise**: the sun comes from the east over the Great Basin, which is physically true for the Eastern Sierra at dawn, and the lit slivers are white on peach.

- The route is a Catmull-Rom spline through the real stop coordinates. US-395 waypoints are projected from lat/lon with the file's own bounds; production would use simplified road geometry.
- The route line has a dark casing, a blurred ember glow and an amber gradient stroke.
- Labels are HTML so they stay crisp and on-system, with name, arrival time from `trip.js`, and elevation.
- Mono Lake is labeled in italic serif as water.
- Masks feather the map into the page, so it has no frame.

**Leaves and specimens, drawn not painted.** Leaves are generated from a small botanical model (`lib/art.mjs`):

- **Blade profile**: base roundness, tip taper, acuminate tip.
- **Margin**: crenate for aspen, serrate for cottonwood and willow, doubly serrate for water birch.
- **Venation**: pinnate secondaries curving to the margin, or palmate for the 3-lobed mountain maple (the "red leaf"), plus a cordate curve for the heart.
- **Petiole** included.

Colors are real fall pigments: carotenoid golds, and anthocyanin red only on the maple. Non-leaf items (pinecone, granite sparkle, beaver dam with a chewed stump, tufa tower, aspen "eyes", deer track, obsidian) share the same line weight, top-left light and flat-gradient finish.

- **Not found**: the specimen is a clean outline to look for.
- **Found**: full color, a warm bloom and a check.

The old watercolor webp paintings are not used.

**Light as information.** On the during-trip home, the sun arc plots the day from the real `sun.sat` times: sunrise, golden hours, sunset, twilight to dark, with the sun dot at the current time. Golden-hour segments are thick amber, twilight is dotted ember, and night is dotted indigo.

---

## 7. Motion language

The build uses `motion` v12 (`motion/react`) inside `<MotionConfig reducedMotion="user">`. There are two families of springs:

- **Settle** springs, for navigation and layout. They are critically damped: no bounce, no overshoot.
- **Alive** springs, for moments of delight. These have a small bounce and are used only where a child or parent just *did* something.

Nothing loops except live indicators. Light (opacity, glow, color temperature) animates more often than position does.

Reduced motion replaces every movement with an opacity or an instant state change. Colors, glows and haptics stay.

| Interaction | Parameters | Reduced motion |
|---|---|---|
| **Page push / pop** | Incoming `x: 100% → 0`. Outgoing `x: 0 → −28%` with a dim overlay `0 → .35` (dark) or `.12` (light). `{type:'spring', stiffness: 380, damping: 40, mass: 1}` (about 0.42 s visual, bounce 0). Edge-swipe back: `drag="x"` from a 24 px left edge, `dragElastic: 0`. Pop commits if offset > 35% or velocity > 500 px/s; the release velocity seeds the spring. Large titles cross-fade into the compact nav title across the first 40 px of travel. | 160 ms opacity cross-fade, no translate |
| **Tab switch** | The active lens is `layoutId="tab-lens"` with `{stiffness: 500, damping: 38, mass: .8}` (≈0.28 s, bounce ≈0.1). The icon swaps regular → fill with `scale .88 → 1` and `{stiffness: 600, damping: 30}`. Tab content cross-fades in 120 ms with no slide, like iOS. Scroll position is preserved per tab. | Lens jumps, icon swaps instantly, 80 ms fade |
| **Card → detail** (activity card, Now card → plan item, devotion row → reading) | Shared `layoutId` on the container, title and art. `{type:'spring', visualDuration: .5, bounce: .08}`. Border radius animates 22 → 0 with the layout, and the page behind dims to .4. Secondary content enters 60 ms later with `opacity 0→1, y 8→0`. Close runs the same spring in reverse. Interruptible mid-flight. | 180 ms cross-fade |
| **Bottom sheet** (Vaul: hunt hint, route choice, Settings) | Open `{stiffness: 420, damping: 42, mass: 1}`. Snap points `[.5, .92]`. Rubber-band past the top (`dragElastic .12`). Dismiss at velocity > 0.4 px/ms or 25% travel. The page behind scales 1 → .94, gets 12 px corner radius and dims 0 → .4. | Fade in and out 160 ms, no scale |
| **Checkbox / check-off** (packing, before-you-go, devotion "Done") | Box fill `scale .6 → 1`, `{stiffness: 700, damping: 28}` (small overshoot). Check path `pathLength 0 → 1` over 220 ms `cubic-bezier(.22,1,.36,1)`, starting at 40 ms. Row text fades to `--text-3` in 200 ms. The progress bar width uses `{stiffness: 200, damping: 30}`. Light haptic on supported devices. | Checked state appears instantly; bar jumps |
| **Hunt "found" celebration** | 1. Tile press: `scale .92`. 2. Release: the specimen art bounces `1 → 1.14 → 1` with `{stiffness: 400, damping: 14}` (bounce ≈ .45). 3. The warm bloom fades up in 300 ms. 4. The check badge enters from `scale 0, rotate −30°` with `{stiffness: 600, damping: 20}`. 5. **7 particles** in that exact specimen's silhouette, 8–12 px, in the child's color, launch from the tile at 300–520 px/s. Each has gravity 900 px/s², spin ±360°/s and fades out over 0.9 s (max 9 particles, pooled). 6. The next leaf pip fills with a scale pop. Finding all 11 triggers a 2.4 s leaf fall (24 leaves) and a sheet: "All 11 found." Optional chime if `sound` is on. | Badge fades in 150 ms, pip fills instantly, and `aria-live` announces "6 of 11 found" |
| **Countdown digits** | Each digit is its own column (tabular numerals, so widths never jitter). The old digit goes `y 0 → −55%`, `opacity 1 → 0`, `blur 0 → 4px`; the new one comes up from `+55%`. `{stiffness: 300, damping: 30}`, staggered 30 ms from right to left. At departure (Fri 12:00) the number sinks below the horizon line (`y → 120%`, glow fades) and "Now / Next" takes its place with a layout animation. | Text swaps; glow stays |
| **Route story scroll** | `useScroll({target, offset: ['start start', 'end end']})` feeds progress `p` across 9 states: the overview plus the 8 chapters. It is smoothed with `useSpring(p, {stiffness: 120, damping: 30, mass: .6})`. Seven effects run off `p`, listed after this table. | Each chapter snaps to its framing with a 200 ms cross-fade. The route is fully drawn to the current chapter. Light has one static state per chapter, and there are no stars |
| **List stagger** (timeline, hunt grid, activity menu) | First mount per session only; restored views appear instantly. `opacity 0 → 1, y 10 → 0`, `staggerChildren .035`, total stagger capped at 0.25 s, `{visualDuration: .45, bounce: 0}`. | Opacity only, 120 ms, no stagger |
| **Press states** | Cards `whileTap scale .97`, small buttons `.94`, kid tiles `.92`. Press uses `{stiffness: 800, damping: 40}`, release `{stiffness: 500, damping: 30}`. The fill brightens one step (`--fill → --fill-2`). Text links dim to .6 instead of scaling. | Color and fill change only |
| **Live indicators** | The Now dot ring expands 0 → 8 px and fades, 2.4 s ease-out, infinite. On mount, the sun on the arc travels from sunrise to now in 0.9 s (`{visualDuration: .9, bounce: 0}`) while the traveled path draws. | Static dot, static arc |
| **Theme change** | View Transitions API: a circular reveal centered on the sun glyph, 600 ms `cubic-bezier(.2,.8,.2,1)`. The topography's light direction swaps (east ↔ west) inside the transition, so the map is re-lit rather than just recolored. | Instant swap |

The route story's seven scroll effects:

1. The **camera** moves between framings authored per chapter (center and zoom) through the SVG `viewBox`.
2. The **route draws** with `pathLength`, and a glowing head dot leads it.
3. **Stop dots** pop in (`scale 0 → 1`, `{stiffness: 500, damping: 25}`) as the head passes, and their labels rise 6 px while fading in.
4. **The terrain rises.** Each contour band's opacity is `clamp((headElevation − level)/300 + 1, .15, 1)`, so the Sierra reveals itself from the valley upward as the drive climbs. An elevation readout ticks to **9,945 ft** at Tioga Pass.
5. **Light follows the clock.** The sky gradient and the Tanaka lit-sliver color interpolate through each chapter's time: noon, 2 pm, golden hour (amber intensifies on the west faces), dusk (rose, then indigo), New Moon night (lit slivers off, 140 stars fade in), and Sunday morning (light flips to the east).
6. The glass **chapter card** swaps text with `y 12 → 0, opacity`, using `{visualDuration: .35, bounce: 0}`.
7. The **ticks** fill left to right with a `layoutId` pill.

---

## 8. Components in the frames

- **Tab bar.** A floating glass capsule (14 px inset, 62 tall, 24 px above the screen bottom, clear of the home indicator). An amber lens marks the active tab, and every tab has a label.
- **Countdown.** Eyebrow, then the huge serif number, italic "days", tabular "2 hr 19 min", then "until we leave, Friday at noon". All values are computed from `DEPART`.
- **Route stage.** Full-bleed lit terrain with arrival times from `trip.js`. A glass chapter card with 8 ticks sits over the bottom of the map.
- **Quick-entry rail.** A horizontally scrolling row of 124×98 tiles. The 4th tile peeks to show the row scrolls. The tiles are Plan, Activities, Leaf hunt, Devotions, Color report, Packing and Before you go.
- **Now card.** The live pill, "Since 9:15", the serif title, walk and restroom facts from the menu entry, a Maps button, a progress bar that ends at "**Leave by 10:50** for Conway Summit" (the 11:00 start minus its 10-minute drive), and a row for the devotion that happens *here*.
- **Timeline.**
  - Past items fold into "2 earlier". The current item is an E2 card.
  - **Drive legs** are drawn *on the rail* as dashed road segments with a car glyph and the duration from `drive`. How long you stay (`stay`) sits under the time.
  - Titles written "X: y" split into a kicker and a title.
  - Fixed items have solid nodes and flexible items have hollow nodes.
  - Choice items show two option cards with an "or" divider. The option labels come from the item's own copy: "Energy left?" / "Running on fumes?".
- **Hunt.**
  - **Kid switcher**: three large segments, each with its color, number or initial, and count.
  - **Progress**: a big serif count plus 11 leaf pips that fill left to right.
  - **Grid**: 3 columns on iPhone and 4–5 on iPad. Short tile labels for 6–7-year-olds; the full name and hint open in a sheet.
- **Devotion.**
  - A **Look / Read / Wonder / Pray / Do** stepper: completed steps get a dot and the current one gets a lens.
  - Completed steps collapse to one line.
  - Whose turn is shown as color-coded chips ("Kid 2 reads", "Kid 3 prays") with a rotate button. The chip for the current step lights up.
  - Scripture has verse numbers and an ESV/NIV segmented control inside the passage card.
  - The reference line has an "Open in YouVersion" pill.
  - The publisher notice sits directly under the passage in caption type ("ESV® Bible © 2001 by Crossway. Used by permission. All rights reserved." or the Biblica NIV notice). The full notices stay on the About screen.

---

## 9. Five signature moments

1. **The Sierra, lit by the right sun.** Real contour data is rendered as illuminated relief. At night the west faces glow amber like sunset, and in light mode the east escarpment catches sunrise, which is what the Eastern Sierra actually does. Switching theme re-lights the mountains instead of recoloring them.
2. **The terrain rises as you drive.** Scroll the route story and the valley fills in first, then the foothills, then the crest, band by band, as the glowing route climbs. Stops light up as you pass. The elevation ticks up to 9,945 ft at Tioga Pass. Then the light goes rose, then indigo, and on the New Moon chapter stars come out over the map.
3. **A countdown that behaves like the sun.** A 150 px serif number glowing on the horizon, whose digits roll each minute. At noon on departure day it sinks below the horizon line, and the home page becomes "Now / Next" with a layout transition.
4. **The day as an instrument.** The sun arc places the live sun dot on the real curve of the day, and golden hour is visibly thick amber. As golden hour starts, the ambient sky on every screen warms. At "Dark" the app offers night vision for stargazing.
5. **"Found it!"** A child taps the aspen leaf. The leaf jumps. A few tiny aspen leaves in *that child's color* burst from the tile. A pip fills. Finding all 11 brings a gentle leaf fall and "All 11 found." It is fast, physical, and never blocks the next tap.

---

## 10. Accessibility and platform notes

- Every text pair is AA or better in both themes (table in section 1). Graphical marks meet 3:1.
- Focus rings are 2 px `--accent-text` with a 2 px offset.
- Semantics:
  - Landmarks: `<nav>` for the tab bar, `<header>`, `<main>`.
  - Headings.
  - `role="timer"` with a spoken label on the countdown.
  - `role="progressbar"` on the hunt.
  - `aria-pressed` on hunt tiles.
  - `aria-current` on the active tab.
  - `aria-hidden` on topography and art.
- Safe areas: the 47 pt top inset is respected, and the tab bar sits above `env(safe-area-inset-bottom)`. Use `viewport-fit=cover`, `-webkit-text-size-adjust: 100%`, `touch-action: manipulation`, and `overscroll-behavior-y: none` on the app shell.
- Offline: all fonts (Newsreader roman and italic plus Inter, variable woff2, latin subset, about 350 KB total; the italic could drop to a static 400 cut of about 40 KB) and topography JSON are precached. The SVG is generated at runtime from the JSON, so there is no raster map.
