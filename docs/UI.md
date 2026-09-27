# Fall Trip UI rulebook

This file is for screen builders. The design direction is in `docs/DESIGN-DIRECTION.md`, and it wins where the two disagree. Every primitive is shown in every state at **`#/_kit`**. Open it in light, dark and night before you build, and again before you ship. (The kit loads in dev and online, but is not precached or preloaded in production.)

- [File ownership](#file-ownership)
- [Page template](#page-template)
- [Color: light carries meaning](#color-light-carries-meaning)
- [Type](#type)
- [Space and layout](#space-and-layout)
- [Components](#components)
- [Art: terrain and specimens](#art-terrain-and-specimens)
- [Motion](#motion)
- [Accessibility checklist](#accessibility-checklist)
- [Copy](#copy)
- [Build, test, screenshot](#build-test-screenshot)

---

## File ownership

| Path | Owner | What it holds |
|---|---|---|
| `src/ui/*` | foundation | tokens, base CSS, motion, primitives, icons (`import … from '@/ui'`, `'@/ui/icons'`) |
| `src/art/*` | foundation | `Terrain` + map helpers, `Specimen`, `Leaf`, glyphs (`'@/art'`) |
| `src/app/*` | foundation | shell, routing (`routes.tsx`), tab bar, page stack |
| `src/lib/*` | shared | store, time, theme, family, links, feedback, pwa |
| `src/screens/<area>/*` | one builder per area | your screens |
| `src/content/*.js` | shared data | read freely; edit only to fix a fact or remove themed copy, and list the edit |

- Only edit files in your own area. If you need a shared change, build a local component inside your area and report the request.
- Every screen file already exists and is routed. Replace the placeholder body and delete the `Placeholder` import.
- A screen default-exports a component that receives `{ params }`. `useParams()` from wouter also works.

Screen map:

| Area | Files |
|---|---|
| today | `Today.tsx` (`/`) |
| plan | `PlanDay.tsx` (`/plan/:day?`), `RouteOption.tsx` (`/route/:id`), `Packing.tsx` (`/pack`), `BeforeYouGo.tsx` (`/before`) |
| activities | `Explore.tsx` (`/explore/:filter?`), `Activity.tsx` (`/do/:id`), `ColorReport.tsx` (`/color`), `Food.tsx` (`/food`) |
| kids | `KidsHome`, `Hunt`, `Leaves`, `Tracks`, `Rocks`, `Sky`, `Games`, `Draw`, `Photos`, `Cozy` (`/kids/*`) |
| faith | `FaithHome` (`/faith`), `Devotion` (`/faith/:id`), `VerseGame` (`/faith/verse`), `Journal`, `Lookback` |
| more | `Settings`, `About`, `Install` |

`/plan` and `/plan/sat` are one route (`/plan/:day?`), and so are `/explore` and `/explore/<filter>` (`/explore/:filter?`). Switching the day or filter re-renders the same screen in place: local state, open Folds, scroll and the Segmented thumb's glide all survive. Use `navigate('/plan/sat', { replace: true })` for those.

---

## Page template

```tsx
import type { ScreenProps } from '@/app/routes';
import { Page, Section, Card, IconButton } from '@/ui';
import { Lightbulb } from '@/ui/icons';

export default function Hunt(_: ScreenProps) {
  return (
    <Page
      title="Leaf hunt"                          // the one <h1>, the compact bar title, document.title
      back={{ href: '/kids', label: 'Kids' }}    // history back, or this href when opened cold
      actions={<IconButton icon={Lightbulb} label="Hints" />}
      subtitle="Tap a picture when you find it."
      sky="dawn"                                 // dawn | day | candle | plain | none
      width="wide"                               // readable (680) | wide (1000) | full
    >
      <Section title="Found">…</Section>
    </Page>
  );
}
```

- **Exactly one `<h1>` per screen.** `Page` renders it from `title`. If your screen has its own hero (for example the countdown), pass `hideTitle`: the h1 is then visually hidden, and the compact title fades in on scroll.
- Other `Page` props:
  - `compact`: no large title.
  - `barCenter`: puts a node in the bar center, for example a `Segmented` day picker.
  - `eyebrow`: a small line above the title.
  - `dock`: a bar docked above the tab bar, like the devotion stepper. Page adds the bottom space for it, keeps it above the tab scrim, and lifts toasts above it. Wrap its content in `<div className="dock-surface">` (the strong material: opaque, float shadow, no blur).
  - `leading`: replaces the back button (Today's wordmark).
- `Page` owns:
  - the scroll container, safe areas and bottom padding (the content clears the tab bar and its scrim);
  - the tab bar's scrim (it lives in each page's frame, so it moves with the page and sits under the dock);
  - `scroll-padding`, so keyboard focus never lands under the nav bar, tab bar or dock;
  - the large-title collapse, measured from your eyebrow/title/subtitle (glass arrives as the first header line reaches the bar; the compact title only once the large one is fully under it);
  - scroll restoration on back and tab switches;
  - tap-the-active-tab to scroll to top;
  - `document.title`.
- For the page's scroll container (`useScroll`, scroll-spy), call `const ref = usePageScroll()` and then `useScroll({ container: ref })`.
- Settings is reached from the gear on Today (`<IconButton href="/settings" icon={GearSix} label="Settings" />`), not from the tab bar.

---

## Color: light carries meaning

Colors are CSS variables on `<html data-theme="light|dark|night">`. Tailwind utilities map to them, for example `bg-bg-2`, `text-text-2`, `text-accent-text`, `border-line`, `shadow-card` and `rounded-card`. Never hard-code hex values in screens, because night vision must be able to recolor everything.

| Token | Use it for | Never for |
|---|---|---|
| `--bg` / `--bg-2` / `--bg-3` | page / cards / wells | |
| `--fill`, `--fill-2`, `--fill-3` | chips, secondary buttons, tracks, pressed | |
| `--line`, `--line-2` | hairlines, rails | |
| `--text`, `--text-2`, `--text-3` | ink, secondary, meta (all AA on bg and card) | |
| `--accent` | amber **fills** with `--on-accent` ink: the one primary/live action, the NOW tag | text, marks, ordinary buttons |
| `--accent-mark` | graphic marks that mean live/found/progress: pips, progress fill, live dot, route stops | decoration |
| `--accent-text` | amber words that are live ("Now", elevation at the pass) | links, headings |
| `--ember` (+ `-soft`, `-line`) | deadlines: "Leave by 10:50", "Last gas for 59 miles" | anything else |
| `--night` (+ `-soft`) | dark, night sky, devotion glyphs | |
| `--ok` / `--danger` | road open / closed, destructive rows | |
| `--kid-1..3` (+ `-fill`, `-ink`, `-text`) | each child's identity: avatar, turn chip, ring, hunt color | |
| `--water`, `--water-text` | lakes | |

- Links, secondary buttons, the tab lens, segmented thumbs, switches and filter chips are **neutral ink**, never amber.
- Glow (`--glow`, `--glow-mark`) exists only in dark mode. It is used on the countdown, live indicators and the route. Light mode has no glow, and neither does night.
- **After dark.** On trip nights after that day's "Dark" time (and before sunrise), the shell sets `html[data-after-dark]`: the glow tokens, the live bloom and the map glows go out by themselves. Don't build your own threshold: use `useAfterDark()` / `isAfterDark(d)` / `sunTimes(day)` from `@/lib/time`.
- **Night vision** (`data-theme="night"`, `setNightVision(true)` from `@/lib/theme`) uses one red hue on near-black, with no cool colors and no glow. Offer it with `<NightVisionOffer />` on Today and on Night sky (it appears by itself after Dark, and becomes "Turn off night vision" in night). Art gets the `.art` class and is red-shifted automatically (a GPU filter chain). The three night inks are close in luminance on purpose (red only); carry hierarchy with weight and size, not with `text-2`/`text-3` alone.
- **Checkboxes are ink**, like switches. Pass `color` (amber, a kid color) only for "found" states such as the hunt.
- To check contrast after any token change, run `npm run contrast`. Every text pair is AA and every mark is ≥3:1 in all three themes.

---

## Type

Newsreader (serif, variable opsz) is for display and reading. Inter (`cv05`, tabular numerals) is for all UI. Andika is only for kids' large print. Sizes are rem against a 17 px root, so iOS Dynamic Type scales everything.

| Class | Role |
|---|---|
| `t-countdown` | the hero number only (Newsreader, tabular lining) |
| `t-large-title` | page titles (Page renders it) |
| `t-title-1` | the Now card / current item title |
| `t-title-2` | named sections ("The drive"), sheet titles |
| `t-title-3` | small serif heads |
| `t-units` | the italic "days" (the one allowed italic word) |
| `t-scripture` | Bible passages; verse numbers are `<sup className="t-verse">` |
| `t-reading` | Look / Wonder / Pray / Do |
| `t-headline` | list and timeline titles |
| `t-body` | paragraphs |
| `t-callout` | notes |
| `t-footnote` | meta lines |
| `t-caption` | copyright notices, small labels |
| `t-eyebrow` | uppercase label, at most one per block (`<Eyebrow>`) |
| `t-kid` | Andika large print |
| `num` | tabular numbers: every time, count and sun time |
| `t-period` | the small "am/pm" after a time: `9:30<span className="t-period">am</span>` |

Practical numbers are always tabular Inter (`num`). Only the countdown number may be serif.

**Dynamic Type.** Primitives have a `min-height` floor and em padding, never a fixed `height`, so they grow with the text (checked at a 23 px and a 33 px root). Do the same: no fixed heights on anything holding text, and let header rows `flex-wrap` (e.g. `flex flex-wrap items-center gap-x-2 gap-y-1.5` for "NOW · Since 9:15 · Leave by"). Bar chrome (nav title, back pill, tab labels) is capped, like iOS.

---

## Space and layout

- The spacing scale is 4-pt (`p-4` = 16 px, since Tailwind spacing is px-based here): 2 · 4 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40 · 56.
- Gutters:
  - Cards and lists sit 16 px from the edge. `Card` and `ListGroup` already do this; otherwise use the `gutter` class.
  - Titles and text blocks sit 20 px from the edge (`gutter-text`).
  - Nothing sits within 16 px of the screen edge.
- Rhythm: 8–12 px inside cards, 22 px between sections (`Section` does this).
- Radii are concentric (inner = outer − padding): tag 6 · well 11 · segmented 12/9 · tile/chip 16 · card 22 · sheet 38.
- Elevation:
  - E0 is the page (with its sky and grain).
  - E1 is `Card`.
  - E2 is `LiveCard`, which is only for what is happening now.
  - E3 is glass (tab bar and collapsed nav bar only). Content cards are never glass, and `backdrop-filter` goes nowhere else.
- Targets are ≥ 44 × 44 pt. The primitives expand their hit areas; do the same for custom controls.
- iPad (820 × 1180):
  - Pages center a 680 px column (`width="readable"`).
  - Grids that benefit from width (hunt, activities) use `width="wide"` with 4–5 columns.

---

## Components

Everything below is exported from `@/ui`. Icons come from `@/ui/icons` (Phosphor plus the custom `MapsDiamond`, `Car`, `LeafMark` and `LeafPip`). Phosphor weights: regular by default, `fill` for active and primary glyphs, and `bold` at 16 px inside chips.

### Structure

```tsx
<Section title="Next" action={<a href="#/plan/sat">Saturday plan <CaretRight size={14} weight="bold" /></a>}>
<Section title="The drive" serif note="About 8 hours">
<Eyebrow tone="accent">Saturday · Day 2 of 3</Eyebrow>   // tone: neutral | accent | ember | night | ok
<Divider inset={60} />
```

### Surfaces

```tsx
<Card>…</Card>                               // E1, 16 px padding; pad="sm" | "none"; inset={false} inside grids
<Card href="/do/lundy">…</Card>              // whole card tappable (press scale .97, 60 ms delay)
<LiveCard>…</LiveCard>                       // E2: amber rim, bloom, dark under-glow. One per screen.
<IconWell icon={Leaf} tone="accent" />       // 34 px rounded-square icon (tone neutral unless meaningful)
```

### Lists

```tsx
<ListGroup>
  <NavRow href="/kids/hunt" icon={Leaf} title="Leaf hunt" detail="6 of 11" />
  <ListRow icon={SpeakerHigh} title="Sounds" trailing={<Switch checked={on} onChange={setOn} label="Sounds" />} />
  <ListRow href="https://www.nps.gov/yose/" title="Yosemite" subtitle="Opens outside the app" />  // arrow, new tab
  <ListRow onClick={erase} title="Erase all data" destructive />
</ListGroup>
```

### Buttons

```tsx
<Button variant="primary" icon={Check}>Found it</Button>    // amber: the live/primary action only
<Button icon={BookOpenText}>Devotion</Button>               // secondary (default), neutral fill
<Button variant="tonal">…</Button>  <Button variant="ghost">…</Button>
<Button size="sm" | "md" | "lg" block iconEnd={CaretRight} href="/plan" />   // href: in-app path or URL
<IconButton icon={GearSix} label="Settings" href="/settings" />   // variant glass | plain | ghost | primary; label required
<MapsButton q="Lundy Canyon Trailhead, Lundy, CA" place="Lundy Canyon" variant="primary" />
<ExternalLink href="https://roads.dot.ca.gov/">Caltrans road conditions</ExternalLink>
```

- The Maps button always has a label and the road-sign glyph.
- The amber Maps pill turns tonal in dark mode by itself.
- Outbound links open only when tapped, in a new tab.

### Controls

```tsx
<Segmented label="Day" value={day} onChange={setDay}
  options={[{ value: 'fri', label: 'Fri 9' }, { value: 'sat', label: 'Sat 10' }, { value: 'sun', label: 'Sun 11' }]} />
<Segmented size="sm" label="Translation" … />
<Switch checked={on} onChange={setOn} label="Sounds" />
<Checkbox checked={c} onChange={setC} label="Packed" />                     // ink disc, card-colored tick
<Checkbox checked={c} onChange={setC} label="Found" color="var(--kid-2)" tickColor="var(--kid-2-ink)" />   // found states only
<CheckRow checked={has(id)} onChange={() => toggle(id)} title="Headlamps" subtitle="One per person" detail="×5" />
<TextField label="Kid 1's name" value={v} onChange={setV} placeholder="Kid 1" hint="Stays on this device." />
```

For a checklist whose done items sink after 600 ms of stillness:

```tsx
const { has, toggle } = useChecklist('pack');                 // src/lib/store.ts
const order = useSettledOrder(items, (i) => i.id, (i) => has(i.id));  // tracked by id: fresh objects each render are fine
<ListGroup>{order.map((i) => <CheckRow key={i.id} … />)}</ListGroup>   // rows animate to their new place
```

### Status

```tsx
<Tag tone="now">Now</Tag>  <Tag tone="fixed">Fixed</Tag>  <Tag tone="choose">Choose one</Tag>  <Tag tone="ember">Last gas</Tag>
<LivePill />                     // pulsing dot + NOW (static with reduced motion)
<LeaveBy time="10:50" />         // ember deadline chip
<Chip icon={Tree} tone="accent">Near peak</Chip>
<Chip selected={f === 'short'} onClick={() => setF('short')} size="md">Short</Chip>   // filter chip, aria-pressed
<OfflineChip />                  // renders only while offline: "Offline · all saved"
<ProgressBar value={0.16} label="Time at Lundy" start="15 min in" end={<b>1 hr 15 left</b>}
  valueText="15 minutes in, 1 hour 15 left" />       // tone accent (live) | neutral
<ProgressRing value={6 / 11} color="var(--kid-1)" label="6 of 11"><KidAvatar index={0} size={32} /></ProgressRing>
<Pips total={11} filled={6} variant="leaf" color="var(--kid-1)" />   // fills in order; newest pops
<NumberRoller value={days} />    // per-digit roll, 1.5 px motion blur, tabular
```

### Kids

```tsx
const kids = useKids();          // src/lib/family.ts. Names come from Settings; never hard-code names.
<KidAvatar index={1} />          // kid color + AA numeral (night: outlined)
<KidChip index={1} name={kids[1]} detail="reads" active />                    // devotion turns
<KidPicker label="Whose hunt" value={kid} onChange={setKid} names={kids}
  details={['6 found', '4 found', '0 found']} progress={[6/11, 4/11, 0]} />      // hunt switcher: radiogroup, arrow keys, progress rings
```

`KidChip` with `onClick` is a toggle (`aria-pressed`) with a 44 pt hit area; for choosing one kid use `KidPicker`.

### Overlays

```tsx
<Sheet open={open} onOpenChange={setOpen} title="Quaking aspen leaf"
  footer={<Button variant="primary" size="lg" block>Found it</Button>}>…</Sheet>   // Vaul; the page behind scales
toast({ title: 'Saved', body: 'On this device.', icon: Check })                    // one at a time, aria-live
toast({ title: 'Update ready', action: { label: 'Reload', onClick } })             // stays until acted on or dismissed (X, or swipe down)
announce('6 of 11 found')                                                           // screen readers only; see Accessibility
<NightVisionOffer />                                                                // after Dark only (force to always show)
<Fold summary="2 earlier" detail="7:00 and 8:15" lead={<Checkbox checked decorative size={22} />}>…</Fold>
<EmptyState icon={Backpack} title="Nothing packed yet" action={<Button size="sm">Start</Button>}>…</EmptyState>
```

### Shell pieces you don't render

The shell already renders these:

- the tab bar (each Page renders its own scrim);
- page transitions: push/pop slide with parallax and dim; a tab switch fades the new page in on top of the old one, which holds still (no double exposure). The previous page stays mounted underneath (parked, inert), so back and the edge swipe never wait for a remount, and it keeps its scroll and state;
- the edge-swipe back gesture (installed app only, never on a tab's root page): both pages track your finger;
- focus moving to the new page's `<h1>` once a push, pop or tab switch has settled (not on a replace such as the Plan day switch);
- `html[data-after-dark]`, the screen-reader announcer, and the "Update ready" toast;
- the pre-paint theme script.

Sheets load lazily (Vaul ships with the sheet chunk, preloaded when idle); `Sheet` moves keyboard focus into itself and parks the scaled-back page on black.

To navigate from code:

```ts
import { navigate, goBack } from '@/ui';
navigate('/do/lundy');                         // push
navigate('/plan/sun', { replace: true });      // replace, no transition
goBack('/kids');                               // history back, or this path when opened cold
```

---

## Art: terrain and specimens

```tsx
import { Terrain, RouteLine, StopDot, MapLabel, WaterLabel, FRIDAY_DRIVE, stop, stopFeet, cropAround } from '@/art';

<Terrain region="route" crop={[0, 52, 420, 377]} fade="y" label="The drive from the Bay Area to Mammoth Lakes">
  <RouteLine points={FRIDAY_DRIVE} progress={p} />           {/* variant route | next (dashed ember) | muted */}
  <StopDot at={stop('route', 'tioga')!} kind="major" />      {/* minor | major | here */}
  <MapLabel at={stop('route', 'tioga')!} title="Tioga Pass" subAccent={`${stopFeet('tioga').toLocaleString()} ft`} sub="6:50 pm" />
  <MapLabel at={stop('route', 'olmsted')!} title="Olmsted Point" offset={[8, 10]} leader />
  <WaterLabel at={stop('route', 'monolake')!}>Mono Lake</WaterLabel>
</Terrain>
```

- **Coordinates** are map units with **east up**: x runs north to south, y runs east to west, and the drive goes bottom to top.
  - `route` is 420 × 1241 (the whole drive). `eastside` is 520 × 527 (the detail map).
  - `stop(region, key)` gives a stop's position, `project(region, lat, lon)` converts coordinates, and `REGIONS[region].stopElevation` gives elevations.
  - `eastToRoute(pt)` and `EAST_TO_ROUTE_TRANSFORM` draw eastside detail on the overview: `<g transform={EAST_TO_ROUTE_TRANSFORM}><Relief region="eastside" /></g>`.
  - `cropAround(region, center, width, aspect)` makes a crop, for example the Now card's map strip.
- **Relief** is pre-rendered WebP tiles per region and theme (`npm run relief`; light and dark at high resolution, night at low), with calm light and Mono Lake drawn as water. `reliefTiles(region, theme)` lists them. Draw only live overlays on top. Don't re-rasterize contours.
- The contour JSON is in `art/topo/`. It is not shipped.
- **Layers.** The relief sits in its own layer, which alone carries `fade`; the route fades with it, but stops and labels always stay at full strength. Extra relief (e.g. eastside detail) goes in `underlay`: `underlay={<g transform={EAST_TO_ROUTE_TRANSFORM}><Relief region="eastside" /></g>}`.
- **Sizes** inside overlays are CSS px. `useTerrain().k` gives px per map unit.
- **Camera** (the route story): a compositor transform over the base `crop`, never a viewBox animation.

  ```tsx
  const base: Crop = [0, 52, 420, 377];
  const cam = useCamera(cameraFor(base, base));       // or { x, y, zoom } motion values derived from scroll
  cam.to(cameraFor(base, cropAround('route', tioga, 200, 420 / 377)));   // spring.camera
  <Terrain region="route" crop={base} camera={cam}>…</Terrain>
  ```
  Strokes, dots and labels keep their screen size while it moves and snap exact when it settles. Author chapter framings as crops and convert with `cameraFor`. Keep zooms to about 3x or less: the relief is 5 px/unit (route) and 6 px/unit (eastside).
- The route's dark glow is two faint wide strokes (no filters), so drawing it with `progress` stays cheap.
- **Labels:**
  - Choose `side` so no label sits on the route line.
  - Use `offset` plus `leader` when stops crowd.
  - Drop minor stops at overview zoom.
  - Use the signed elevation (`stopFeet('tioga')` gives 9,945), not the tile value.

```tsx
import { Specimen, Leaf, specimenSilhouette, SPECIMEN_IDS } from '@/art';
<div className="h-20 w-20"><Specimen id="aspen" found={isFound} /></div>   // outline to look for → fall color
<Leaf pigment="green" | "gold" | "red" />                                  // leaves explainer
specimenSilhouette('aspen')                                                // path data (96×96) for found-burst particles
```

- Every hunt id in `src/content/kids.js` has art.
- Specimens size to their container and share one optical size (longest side 70 of 96, centered on the drawing's visual center), except `big`, which is drawn oversized on purpose. Leaves lean −12°.
- Hunt tiles must be `<button data-hunt-item={id} aria-pressed={found}>`, because the offline test clicks `[data-hunt-item="aspen"]`.

---

## Motion

Import from `@/ui` (`spring`, `fadeUp`, `stagger`, `usePress`, `useCalm`, `useFirstVisit`). The whole app runs inside `<MotionConfig reducedMotion="user">`.

| Spring | Family | Use |
|---|---|---|
| `spring.snap` | settle | presses, knobs, tiny state |
| `spring.glide` | settle | page push/pop, card → detail, layout |
| `spring.indicator` | settle | tab lens, segmented thumb, stepper lens |
| `spring.sheet` | settle | custom sheets |
| `spring.camera` | settle | map camera, viewBox moves |
| `spring.enter` | settle | content entering (fade-up) |
| `spring.fill` | settle | progress bars and rings |
| `spring.pop` | alive | check fill, pip fill, badge in |
| `spring.bounce` | alive | the hunt "found it" jump only |

- **Settle** (no bounce) for navigation and layout. **Alive** (small bounce) only where someone just did something.
- Nothing loops except live indicators. Animate light (opacity, glow, color) more than position.
- **List entrances** play on first mount per session only. Restored views appear instantly.

  ```tsx
  const first = useFirstVisit('hunt-grid');
  <motion.ul initial={first ? 'hidden' : false} animate="show" variants={stagger(items.length)}>
    {items.map((i) => <motion.li key={i.id} variants={fadeUp}>…</motion.li>)}
  </motion.ul>
  ```
- **Press** with a 60 ms delay so scrolling never flashes a pressed state. `Card`, `Button`, `Chip` and `Pressable` already do this. For custom elements:

  ```tsx
  const press = usePress();
  <motion.button {...press.bind} animate={{ scale: press.pressed ? pressScale.tile : 1 }} transition={press.transition} />
  ```
  Scales: cards .97, buttons .96, small .94, kid tiles .92.
- **Reduced motion.** Every effect needs an opacity-only or instant fallback.
  - `const calm = useCalm();` tells you when to fall back.
  - `MotionConfig` already drops transforms. Check `calm` for anything that must still convey state (particles off, `aria-live` announcement instead).
- **Timing notes:**
  - A check-off reflows after 600 ms (`useSettledOrder`).
  - The countdown uses `NumberRoller`.
  - A shared-element `layoutId` must be unique app-wide, so prefix it with your area (`hunt-…`, `plan-…`).

---

## Accessibility checklist

- [ ] One `<h1>` (via `Page`), then `h2` sections in order. The shell provides `<main>`.
- [ ] Every control has a name. `IconButton` needs `label`, `Segmented` needs `label`, and `Switch` needs `label`.
- [ ] Toggles expose `aria-pressed` or `aria-checked`. Hunt tiles use `aria-pressed`.
- [ ] Targets are ≥ 44 × 44 pt, with visible focus rings (don't remove outlines). Focus rings are neutral ink (`--focus`) in every theme.
- [ ] Contrast: use tokens only; `npm run contrast` passes.
- [ ] Progress uses `role="progressbar"` with a spoken `valueText`, and the countdown uses `role="timer"` with a spoken label.
- [ ] Art is `aria-hidden` unless it carries information; if it does, pass `label`.
- [ ] Changes that matter are announced. Use `announce('6 of 11 found')` from `@/ui` (one shared, visually hidden live region; `announce(text, 'assertive')` only for something that must interrupt). `toast()` is for things everyone should see; don't use it just to reach screen readers, and don't add your own `aria-live` regions.
- [ ] Reduced motion: no movement-only feedback.
- [ ] Text scales with Dynamic Type. Use rem type classes and don't fix heights on text containers.
- [ ] Check in light, dark and night, on iPhone and iPad.

---

## Copy

- Plain, short and useful: "Leave by 10:50", "Last gas for 59 miles", "Tap a picture when you find it."
- Avoid themed or lyrical language: no "field notes", journals, stamps, "adventure awaits", or puns.
- Title the day plainly (from `trip.js`). Use sentence case everywhere except eyebrows (which uppercase via CSS).
- Never use real names or the home city. Kids are `useKids()` (defaults "Kid 1/2/3"), and home is "Bay Area".
- Numbers:
  - Times look like "9:30 am"; use `timeParts` from `src/lib/time.ts` for "9:30" + "am".
  - Durations look like "1 hr 15 min".
  - Distances look like "1.4 mi".
  - Elevations look like "9,945 ft".

---

## Build, test, screenshot

```sh
npm run dev                      # http://localhost:5173/#/_kit
npm run build                    # tsc + vite; must be clean
node scripts/test-offline.mjs    # serves dist/, goes offline, visits every route: must print PASS
npm run contrast                 # token contrast in all three themes
npm run relief                   # re-render terrain rasters + src/art/terrain-data.ts (only if art/topo changes)
```

Screenshots cover iPhone 390 × 844 @2x and iPad 820 × 1180 @2x, in light, dark and night:

```sh
npx vite preview --port 4173 --strictPort &      # or npm run dev and BASE=http://localhost:5173/
BASE=http://localhost:4173/ OUT=shots node scripts/shoot.mjs /kids/hunt /_kit
# env: THEMES=light,dark,night  DEVICES=phone,ipad  FULL=1 (whole page)  NOW=2026-10-10T09:30:00-07:00 (trip time)
```

The script sets the theme and night vision through localStorage (`falltrip:theme`, `falltrip:nightVision`) and preview time through `falltrip:debugNow`. For a one-off Playwright check:

```js
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark' });
await ctx.addInitScript(() => localStorage.setItem('falltrip:theme', '"dark"'));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/#/kids/hunt');
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'hunt-dark.png' });
```

Look at every screenshot yourself before calling a screen done, and compare it with the prototype frames in `docs/design/shots/`.
