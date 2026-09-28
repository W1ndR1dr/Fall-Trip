// Today's data: the itinerary as a timeline, "now / next", leave-by times,
// whose turn it is, conditions, and the counts the home tiles show.
// Everything is derived from src/content; nothing here is invented.
import { conditions } from '@/content/conditions.js';
import { daily, moments, bonus } from '@/content/devotions.js';
import { hunt } from '@/content/kids.js';
import { packing } from '@/content/packing.js';
import { beforeWeGo, colorReport, days, menu, sun, weather } from '@/content/trip.js';
import type { StopKey } from '@/art/geo';
import { get } from '@/lib/store';
import { tripDay, type TripDayId } from '@/lib/time';

export type Day = (typeof days)[number];
export type Item = Day['items'][number] & {
  drive?: string;
  stay?: string;
  menu?: string[];
  devotion?: string | null;
  maps?: { q?: string; daddr?: string } | null;
  anchor?: boolean;
  choices?: string[];
};
export type MenuEntry = (typeof menu)[number] & { walk?: string; wc?: string; kind?: string; hours?: string; maps?: { q?: string } | null };
export type TimelineItem = Item & { day: Day; at: Date; index: number };

export const DAY_IDS: TripDayId[] = ['fri', 'sat', 'sun'];

/** Every itinerary item across the weekend, in order, with its Date. */
export const TIMELINE: TimelineItem[] = days.flatMap((d) => (d.items as Item[]).map((it) => ({ ...it, day: d, at: new Date(it.t), index: 0 }))).map((it, index) => ({ ...it, index }));

export const dayById = (id: TripDayId) => days.find((d) => d.id === id)!;
export const menuById = (id: string) => (menu as MenuEntry[]).find((m) => m.id === id);

/** "Conway Summit overlook: cocoa stop" → title + kicker. "Choose: x" → x. */
export function splitTitle(title: string): { title: string; kicker?: string } {
  if (title.startsWith('Choose: ')) {
    const t = title.slice(8);
    return { title: t[0].toUpperCase() + t.slice(1) };
  }
  const i = title.indexOf(': ');
  if (i < 0) return { title };
  const k = title.slice(i + 2).replace(/^"|"$/g, '');
  // "LAST GAS for 59 miles" → "Last gas for 59 miles"
  const kicker = k.replace(/^[A-Z ]{3,}(?=\s|$)/, (m) => m[0] + m.slice(1).toLowerCase());
  return { title: title.slice(0, i), kicker: kicker[0].toUpperCase() + kicker.slice(1) };
}

/**
 * Minutes in a drive string: "~10 min" → 10, "~1 hr 10 from Oakdale" → 70,
 * "~2 hr to Oakdale" → 120, "~20–35 min" → 35 (the safe end of a range).
 */
export function driveMinutes(drive?: string): number | null {
  if (!drive) return null;
  const s = drive.replace(/~/g, '');
  const hr = s.match(/(\d+(?:\.\d+)?)\s*hr(?:\s*(\d+))?/);
  if (hr) return Math.round(Number(hr[1]) * 60 + (hr[2] ? Number(hr[2]) : 0));
  const range = s.match(/(\d+)\s*[–-]\s*(\d+)\s*min/);
  if (range) return Number(range[2]);
  const min = s.match(/(\d+)\s*min/);
  return min ? Number(min[1]) : null;
}

/** "10 min drive", "1 hr 10 min drive" from a drive string. */
export function driveLabel(drive?: string): string | null {
  const m = driveMinutes(drive);
  if (m == null) return null;
  const lo = drive?.match(/(\d+)\s*[–-]\s*\d+\s*min/);
  if (lo) return `${lo[1]}–${m} min drive`;
  return `${fmtDuration(m)} drive`;
}

/** 75 → "1 hr 15 min", 45 → "45 min", 120 → "2 hr". */
export function fmtDuration(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r} min`;
  return r ? `${h} hr ${r} min` : `${h} hr`;
}
/** Short form for tight labels: "1 hr 15", "45 min". */
export function fmtShort(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r} min`;
  return r ? `${h} hr ${r}` : `${h} hr`;
}

const sameDay = (a: Date, b: Date) => tripDay(a) === tripDay(b) && tripDay(a) !== null;

export type NowState = {
  /** The item happening now (null before the first item). */
  current: TimelineItem | null;
  /** Upcoming items (all remaining). */
  upcoming: TimelineItem[];
  /** The next item, when it is later the same day. */
  nextToday: TimelineItem | null;
  /** Leave-by moment for the next item (its start minus its drive). */
  leaveBy: Date | null;
  /** The span the progress bar covers: current start → leave-by (or next start). */
  span: { start: Date; end: Date } | null;
};

