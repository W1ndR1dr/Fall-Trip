// Typed access to the trip content for the Plan screens, plus the timeline
// model: which item is happening now, which leg is being driven, leave-by
// times, choice options, and Sunday's route steps. No facts live here; they
// all come from src/content/*.js.
import { days, menu, routes, sun, weather, beforeWeGo, RETRIEVED } from '@/content/trip.js';
import { daily, moments, bonus } from '@/content/devotions.js';
import { packing } from '@/content/packing.js';
import { conditions } from '@/content/conditions.js';
import { timeParts, type TripDayId } from '@/lib/time';

// ---------------------------------------------------------------------------
// Content types

export type MapsQuery = { q?: string; daddr?: string; ll?: string };

export type PlanItem = {
  t: string;
  title: string;
  text: string;
  kind: string;
  anchor?: boolean;
  drive?: string;
  stay?: string;
  menu?: string[];
  devotion?: string | null;
  maps?: MapsQuery | null;
  choices?: string[];
};

export type PlanDayData = { id: TripDayId; label: string; date: string; title: string; blurb: string; items: PlanItem[] };
export type MenuEntry = { id: string; name: string; maps?: MapsQuery | null; area?: string; kind?: string; time?: string };
export type RouteData = { title: string; summary: string; legs: [string, string][]; note: string };
export type Devotion = { id: string; title: string; day?: string; stop?: string; kind: 'daily' | 'moment' | 'bonus' };
export type Forecast = { place: string; onTrip: boolean; updated: string; periods: { name: string; temp: string; wind: string; text: string; detail: string }[] };
export type Conditions = { retrieved: string; forecasts: Forecast[]; tioga: string | null; roads: Record<string, string>; errors: string[] };
export type SunDay = { date: string; sunrise: string; sunset: string; goldenAM: string; goldenPM: string; dark: string; moon: string };
export type LiveLink = { name: string; url: string; why: string };

export const DAYS = days as unknown as PlanDayData[];
export const DAY_IDS: TripDayId[] = ['fri', 'sat', 'sun'];
export const MENU = menu as unknown as MenuEntry[];
export const ROUTES = routes as unknown as Record<string, RouteData>;
export const SUN = sun as unknown as Record<TripDayId, SunDay>;
export const WEATHER = weather as unknown as { note: string; places: { name: string; elev: string; hi: number; lo: number }[]; outlook: string };
export const BEFORE = beforeWeGo as unknown as { links: LiveLink[]; checklist: string[] };
export const PACKING = packing as unknown as { group: string; note?: string; items: string[] }[];
export const CONDITIONS = conditions as unknown as Conditions;
export { RETRIEVED };

export const dayById = (id: string | undefined): PlanDayData | undefined => DAYS.find((d) => d.id === id);
export const menuById = (id: string) => MENU.find((m) => m.id === id);

const DEVOTIONS: Devotion[] = [
  ...(daily as unknown as Devotion[]).map((d) => ({ ...d, kind: 'daily' as const })),
  ...(moments as unknown as Devotion[]).map((d) => ({ ...d, kind: 'moment' as const })),
  ...(bonus as unknown as Devotion[]).map((d) => ({ ...d, kind: 'bonus' as const })),
];
export const devotionById = (id: string | null | undefined) => (id ? DEVOTIONS.find((d) => d.id === id) : undefined);

/** "Saturday devotion" for the daily ones, the moment's own title otherwise. */
export function devotionLabel(dv: Devotion): string {
  if (dv.kind === 'daily') return `${dayById(dv.day ?? dv.id)?.label ?? ''} devotion`.trim();
  return dv.title;
}

/** The devotion pinned to an item, plus any moment pinned to one of its places. */
export function devotionsFor(item: PlanItem): Devotion[] {
  const out: Devotion[] = [];
  const main = devotionById(item.devotion);
  if (main) out.push(main);
  for (const m of DEVOTIONS) if (m.kind === 'moment' && m.stop && item.menu?.includes(m.stop) && !out.some((d) => d.id === m.id)) out.push(m);
  return out;
}

// ---------------------------------------------------------------------------
// Times and durations

