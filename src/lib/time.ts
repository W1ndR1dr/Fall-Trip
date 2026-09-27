// Trip clock. All trip times are Pacific; the phones will be on Pacific time.
import { DEPART, HOME_BY, sun } from '../content/trip.js';
import { get, useStored } from './store';
import { useEffect, useState } from 'react';

export const TZ = 'America/Los_Angeles';

/** Current time, or the Settings "preview trip time" override. */
export function now(): Date {
  const o = get<string | null>('debugNow', null);
  return o ? new Date(o) : new Date();
}

/** Live clock that re-renders every `ms` and when the preview override changes. */
export function useNow(ms = 30_000): Date {
  const [override] = useStored<string | null>('debugNow', null);
  const [t, setT] = useState(() => (override ? new Date(override) : new Date()));
  useEffect(() => {
    setT(override ? new Date(override) : new Date());
    if (override) return;
    const id = setInterval(() => setT(new Date()), ms);
    return () => clearInterval(id);
  }, [override, ms]);
  return t;
}

export type TripDayId = 'fri' | 'sat' | 'sun';

/** Which trip day a moment falls on (Pacific), or null outside Oct 9–11. */
export function tripDay(d: Date): TripDayId | null {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(d);
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  if (n('year') === 2026 && n('month') === 10 && n('day') >= 9 && n('day') <= 11) return (['fri', 'sat', 'sun'] as const)[n('day') - 9];
  return null;
}

/** before: more than 3 h before departure; during: the trip; after: 4 h past home time. */
export function tripPhase(d: Date): 'before' | 'during' | 'after' {
  const t = d.getTime();
  if (t < new Date(DEPART).getTime() - 3 * 3600e3) return 'before';
  if (t > new Date(HOME_BY).getTime() + 4 * 3600e3) return 'after';
  return 'during';
}

const PT_TIME = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });

/** "9:30" + "am" as separate parts so the period can be styled smaller. */
export function timeParts(iso: string | Date): { time: string; period: string } {
  const parts = PT_TIME.formatToParts(new Date(iso));
  const v = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { time: `${v('hour')}:${v('minute')}`, period: v('dayPeriod').toLowerCase() };
}

export const fmtTime = (iso: string | Date) => {
  const { time, period } = timeParts(iso);
  return `${time} ${period}`;
};

/** Days/hours/minutes until a moment (never negative). */
export function countdown(to: string | Date, from: Date) {
  const ms = Math.max(0, new Date(to).getTime() - from.getTime());
  const days = Math.floor(ms / 86400e3);
  const hours = Math.floor((ms % 86400e3) / 3600e3);
  const minutes = Math.floor((ms % 3600e3) / 60e3);
  return { ms, days, hours, minutes };
}

// ---------------------------------------------------------------------------
// Sun times and "after dark"

export type SunTimes = {
  sunrise: Date;
  sunset: Date;
  goldenAM: [Date, Date];
  goldenPM: [Date, Date];
  /** End of astronomical-ish twilight: the content's "Dark" time. */
  dark: Date;
};

const DAY_DATE: Record<TripDayId, string> = { fri: '2026-10-09', sat: '2026-10-10', sun: '2026-10-11' };
// Content times are "h:mm" in PDT; morning values are am, the rest pm.
const at = (day: TripDayId, hm: string, pm: boolean) => {
  let [h, m] = hm.split(':').map(Number);
  if (pm && h < 12) h += 12;
  return new Date(`${DAY_DATE[day]}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00-07:00`);
};
const range = (day: TripDayId, r: string, pm: boolean): [Date, Date] => {
  const [a, b] = r.split(/[–-]/);
  return [at(day, a, pm), at(day, b, pm)];
};

/** A trip day's sun times as Dates (from src/content/trip.js `sun`). */
export function sunTimes(day: TripDayId): SunTimes {
  const s = (sun as Record<TripDayId, { sunrise: string; sunset: string; goldenAM: string; goldenPM: string; dark: string }>)[day];
  return {
    sunrise: at(day, s.sunrise, false),
    sunset: at(day, s.sunset, true),
    goldenAM: range(day, s.goldenAM, false),
    goldenPM: range(day, s.goldenPM, true),
    dark: at(day, s.dark, true),
  };
}

/**
 * True on a trip night: after that day's "Dark" time, or before sunrise on a
 * trip day. Outside Oct 9–11 it is always false (home evenings keep the glow).
 */
export function isAfterDark(d: Date): boolean {
  const day = tripDay(d);
  if (!day) return false;
  const t = sunTimes(day);
  return d >= t.dark || (day !== 'fri' && d < t.sunrise);
}

/** Live `isAfterDark(now)` (re-checks every minute and on preview-time changes). */
export function useAfterDark(): boolean {
  return isAfterDark(useNow(60_000));
}