export function nowState(now: Date): NowState {
  const t = now.getTime();
  const idx = TIMELINE.findIndex((it) => it.at.getTime() > t);
  const current = idx === 0 ? null : TIMELINE[idx === -1 ? TIMELINE.length - 1 : idx - 1];
  const upcoming = idx === -1 ? [] : TIMELINE.slice(idx);
  const nx = upcoming[0] ?? null;
  const nextToday = nx && current && sameDay(nx.at, current.at) ? nx : null;
  let leaveBy: Date | null = null;
  if (nextToday) {
    const d = driveMinutes(nextToday.drive);
    if (d != null) leaveBy = new Date(nextToday.at.getTime() - d * 60e3);
    if (leaveBy && current && leaveBy <= current.at) leaveBy = null;
  }
  const end = leaveBy ?? nextToday?.at ?? null;
  const span = current && end ? { start: current.at, end } : null;
  return { current, upcoming, nextToday, leaveBy, span };
}

// ---------------------------------------------------------------------------
// Places: which map stop an item happens at.

const BY_MENU: Record<string, StopKey> = {
  lundy: 'lundy', conway: 'conway', southtufa: 'southtufa', panum: 'southtufa', basincafe: 'leevining', monomarket: 'leevining', whoanellie: 'leevining',
  leavesloop: 'junelake', juneloop: 'junelake', oakdalecheese: 'oakdale', bloomingcamp: 'oakdale', aroundthehorn: 'groveland', prieststation: 'groveland',
  stellar: 'mammoth', goodlife: 'mammoth', blackvelvet: 'mammoth', bookyjoint: 'mammoth', rmcf: 'mammoth', johnspizza: 'mammoth', eatery: 'mammoth', burgers: 'mammoth', stars: 'mammoth',
  olmsted: 'olmsted', tenaya: 'tenaya',
};
const BY_TITLE: [RegExp, StopKey][] = [
  [/Lundy/i, 'lundy'],
  [/Conway/i, 'conway'],
  [/South Tufa/i, 'southtufa'],
  [/Lee Vining/i, 'leevining'],
  [/Tioga Pass/i, 'tioga'],
  [/Tenaya/i, 'tenaya'],
  [/Olmsted/i, 'olmsted'],
  [/Crane Flat/i, 'craneflat'],
  [/Big Oak Flat/i, 'craneflat'],
  [/Groveland/i, 'groveland'],
  [/Oakdale/i, 'oakdale'],
  [/Mammoth/i, 'mammoth'],
  [/Leave home|Pack the car/i, 'bayarea'],
];

/** The map stop for an item (by title, then its first menu entry). */
export function placeOf(it: Item): StopKey | null {
  for (const [re, k] of BY_TITLE) if (re.test(it.title)) return k;
  // Items at the lodging in the evening and morning: Mammoth.
  if (it.kind === 'lodging' || it.kind === 'cozy') return 'mammoth';
  for (const m of it.menu ?? []) if (BY_MENU[m]) return BY_MENU[m];
  if (/sunrise|morning light|devotion|dinner|stargazing|journal/i.test(it.title) && it.t.startsWith('2026-10-1')) return 'mammoth';
  return null;
}

/** Maps query for an item: its own, else its first menu entry's. */
export function mapsFor(it: Item): { q?: string; daddr?: string } | null {
  if (it.maps) return it.maps;
  for (const id of it.menu ?? []) {
    const m = menuById(id);
    if (m?.maps) return m.maps;
  }
  return null;
}

/** Walk and restroom facts from an item's menu entry (the first with any). */
export function factsFor(it: Item): { walk?: string; wc?: string; hours?: string } | null {
  for (const id of it.menu ?? []) {
    const m = menuById(id);
    if (m && (m.walk || m.wc)) return { walk: m.walk, wc: m.wc };
  }
  return null;
}

/** "~1–2 mi RT, gentle" → "1–2 mi round trip, gentle". */
export const cleanWalk = (w: string) => w.replace(/~/g, '').replace(/\bRT\b/, 'round trip');
/** Restroom line: "None at trailhead; use Lee Vining" → "No restrooms at the trailhead. Use Lee Vining." */
export function cleanWc(wc: string): string | null {
  if (!wc || wc === '—') return null;
  if (/^none at trailhead/i.test(wc)) return 'No restrooms at the trailhead' + (wc.includes(';') ? `; ${wc.split(';')[1].trim().replace(/^use/, 'use')}` : '');
  if (/^none$/i.test(wc)) return 'No restrooms';
  if (/^yes$/i.test(wc)) return 'Restrooms';
  return 'Restrooms: ' + wc[0].toLowerCase() + wc.slice(1);
}

