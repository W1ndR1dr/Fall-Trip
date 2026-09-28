// Devotions: typed access to src/content (devotions, scripture, trip), the
// old app's "whose turn" rule, and the Scripture helpers the faith screens
// share (verse numbers, publisher notices, the ESV/NIV word diff).
import { bonus, daily, journalPrompts, memoryVerse, moments } from '@/content/devotions.js';
import { passages } from '@/content/scripture.js';
import { days } from '@/content/trip.js';
import type { TripDayId } from '@/lib/time';

export type Translation = 'ESV' | 'NIV';
export type StepKey = 'look' | 'read' | 'wonder' | 'pray' | 'do';
export type Kind = 'daily' | 'moment' | 'bonus';

export type Hymn = { title: string; credit: string; lines: string[] };
export type Devotion = {
  id: string;
  kind: Kind;
  title: string;
  day?: TripDayId;
  when?: string;
  place?: string;
  stop?: string;
  look?: string;
  read: string[];
  readNote?: string;
  wonder?: string;
  pray?: string;
  do?: string;
  why?: string;
  hymn?: Hymn;
};

type Raw = Omit<Devotion, 'kind'>;
const tag = (list: readonly unknown[], kind: Kind) => (list as Raw[]).map((d) => ({ ...d, kind }) as Devotion);

export const DAILY = tag(daily, 'daily');
export const MOMENTS = tag(moments, 'moment');
export const BONUS = tag(bonus, 'bonus');
export const ALL: Devotion[] = [...DAILY, ...MOMENTS, ...BONUS];
export const MEMORY_VERSE = memoryVerse as string;
export const PROMPTS = journalPrompts as string[];

export const findDevotion = (id: string | undefined) => ALL.find((d) => d.id === id);

export const STEP_LABEL: Record<StepKey, string> = { look: 'Look', read: 'Read', wonder: 'Wonder', pray: 'Pray', do: 'Do' };

/** The sections a devotion has, in order (bonus moments skip Look and Pray). */
export function stepsOf(d: Devotion): StepKey[] {
  return (['look', 'read', 'wonder', 'pray', 'do'] as const).filter((k) => (k === 'read' ? d.read.length > 0 : !!d[k]));
}

// ---------------------------------------------------------------------------
// Whose turn (the old app's rule, so saved nudges keep their meaning):
// daily + moments in order; the reader is kid (i + nudge) % 3 and the one who
// prays is the next kid. `turn:<id>` stores the nudge. Bonus moments have no turns.

const TURN_ORDER = [...DAILY, ...MOMENTS].map((d) => d.id);
export const hasTurns = (d: Devotion) => d.kind !== 'bonus';
export function turnsFor(id: string, nudge: number) {
  const i = Math.max(0, TURN_ORDER.indexOf(id));
  const n = Number.isFinite(nudge) ? nudge : 0;
  return { reader: (i + n) % 3, prayer: (i + n + 1) % 3 };
}

// ---------------------------------------------------------------------------
// Where a devotion sits in the plan: the itinerary item that names it, or the
// item whose menu includes its stop (Lundy's beaver ponds for "Ask the animals").

type Item = { t: string; title: string; devotion?: string | null; menu?: string[]; maps?: { q?: string } };
type Day = { id: TripDayId; label: string; date: string; title: string; items: Item[] };
export const DAYS = days as unknown as Day[];

export type Slot = { day: Day; item: Item; start: Date; end: Date };

export function slotFor(d: Devotion): Slot | undefined {
  for (const day of DAYS) {
    const items = day.items;
    const i = items.findIndex((it) => it.devotion === d.id);
    const j = i >= 0 ? i : d.stop ? items.findIndex((it) => it.menu?.includes(d.stop!)) : -1;
    if (j >= 0) {
      const start = new Date(items[j].t);
      const end = items[j + 1] ? new Date(items[j + 1].t) : new Date(start.getTime() + 90 * 60e3);
      return { day, item: items[j], start, end };
    }
  }
  return undefined;
}

export const DAY_LABEL: Record<TripDayId, { short: string; long: string; date: string; n: number }> = {
  fri: { short: 'Fri', long: 'Friday', date: 'Oct 9', n: 9 },
  sat: { short: 'Sat', long: 'Saturday', date: 'Oct 10', n: 10 },
  sun: { short: 'Sun', long: 'Sunday', date: 'Oct 11', n: 11 },
};
export const TRIP_DAYS: TripDayId[] = ['fri', 'sat', 'sun'];