export const ms = (iso: string) => new Date(iso).getTime();
export const MIN = 60_000;

/** "9:30" and "am". */
export const tp = (d: Date | string | number) => timeParts(new Date(d));
/** "9:30 am" */
export const hm = (d: Date | string | number) => {
  const { time, period } = tp(d);
  return `${time} ${period}`;
};

/** 15 → "15 min", 80 → "1 hr 20 min", 120 → "2 hr". */
export function fmtDur(min: number): string {
  const m = Math.max(0, Math.round(min));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} hr ${r} min` : `${h} hr`;
}

/** Spoken form: "1 hour 20 minutes". */
export function sayDur(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const r = m % 60;
  const hs = h ? `${h} hour${h === 1 ? '' : 's'}` : '';
  const rs = r || !h ? `${r} minute${r === 1 ? '' : 's'}` : '';
  return [hs, rs].filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Drive legs. `drive` strings look like "~10 min", "~20–35 min",
// "~1 hr 10 from Oakdale", "~2 hr to Oakdale".

const DUR = /^~?\s*(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?\s*(hr|min)\b(?:\s+(\d+)(?:\s*min\b)?)?/;

/** The longest plausible drive in minutes (so a leave-by time errs early). */
export function driveMinutes(drive: string | undefined): number | null {
  const m = drive ? DUR.exec(drive.trim()) : null;
  if (!m) return null;
  const top = Number(m[2] ?? m[1]);
  return m[3] === 'hr' ? top * 60 + Number(m[4] ?? 0) : top;
}

/** "~1 hr 10 from Oakdale" → "1 hr 10 min drive from Oakdale". */
export function driveLabel(drive: string): string {
  const s = drive.trim().replace(/^~\s*/, '');
  const m = DUR.exec(s);
  if (!m) return s;
  const amount = m[3] === 'hr' ? `${m[1]}${m[2] ? `–${m[2]}` : ''} hr${m[4] ? ` ${m[4]} min` : ''}` : `${m[1]}${m[2] ? `–${m[2]}` : ''} min`;
  const rest = s.slice(m[0].length).trim();
  return `${amount} drive${rest ? ` ${rest}` : ''}`;
}

/**
 * The drive that arrives at item i: its own `drive`, or, when the item before
 * it is itself a drive ("Leave home", "Drive north to Lundy Canyon"), that
 * item's outgoing drive.
 */
export function legInto(items: PlanItem[], i: number): { label: string; minutes: number | null } | null {
  const it = items[i];
  if (it.drive && it.kind !== 'drive') return { label: driveLabel(it.drive), minutes: driveMinutes(it.drive) };
  const prev = items[i - 1];
  if (prev && prev.kind === 'drive' && prev.drive) return { label: driveLabel(prev.drive), minutes: driveMinutes(prev.drive) };
  return null;
}

// ---------------------------------------------------------------------------
// Timeline model

export type RowState = 'past' | 'now' | 'enroute' | 'upcoming';

export type Row = {
  item: PlanItem;
  i: number;
  start: number;
  /** When this item's own time ends: the leave-by for the next item, or the next start. */
  end: number;
  /** The drive that arrives here, if any. */
  leg: { label: string; minutes: number | null } | null;
  /** When to leave for this item (its start minus the arriving drive), if the drive starts after the previous item began. */
  leaveFor: number | null;
  state: RowState;
};

export type DayModel = {
  rows: Row[];
  /** 'today' when now is on this day, else before/after. */
  when: 'before' | 'today' | 'after';
  /** Index of the live row (now or en route), or -1. */
  live: number;
  /**
   * Where the now marker sits: in row `row` at fraction `p` (0..1). `leg`: on
   * the drive into that row. `before`: above the day's first item.
   */
  marker: { row: number; p: number; leg: boolean; before?: boolean } | null;
};

const DAY_START: Record<TripDayId, number> = { fri: ms('2026-10-09T00:00:00-07:00'), sat: ms('2026-10-10T00:00:00-07:00'), sun: ms('2026-10-11T00:00:00-07:00') };

export function dayModel(day: PlanDayData, now: number): DayModel {
  const items = day.items;
  const starts = items.map((it) => ms(it.t));
  const legs = items.map((_, i) => legInto(items, i));
  // Leave-by for item i: only meaningful when the drive begins after the
  // previous item starts (a prep reminder in the car doesn't end early).
  const leaveFor = items.map((_, i) => {
    const m = legs[i]?.minutes;
    if (!m || i === 0) return null;
    // Round down to 5 minutes: a leave-by errs early and reads cleanly (3:35, not 3:39).
    const lb = Math.floor((starts[i] - m * MIN) / (5 * MIN)) * 5 * MIN;
    const prev = items[i - 1];
    if (prev.kind === 'drive' && prev.drive) return null; // the drive item itself covers it
    return lb > starts[i - 1] ? lb : null;
  });
  const ends = items.map((_, i) => (i + 1 < items.length ? leaveFor[i + 1] ?? starts[i + 1] : starts[i] + 60 * MIN));
  const next = (i: number) => (i + 1 < items.length ? starts[i + 1] : ends[i]);

  const dayStart = DAY_START[day.id];
  const dayEnd = dayStart + 24 * 3600e3;
  const when = now < dayStart ? 'before' : now >= dayEnd ? 'after' : 'today';

  let live = -1;
  let marker: DayModel['marker'] = null;
  const state: RowState[] = items.map(() => 'upcoming');
  if (when === 'after') state.fill('past');
  if (when === 'today') {
    for (let i = 0; i < items.length; i++) {
      if (now >= next(i)) state[i] = 'past';
      else if (now >= ends[i]) {
        // Between this item's leave-by and the next start: on the road.
        state[i] = 'past';
      } else if (now >= starts[i]) {
        state[i] = 'now';
        live = i;
        marker = { row: i, p: (now - starts[i]) / Math.max(1, ends[i] - starts[i]), leg: false };
      }
    }
    if (live < 0) {
      // En route: the first upcoming item whose leave-by has passed.
      const j = items.findIndex((_, i) => state[i] === 'upcoming' && leaveFor[i] !== null && now >= leaveFor[i]! && now < starts[i]);
      if (j >= 0) {
        state[j] = 'enroute';
        live = j;
        marker = { row: j, p: (now - leaveFor[j]!) / Math.max(1, starts[j] - leaveFor[j]!), leg: true };
      } else if (state.every((s) => s === 'upcoming')) {
        marker = { row: 0, p: 0, leg: false, before: true };
      }
    }
    // The whole day is done: nothing to fold, nothing live.
    if (state.every((s) => s === 'past')) marker = null;
  }

  const rows: Row[] = items.map((item, i) => ({ item, i, start: starts[i], end: ends[i], leg: legs[i], leaveFor: leaveFor[i], state: state[i] }));
  return { rows, when, live, marker };
}

// ---------------------------------------------------------------------------
// Titles, stays, maps

/** "Choose: festival or quiet time" → "Festival or quiet time". */
export function displayTitle(item: PlanItem): string {
  let t = item.title.replace(/^Choose:\s*/i, '');
  if (item.kind === 'fuel' && t.includes(': ')) t = t.split(': ')[0];
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "Crane Flat: LAST GAS for 59 miles" → "Last gas for 59 miles" (an ember deadline tag). */
export function fuelWarning(item: PlanItem): string | null {
  if (item.kind !== 'fuel' || !item.title.includes(': ')) return null;
  const w = item.title.split(': ').slice(1).join(': ').toLowerCase();
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export const stayLabel = (stay: string | undefined) => (stay ? `Stay ${stay}` : null);

/**
 * Where the Maps button goes. The home base comes from Settings (never shown);
 * a place without its own query uses its single activity's.
 */
export function mapsFor(item: PlanItem, day: TripDayId, lodging: string): { query: MapsQuery; place: string } | null {
  if (item.kind === 'lodging' && item.anchor && day !== 'sun') return { query: lodging.trim() ? { daddr: lodging.trim() } : { q: 'Mammoth Lakes, CA' }, place: 'home base' };
  if (item.maps) return { query: item.maps, place: displayTitle(item) };
  if (item.menu?.length === 1) {
    const m = menuById(item.menu[0]);
    if (m?.maps) return { query: m.maps, place: m.name };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Choices

export type ChoiceOption = {
  id: string;
  title: string;
  /** "Energy left?" */
  ask?: string;
  detail: string;
  maps?: { query: MapsQuery; place: string } | null;
  /** A route option links to its page. */
  href?: string;
  recommended?: boolean;
};

export const choiceKey = (item: PlanItem) => `choice:${item.t}`;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Home over Tioga (recommended)" → { name: "Home over Tioga", recommended: true } */
export function routeName(id: string) {
  const r = ROUTES[id];
  const recommended = /\(recommended\)/i.test(r?.title ?? '');
  return { name: (r?.title ?? id).replace(/\s*\(recommended\)\s*/i, '').trim(), recommended };
}

/**
 * The options of a choice item. Sunday's come from its routes; the others
 * are read from the item's own text ("Energy left? … Running on fumes? …"),
 * titled from the item title ("festival or quiet time").
 */
export function choiceOptions(item: PlanItem, lodging: string): { intro: string; options: ChoiceOption[] } {
  if (item.choices?.length) {
    return {
      intro: item.text,
      options: item.choices.map((id) => {
        const { name, recommended } = routeName(id);
        return { id, title: name, detail: ROUTES[id]?.summary ?? '', href: `/route/${id}`, recommended };
      }),
    };
  }
  const text = item.text;
  const re = /([A-Z][^.?!]*\?)\s+([\s\S]+?)(?=\s+[A-Z][^.?!]*\?\s|$)/g;
  const found: { ask: string; detail: string; at: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) found.push({ ask: m[1].trim(), detail: m[2].trim(), at: m.index });
  const names = item.title
    .replace(/^Choose:\s*/i, '')
    .split(/\s+or\s+/i)
    .map((s) => cap(s.trim()));
  const intro = found.length ? text.slice(0, found[0].at).trim() : text;
  const options = found.map((f, i) => {
    const title = names.length === found.length ? names[i] : f.ask.replace(/\?$/, '');
    const hit = (item.menu ?? []).map(menuById).find((e) => e && f.detail.toLowerCase().includes(e.name.toLowerCase()));
    const maps = hit?.maps ? { query: hit.maps, place: hit.name } : /\bhome\b/i.test(f.detail) ? { query: lodging.trim() ? { daddr: lodging.trim() } : { q: 'Mammoth Lakes, CA' }, place: 'home base' } : null;
    return { id: slug(title), title, ask: f.ask, detail: f.detail, maps };
  });
  return { intro, options };
}

// ---------------------------------------------------------------------------
// Route legs ("10:20", "Lee Vining: gas up (last gas for 59 mi). Whoa Nellie if open")

export type RouteStep = {
  /** Display time ("10:20", "~6:15"), or null for an alternative. */
  time: string | null;
  at: number | null;
  period: string;
  title: string;
  sub: string | null;
  optional: boolean;
  alt: boolean;
  fuel: boolean;
  sick: boolean;
  home: boolean;
};

/** Leg times are Sunday, 7–11 am, then 12 and 1–6 pm. */
function legTime(t: string): { at: number | null; period: string } {
  const m = /^~?(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return { at: null, period: '' };
  let h = Number(m[1]);
  const pm = h === 12 || h < 7;
  if (pm && h < 12) h += 12;
  return { at: ms(`2026-10-11T${String(h).padStart(2, '0')}:${m[2]}:00-07:00`), period: pm ? 'pm' : 'am' };
}

export function routeSteps(id: string): RouteStep[] {
  const r = ROUTES[id];
  if (!r) return [];
  return r.legs.map(([t, raw]) => {
    let s = raw.trim();
    const optional = /^Optional:\s*/i.test(s);
    if (optional) s = s.replace(/^Optional:\s*/i, '');
    let title = s;
    let sub: string | null = null;
    const cut = [s.indexOf(': '), s.indexOf('. ')].filter((n) => n > 0);
    if (cut.length) {
      const at = Math.min(...cut);
      title = s.slice(0, at);
      sub = s.slice(at + 2).trim();
    } else {
      const p = /^(.*?)\s*\(([^()]*)\)$/.exec(s);
      if (p) {
        title = p[1];
        sub = p[2];
      }
    }
    if (sub) sub = cap(sub);
    const alt = t === 'alt';
    const { at, period } = legTime(t);
    return {
      time: alt ? null : t,
      at,
      period,
      title,
      sub,
      optional,
      alt,
      fuel: /\bgas\b/i.test(raw),
      sick: /car-sickness|grades/i.test(raw),
      home: /^home$/i.test(raw.trim()),
    };
  });
}

/** The choice item that carries a route id (Sunday's "Choose the route home"). */
export function routeChoiceItem(): PlanItem | undefined {
  for (const d of DAYS) for (const it of d.items) if (it.choices?.length) return it;
  return undefined;
}

// ---------------------------------------------------------------------------
// Packing and checklists (ids must match the old app so saved checks survive)

export type PackItem = { id: string; title: string; sub: string | null; qty: string | null };
export type PackGroup = { group: string; note?: string; items: PackItem[] };

/** Split "Headlamps ×5 (with a red-light mode)" into title, quantity and a trailing note. */
export function splitLine(text: string): { title: string; sub: string | null; qty: string | null } {
  let t = text.trim();
  let sub: string | null = null;
  const p = /^(.*\S)\s*\(([^()]*)\)$/.exec(t);
  if (p && p[1].length >= 6) {
    t = p[1];
    sub = cap(p[2]);
  }
  let qty: string | null = null;
  const q = /\s*×\s*(\d+)\b/.exec(t);
  if (q && !/\(×/.test(t)) {
    qty = `×${q[1]}`;
    t = (t.slice(0, q.index) + t.slice(q.index + q[0].length)).trim();
  }
  return { title: t, sub, qty };
}

/** Packing groups with the old ids: `pack-<n>`, numbered across all groups. */
export function packGroups(): PackGroup[] {
  let n = 0;
  return PACKING.map((g) => ({
    group: g.group,
    note: g.note,
    items: g.items.map((line) => ({ id: `pack-${n++}`, ...splitLine(line) })),
  }));
}
export const PACK_TOTAL = PACKING.reduce((a, g) => a + g.items.length, 0);

/** Before-you-go checks with the old ids: `before-<n>`. */
export const beforeItems = () => BEFORE.checklist.map((line, i) => ({ id: `before-${i}`, ...splitLine(line) }));

// ---------------------------------------------------------------------------
// Conditions snapshot

export const asOf = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(/\s?(AM|PM)$/, (s) => s.toLowerCase());

export const asOfDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric' });

/** NPS text "Tioga Road (…) Expect 10-minute delays … Open Glacier Point Road …" → status + note. */
export function parseTioga(text: string | null): { status: 'Open' | 'Closed' | null; note: string } | null {
  if (!text) return null;
  const m = /^Tioga Road(?:\s*\([^)]*\))?\s*(.*?)\s*\b(Open|Closed)\b/.exec(text.trim());
  if (!m) return { status: null, note: text.trim() };
  const note = m[1].trim().replace(/\s+/g, ' ');
  return { status: m[2] as 'Open' | 'Closed', note: note ? cap(note.replace(/([^.])$/, '$1.')) : '' };
}

/** Caltrans text "SR 120 [AREA] text [AREA] text" → per-area segments. */
export function parseRoad(text: string): { area: string; text: string }[] {
  const out: { area: string; text: string }[] = [];
  const re = /\[([^\]]+)\]\s*([^[]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const body = m[2].trim();
    if (!body) continue;
    const area = m[1]
      .trim()
      .toLowerCase()
      .replace(/^in the\s+/, '')
      .replace(/\b(nat'l)\b/g, "Nat'l")
      .replace(/(^|\s|&\s)([a-z])/g, (_s, a: string, b: string) => a + b.toUpperCase())
      .replace(/\bArea\b/, 'area')
      .replace(/\bAnd\b/, 'and');
    out.push({ area, text: body.replace(/\s+/g, ' ').replace(/Yosenite/g, 'Yosemite') });
  }
  return out;
}

export const ROAD_NAMES: Record<string, string> = { '120': 'CA-120', '395': 'US-395', '108': 'CA-108' };