// ---------------------------------------------------------------------------
// Devotions and turns (same order and rule as the old app: 'turn:<id>').

export type Devotion = (typeof daily)[number] | (typeof moments)[number] | (typeof bonus)[number];
export const allDevotions = (): Devotion[] => [...daily, ...moments, ...bonus];
export const findDevotion = (id?: string | null) => (id ? allDevotions().find((d) => d.id === id) : undefined);

/** Whose turn to read and pray (indexes into the kids list). */
export function turns(id: string, nudge: number): { reader: number; prayer: number } {
  const order = [...daily, ...moments].map((d) => d.id);
  const i = Math.max(0, order.indexOf(id));
  return { reader: (i + nudge) % 3, prayer: (i + nudge + 1) % 3 };
}

/** The first daily devotion not marked done (by day order), else the first. */
export function nextDevotion(isDone: (id: string) => boolean) {
  return daily.find((d) => !isDone(d.id)) ?? daily[0];
}

export const readRef = (d: Devotion) => (d.read ?? []).join(' · ');

// ---------------------------------------------------------------------------
// Counts for the home tiles (the old checklist id formats).

export const HUNT_MAIN = hunt.filter((h) => !(h as { bonus?: boolean }).bonus).length;
export const PACK_TOTAL = packing.reduce((n, g) => n + g.items.length, 0);
export const PACK_IDS = new Set(Array.from({ length: PACK_TOTAL }, (_, i) => `pack-${i}`));
export const BEFORE_TOTAL = beforeWeGo.checklist.length;
export const BEFORE_IDS = new Set(Array.from({ length: BEFORE_TOTAL }, (_, i) => `before-${i}`));
export const ACTIVITY_COUNT = (menu as MenuEntry[]).filter((m) => m.kind !== 'food').length;
export const FOOD_COUNT = (menu as MenuEntry[]).filter((m) => m.kind === 'food').length;

/** Journal lines written (non-empty `journal:<day>:<i>` for five people). */
export function journalCount(): number {
  let n = 0;
  for (const d of DAY_IDS) for (let i = 0; i < 5; i++) if (String(get(`journal:${d}:${i}`, '') ?? '').trim()) n++;
  return n;
}

// ---------------------------------------------------------------------------
// Color report

export const COLOR_SCALE = colorReport.scale as readonly string[];
export const TOP_SPOT = colorReport.spots[0];
/** "Near Peak → Peak" → "near peak". */
export const spotStatus = (proj: string) => proj.split('→')[0].trim().toLowerCase();

// ---------------------------------------------------------------------------
// Conditions: temps, Tioga Road, moon.

export type DayWeather = { hi: number; lo: number; place: string; source: 'forecast' | 'normal' };

const DAY_NAME: Record<TripDayId, string> = { fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

/** The day's high/low: the NWS forecast once it covers the trip, else the normals. */
export function weatherFor(day: TripDayId): DayWeather {
  const place = 'Mammoth Lakes';
  const f = conditions.forecasts.find((x) => x.place === place && x.onTrip);
  if (f) {
    const name = DAY_NAME[day];
    const hi = f.periods.find((p) => p.name === name);
    const lo = f.periods.find((p) => p.name === `${name} Night`);
    const n = (s?: string) => (s ? Number.parseInt(s, 10) : NaN);
    if (hi && lo && !Number.isNaN(n(hi.temp)) && !Number.isNaN(n(lo.temp))) return { hi: n(hi.temp), lo: n(lo.temp), place, source: 'forecast' };
  }
  const w = weather.places.find((p) => p.name === place)!;
  return { hi: w.hi, lo: w.lo, place, source: 'normal' };
}

/** Tioga Road status from the NPS text in conditions.js. */
export function tiogaStatus(): { open: boolean | null; delay?: string } {
  const s = conditions.tioga ?? '';
  const m = s.match(/Tioga Road[\s\S]*?\b(Open|Closed|Temporarily closed)\b/);
  const d = s.match(/(\d+)-minute delays in Tuolumne Meadows/);
  return { open: m ? m[1] === 'Open' : null, delay: d ? `${d[1]}-min delays at Tuolumne` : undefined };
}

/** "New Moon" on Saturday; the moon's phase otherwise ("1% moon"). */
export function moonFor(day: TripDayId): { label: string; newMoon: boolean } {
  const m = (sun as Record<TripDayId, { moon: string }>)[day].moon;
  if (/new moon/i.test(m)) return { label: 'New Moon', newMoon: true };
  const pct = m.match(/(\d+)%/);
  return { label: pct ? `${pct[1]}% moon` : m, newMoon: false };
}

export const SUN = sun as Record<TripDayId, { date: string; sunrise: string; sunset: string; goldenAM: string; goldenPM: string; dark: string; moon: string }>;
