# Decisions log

Each entry records who decided (**Family**, meaning you answered at a checkpoint, or **Default**, meaning I chose it and you can overrule) and why.

> Privacy note: this repo is **public**, so this file uses no names. Kids are referred to by age.

## Checkpoint 1: Intake (2026-09-27)

| # | Decision | Who | Why / notes |
|---|---|---|---|
| 1 | Lodging budget: **$250+/night is OK, but it has to be worth it**. A cozy place to hole up in is part of the charm. | Family | Prompted a value-per-dollar comparison and an "is it too late / should we shift dates?" analysis. |
| 2 | Kitchen and fireplace: **neither required, both a bonus**. Hotel plus eating out is fine; cocoa and lattes can come from cafés. | Family | Used as a tiebreaker in lodging picks, not a filter. |
| 3 | Kids' names are **entered on-device at runtime** and stored only in `localStorage`. They never appear on the site or in the repo. | Family | Public site plus public repo. |
| 4 | Kids are into **animals & tracks, rocks & volcanoes, stars & moon, drawing & crafts**. | Family | Drives an animal-tracks page, rock/volcano spotting (tufa, obsidian, Hot Creek), a star finder tied to the moon phase, and drawing/journal prompts. |
| 5 | Family vibe list: **apples/caramel apples, fall colors, hot chocolate/lattes/coffee, reading in a cozy corner, fall walks, crisp air, beautiful mornings**. | Family | Drives the cozy-café picks, a caramel apple stop/recipe, "read-aloud corner" suggestions, and morning golden-hour moments. |
| 6 | **Dates and location are flexible** as long as the fall color and beauty are great. | Family | Research was widened to Oct 2–4, Oct 9–11 (holiday weekend: Mon Oct 12 is Indigenous Peoples' Day), and Oct 16–18, plus a closer sanity-check region (Hope Valley, CA-88). |
| 7 | Activities are an **optional menu, not a schedule**. "We like flexibility but options." | Family | Itinerary = a light spine of anchors (drive, lodging, meals, a devotion). Everything else is pick-what-sounds-good cards grouped by place, time needed, and energy level. |
| 8 | **Animations are driven by JavaScript** (`requestAnimationFrame`; canvas for falling leaves and celebration bursts), not SVG/SMIL or CSS keyframes. Static art stays as drawn shapes. All motion stops under `prefers-reduced-motion`. | Family | Your instruction: "instead of SVG animate it in javascript" (interpreted as above; tell me if you meant something else). |
| 9 | **Beautiful scrollytelling, but a functional web app first.** "Interactive, functional, fun." | Family | Home opens as a scroll story (Bay Area → orchards → Tioga granite → Mono Lake → aspen gold) with JS-driven parallax, ending in the practical Today dashboard. "Why leaves change" is a scroll-driven explainer. Everything practical is one tap away in the tab bar. |

## Checkpoint 2 + 3: The plan and the look (2026-09-27)

| # | Decision | Who | Why / notes |
|---|---|---|---|
| 10 | **Dates: Fri Oct 9 – Sun Oct 11, 2026.** | Family (recommended) | The color band that weekend is 7,600–8,600 ft (Conway Summit, Lundy, June Lake Loop, Monitor), projected near peak to peak. New Moon Sat Oct 10. CPC leans warm, dry, and calm through Oct 10. Tioga has never had its seasonal closure before Oct 17 (NPS/Mono Basin Research, 1980–2025). |
| 11 | **Departure scenario A: leave Friday at noon.** | Family (recommended) | Oakdale ~2:00, Groveland ~3:45, Crane Flat gas ~4:30, Olmsted Point/Tenaya in golden hour (~5:50–6:25), Tioga at sunset, Mammoth ~7:45–8:15. Gives two nights in the cozy lodging, a full Saturday, and Sunday morning. Scenario B (foothill night) costs about the same money but loses Friday night and Saturday morning on the East Side. A straight 6 pm drive would arrive ~1 am, so that was rejected. |
| 12 | **Skip Bishop Creek.** | Default | High lakes are likely past peak by Oct 9–11, Lake Sabrina has dam work Mon–Sat, and it's 73+ min from Mammoth. The plan follows the color zone north toward Tioga instead. Bishop Creek stays in the menu as a long optional drive. |
| 13 | **Base: Mammoth Lakes.** "Walkable is fun." | Family | June Lake and Lee Vining are nearly sold out on the holiday weekend (Leaves in the Loop + Bridgeport Oktoberfest + Indigenous Peoples' Day). Mammoth has the supply, cafés, the caramel apple shop, and the bookstore. |
| 14 | **Lodging: not yet chosen.** A dedicated Hotwire Hot Rate triangulation is running. Current benchmarks: Juniper Springs ~$393/nt all-in (free cancel), Village Lodge ~$472 (walkable), Airbnb 2BR condo ~$270. | Family asked for the Hotwire deep dive | The app never shows the lodging name or address publicly. You enter it on-device (Settings) for the Maps button. |
| 15 | **Sunday route: decide on the day.** The app offers (a) Tioga + Tenaya picnic + farm stop, and (b) Sonora Pass + Columbia Harvest Festifall / Railtown, with the car-sickness warning. | Family | Flexibility. |
| 16 | ~~**Look: Aspen Gold by day, Harvest Evening by night**~~ (superseded by #17) (follows the iPhone Light/Dark setting, with a manual override). Young Serif + Atkinson Hyperlegible; Andika for kid-reader mode. | Family (recommended) | Readable in bright sun, cozy and low-glare at night and for stargazing. |

| 17 | ~~**Redesign: "The Field Journal."**~~ (superseded by #19) "You can do SO much better… much more handcrafted, high-touch feel… scrap all of these and go a new direction." Every screen is a page in a hand-bound naturalist's journal: cotton paper, pasted-in slips with hand-cut (deckled) edges, washi tape, kraft tags, typed labels, rubber stamps, pencil notes. Art is ink + watercolor, painted procedurally in SVG and baked to WebP (`art/`, `scripts/paint.mjs`), so it looks identical on every device and costs nothing to render offline. Type: IM Fell English (letterpress titles), Alegreya (reading), Kalam (handwriting), Courier Prime (typed labels), Andika (big-print kid reader). Night mode is "by lantern light." | Family (direction), Default (execution) | Home is a cloth-bound cover with a gold-foil aspen and a luggage-tag countdown that lifts open as you scroll. Then our route inks itself across a hand-painted map (east is up) while the view pans with the pen. The leaf hunt presses painted specimens into the page with tape and a FOUND stamp. Devotions are prayer cards with a ribbon and a gilt drop cap. |
| 18 | **Lodging: Hotwire triangulation complete.** Best Hot Rate = "3.5★ All-suites" = **The Village Lodge (~99%)**, 2-BR condo $347/nt ($693 total), non-refundable, and Hotwire caps a room at 4 guests (the property allows 6). Suggested: hold The Village Lodge direct (refundable, $944), call Mammoth Lodging Collection about adding a 5th guest to a Hotwire booking, and switch if yes. | Family decides | See research-notes.md → Hotwire. |

| 19 | **Design: beautiful and intentional, with no theme costume.** "No need to be so kitschy… Beauty in design, not silly theme language or flowery copy without purpose." Dropped the journal conceit (page numbers, flyleaf, stamps, tape, kraft tags, themed copy). Kept what earns its place: the hand-painted watercolor art (now the main imagery, with a new 3× hero painting), the self-drawing route map, the scroll-driven leaf explainer, and JS micro-interactions (pen-drawn checks, blooming finds). Type: Instrument Serif (display), Instrument Sans (UI), Newsreader (Scripture and reading), Andika (large print). One accent (forest green; gold in dark mode). Copy is plain and useful. | Family (direction), Default (execution) | Warm paper with a subtle grain, precise spacing, and restrained motion. |
| 20 | **Go with the recommendations across the board** ("As recommended for all"): Oct 9–11, leave at noon, base in Mammoth, hold The Village Lodge (refundable) while confirming a 5th guest for the Hotwire rate, decide the Sunday route on the day, publish on GitHub Pages, keep the current level of trip detail. | Family | |

## Defaults I chose

| # | Decision | Why |
|---|---|---|
| D1 | **Vanilla JS + a tiny Node build script**, no framework. | Smallest payload and simplest offline story. Nothing to break in a canyon. |
| D2 | **Fonts self-hosted** (OFL-licensed, from npm `@fontsource`), no Google Fonts CDN at runtime. | Offline-first; no third-party requests. |
| D3 | The site says **"Bay Area"**, never the home city or street. Travel dates appear only as the trip dates. | Public site: avoid broadcasting "home is empty" details beyond what's needed. Flagged for Checkpoint 4. |
| D4 | **No analytics, no trackers, no external runtime requests.** Outbound links (maps, reports, Bible app) open only when tapped. | Privacy and offline. |
| D5 | Names of parents and kids are kept **out of the repo entirely** (including these docs). | The repo is public. |
| D6 | **Whoa Nellie Deli is a "bonus if open."** It is not relied on for Friday dinner; Friday dinner is Groveland takeout eaten as a Tioga picnic. | Its 2026 closing date conflicts ("first week in October" vs "last Sunday in October"). |
| D7 | **Devotion pairings** are chosen for place: Psalm 19:1–2 at Olmsted Point (granite + sky "pouring out speech"); Psalm 104:10–12 at South Tufa (spring-built towers + birds); Job 12:7–10 at the Lundy beaver ponds ("ask the beasts"); Psalm 96:12 in a breezy aspen grove (quaking leaves "clap"); Psalm 147:4 + 8:3–4 under the New Moon sky; Genesis 8:22 on Friday's drive (seedtime and harvest past the orchards); Genesis 1:11–12 Saturday in the first grove; Psalm 118:24 + Ecclesiastes 3:11 Sunday (Lord's Day). Memory verse: **Ecclesiastes 3:1** (short, rhythmic, and it's the trip's theme). | Each passage meets the kids where they stand. |
| D8 | **YouVersion note corrected:** downloading ESV/NIV enables offline *reading*; YouVersion audio can't be downloaded, so it needs a signal. | Verified on YouVersion help pages. |

