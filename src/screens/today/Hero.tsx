// The countdown: a huge serif number on the horizon, italic "days", and the
// hours and minutes in tabular Inter. It carries layoutId "today-now" so at
// departure (Fri noon) it re-lays out into the first Now card.
import { motion } from 'motion/react';
import { DEPART } from '@/content/trip.js';
import { countdown, TZ } from '@/lib/time';
import { NumberRoller, spring, useCalm } from '@/ui';

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export function Hero({ now, eyebrow = 'Eastern Sierra · Oct 9–11' }: { now: Date; eyebrow?: string }) {
  const { days, hours, minutes } = countdown(DEPART, now);
  const calm = useCalm();
  const big = days > 0 ? days : hours > 0 ? hours : minutes;
  const unit = days > 0 ? plural(days, 'day', 'days') : hours > 0 ? plural(hours, 'hour', 'hours') : plural(minutes, 'minute', 'minutes');
  const spoken = [days && `${days} ${plural(days, 'day', 'days')}`, `${hours} ${plural(hours, 'hour', 'hours')}`, `${minutes} ${plural(minutes, 'minute', 'minutes')}`].filter(Boolean).join(', ');
  const gap = Math.round((dateOnly(new Date(DEPART)) - dateOnly(now)) / 86400e3);
  const when = gap <= 0 ? 'today at noon' : gap === 1 ? 'tomorrow at noon' : 'Friday at noon';
  return (
    <motion.section
      layoutId="today-now"
      className="td-hero"
      aria-label="Countdown"
      transition={spring.glide}
      exit={calm ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.25 } }}
    >
      <p className="t-eyebrow td-hero-eyebrow">{eyebrow}</p>
      <div className="td-hero-figure" role="timer" aria-label={`${spoken} until we leave`} aria-live="off">
        <motion.span className="td-hero-num t-countdown" aria-hidden="true" exit={calm ? undefined : { y: '120%', opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } }}>
          <NumberRoller value={big} />
        </motion.span>
        <span className="td-hero-side" aria-hidden="true">
          <span className="t-units td-hero-units">{unit}</span>
          {days > 0 ? (
            <span className="td-hero-hm num">
              <b>{hours}</b> hr <b>{minutes}</b> min
            </span>
          ) : hours > 0 ? (
            <span className="td-hero-hm num">
              <b>{minutes}</b> min
            </span>
          ) : null}
        </span>
      </div>
      <p className="td-hero-until t-body">
        until we leave, <b>{when}</b>
      </p>
    </motion.section>
  );
}

/**
 * Today → Oct 9–11: one pill per day between now and the trip, the three
 * trip days in amber. Compresses to fit when the trip is far off.
 */
export function DayStrip({ now }: { now: Date }) {
  const today = dateOnly(now);
  const trip = dateOnly(new Date(DEPART));
  const gap = Math.round((trip - today) / 86400e3); // days from today to Friday
  if (gap <= 0) return null;
  const max = 18;
  const lead = Math.min(gap, max); // pills before the trip, including today
  const pills = [...Array.from({ length: lead }, (_, i) => (i === 0 ? 'today' : 'wait')), 'trip', 'trip', 'trip'];
  return (
    <div className="td-strip" role="img" aria-label={`${gap} ${gap === 1 ? 'day' : 'days'} from today to the trip, October 9 to 11`}>
      <div className="td-strip-pills" aria-hidden="true">
        {pills.map((k, i) => (
          <span key={i} className={`td-pill td-pill-${k}`} />
        ))}
      </div>
      <div className="td-strip-labels t-footnote" aria-hidden="true">
        <span>Today</span>
        {gap > max && <span className="td-strip-gap">{gap - max + 1} more days</span>}
        <span className="td-strip-trip">Oct 9–11</span>
      </div>
    </div>
  );
}

// Midnight (Pacific) of a moment, as epoch ms, for whole-day math.
const DAY_FMT = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
function dateOnly(d: Date) {
  return new Date(DAY_FMT.format(d) + 'T00:00:00Z').getTime();
}