/** "Saturday, in the first aspen grove" → "In the first aspen grove". */
export function whenWithoutDay(when = '') {
  const s = when.replace(/^(Friday|Saturday|Sunday)(,\s*|\s+)/, '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Scripture

type Passage = { esv: string; niv: string; esvUrl: string; nivUrl: string };
const P = passages as Record<string, Passage>;

export const passageText = (ref: string, tr: Translation) => (P[ref] ? (tr === 'NIV' ? P[ref].niv : P[ref].esv) : '');
export const passageUrl = (ref: string, tr: Translation) => (P[ref] ? (tr === 'NIV' ? P[ref].nivUrl : P[ref].esvUrl) : '');
export const hasPassage = (ref: string) => !!P[ref];

/** The publishers' required notices, word for word as on the About screen. */
export const NOTICE: Record<Translation, string> = {
  ESV: 'Scripture quotations marked (ESV) are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved.',
  NIV: 'Scripture quotations marked (NIV) are taken from THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide.',
};

// scripture.js stores each passage as one string. These are the words each
// later verse starts with (checked against the printed ESV and NIV), so the
// text can carry verse numbers. Single verses need no entry.
const VERSE_STARTS: Record<string, Record<Translation, string[]>> = {
  'Genesis 1:11–12': { ESV: ['The earth brought forth'], NIV: ['The land produced'] },
  'Psalm 19:1–2': { ESV: ['Day to day'], NIV: ['Day after day'] },
  'Psalm 104:10–12': { ESV: ['they give drink', 'Beside them'], NIV: ['They give water', 'The birds of the sky'] },
  'Matthew 6:28–30': { ESV: ['yet I tell you', 'But if God'], NIV: ['Yet I tell you', 'If that is how'] },
  'Job 12:7–10': { ESV: ['or the bushes', 'Who among all', 'In his hand'], NIV: ['or speak to the earth', 'Which of all', 'In his hand'] },
  'Psalm 8:3–4': { ESV: ['what is man'], NIV: ['what is mankind'] },
};

export type Verse = { n: number; text: string };

/** A passage as numbered verses. Falls back to one block if a break isn't found. */
export function versesOf(ref: string, tr: Translation): Verse[] {
  const text = passageText(ref, tr);
  const m = ref.match(/(\d+):(\d+)(?:[–-](\d+))?$/);
  const first = m ? Number(m[2]) : 1;
  const starts = VERSE_STARTS[ref]?.[tr] ?? [];
  const out: Verse[] = [];
  let from = 0;
  let n = first;
  for (const s of starts) {
    const at = text.indexOf(s, from + 1);
    if (at < 0) break;
    out.push({ n, text: text.slice(from, at).trim() });
    from = at;
    n++;
  }
  out.push({ n, text: text.slice(from).trim() });
  return out;
}

// ---------------------------------------------------------------------------
// ESV ↔ NIV word diff: words the two translations share (in order, exact
// spelling and punctuation) keep one key, so they hold their place while the
// rest dissolve. Verse numbers are shared tokens too.

export type Token = { key: string; kind: 'verse' | 'word'; text: string };

function tokensOf(ref: string, tr: Translation) {
  const out: { kind: 'verse' | 'word'; text: string }[] = [];
  for (const v of versesOf(ref, tr)) {
    out.push({ kind: 'verse', text: String(v.n) });
    for (const w of v.text.split(/\s+/).filter(Boolean)) out.push({ kind: 'word', text: w });
  }
  return out;
}

const cmp = (t: { kind: string; text: string }) => `${t.kind}:${t.text}`;

const diffCache = new Map<string, Record<Translation, Token[]>>();

/** Both translations as keyed tokens; shared tokens have the same key. */
export function diffTokens(ref: string): Record<Translation, Token[]> {
  const hit = diffCache.get(ref);
  if (hit) return hit;
  const a = tokensOf(ref, 'ESV');
  const b = tokensOf(ref, 'NIV');
  // Longest common subsequence (passages are < 100 words).
  const L: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--) L[i][j] = cmp(a[i]) === cmp(b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ka: string[] = a.map((_, i) => `e${i}`);
  const kb: string[] = b.map((_, j) => `n${j}`);
  let i = 0;
  let j = 0;
  let k = 0;
  while (i < a.length && j < b.length) {
    if (cmp(a[i]) === cmp(b[j])) {
      ka[i] = kb[j] = `s${k++}`;
      i++;
      j++;
    } else if (L[i + 1][j] >= L[i][j + 1]) i++;
    else j++;
  }
  const res = {
    ESV: a.map((t, x) => ({ ...t, key: ka[x] })),
    NIV: b.map((t, x) => ({ ...t, key: kb[x] })),
  };
  diffCache.set(ref, res);
  return res;
}

// ---------------------------------------------------------------------------
// Memory verse: the old app's exact word split, so saved hidden indices
// (`mv:ESV`, `mv:NIV`) still point at the same words.

export function memoryWords(tr: Translation): string[] {
  return passageText(MEMORY_VERSE, tr).replace(/[:;]$/, '.').split(/\s+/);
}

// ---------------------------------------------------------------------------
// Journal: the old app's prompt per day.

export const promptIndex = (day: TripDayId) => TRIP_DAYS.indexOf(day) % PROMPTS.length;

/** The line above a devotion's title: "Saturday · In the first aspen grove",
 *  "Saturday · South Tufa, Mono Lake", or when a bonus moment fits. */
export function eyebrowOf(d: Devotion): string {
  if (d.kind === 'daily' && d.day) return `${DAY_LABEL[d.day].long} · ${whenWithoutDay(d.when)}`;
  if (d.kind === 'moment') {
    const s = slotFor(d);
    return s ? `${DAY_LABEL[s.day.id].long} · ${d.place ?? ''}` : (d.place ?? '');
  }
  return d.when ?? '';
}
