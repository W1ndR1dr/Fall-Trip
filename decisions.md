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

## Defaults I chose

| # | Decision | Why |
|---|---|---|
| D1 | **Vanilla JS + a tiny Node build script**, no framework. | Smallest payload and simplest offline story. Nothing to break in a canyon. |
| D2 | **Fonts self-hosted** (OFL-licensed, from npm `@fontsource`), no Google Fonts CDN at runtime. | Offline-first; no third-party requests. |
| D3 | The site says **"Bay Area"**, never the home city or street. Travel dates appear only as the trip dates. | Public site: avoid broadcasting "home is empty" details beyond what's needed. Flagged for Checkpoint 4. |
| D4 | **No analytics, no trackers, no external runtime requests.** Outbound links (maps, reports, Bible app) open only when tapped. | Privacy and offline. |
| D5 | Names of parents and kids are kept **out of the repo entirely** (including these docs). | The repo is public. |
