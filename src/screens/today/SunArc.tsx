// The day as an instrument: the sun's arc from the real sun times, golden
// hours thick amber, twilight dotted, night dotted indigo, and the live sun
// dot travelling from sunrise to now on mount.
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { sunTimes, timeParts, TZ, type TripDayId } from '@/lib/time';
import { Card, useCalm } from '@/ui';
import { fmtDuration } from './data';

const H0 = 5; // 5 am
const H1 = 21.75; // 9:45 pm
const HOUR_FMT = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' });
/** Hours since Pacific midnight (e.g. 9.5 for 9:30 am). */
export function clockHours(d: Date) {
  const parts = HOUR_FMT.formatToParts(d);
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return n('hour') + n('minute') / 60;
}

function Time({ d }: { d: Date }) {
  const { time, period } = timeParts(d);
  return (
    <b className="td-sun-time num">
      {time}
      <span className="t-period">{period}</span>
    </b>
  );
}

export function SunArc({ day, now }: { day: TripDayId; now: Date }) {
  const t = sunTimes(day);
  const calm = useCalm();
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(326);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const m = () => setW(Math.max(200, el.clientWidth));
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rise = clockHours(t.sunrise), set = clockHours(t.sunset), dark = clockHours(t.dark);
  const gamEnd = clockHours(t.goldenAM[1]), gpm = clockHours(t.goldenPM[0]);
  const nowH = clockHours(now);
  const H = 92, hy = 64, A = 50, pad = 8;
  const X = (h: number) => pad + ((h - H0) / (H1 - H0)) * (W - 2 * pad);
  const Y = (h: number) => {
    const v = Math.sin((Math.PI * (h - rise)) / (set - rise));
    return hy - (v > 0 ? A * v : 18 * v);
  };
  const seg = (a: number, b: number) => {
    let d = '';
    for (let h = a; h <= b + 1e-6; h += 0.04) d += (d ? 'L' : 'M') + X(h).toFixed(1) + ' ' + Y(h).toFixed(1);
    return d + `L${X(b).toFixed(1)} ${Y(b).toFixed(1)}`;
  };

  // The sun travels from sunrise (or the arc's start) to now.
  const inRange = nowH >= H0 && nowH <= H1;
  const target = Math.max(H0, Math.min(H1, nowH));
  const from = Math.min(target, Math.max(H0, rise));
  const h = useMotionValue(calm ? target : from);
  useEffect(() => {
    if (calm) {
      h.jump(target);
      return;
    }
    const c = animate(h, target, { type: 'spring', visualDuration: 0.9, bounce: 0 });
    return () => c.stop();
  }, [target, calm, h]);
  const sx = useTransform(h, X);
  const sy = useTransform(h, Y);
  const clipW = useTransform(h, (v) => X(v));
  const labelX = useTransform(sx, (v) => (v > W - 50 ? v - 12 : v + 12));
  const labelY = useTransform(sy, (v) => v - 9);
  const lineY2 = hy;

  // Header: what's next in the sky.
  const mins = (a: number) => (a - nowH) * 60;
  let head: string;
  if (nowH < rise) head = `Sunrise in ${fmtDuration(mins(rise))}`;
  else if (nowH < gpm) head = `Golden hour in ${fmtDuration(mins(gpm))}`;
  else if (nowH < set) head = `Golden hour now · sunset in ${fmtDuration(mins(set))}`;
  else if (nowH < dark) head = `Dark in ${fmtDuration(mins(dark))}`;
  else head = 'After dark';
  const golden = (nowH >= rise && nowH <= gamEnd) || (nowH >= gpm && nowH <= set);

  const up = nowH >= rise && nowH <= set;
  return (
    <Card className="td-sun" pad="md">
      <div className="td-sun-head">
        <h2 className="t-eyebrow td-sun-title">Sun</h2>
        <span className={`t-footnote num td-sun-next ${golden ? 'td-sun-next-live' : ''}`}>{head}</span>
      </div>
      <div ref={box} className="td-sun-plot">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="td-sun-svg">
          <defs>
            <linearGradient id="td-dayfill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.16 }} />
              <stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
            </linearGradient>
            <clipPath id="td-past">
              <motion.rect x={0} y={0} height={H} width={clipW} />
            </clipPath>
            <radialGradient id="td-sunhalo">
              <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.55 }} />
              <stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <path d={`${seg(rise, set)}L${X(set)} ${hy}L${X(rise)} ${hy}Z`} fill="url(#td-dayfill)" />
          <line x1={0} x2={W} y1={hy} y2={hy} stroke="var(--line-2)" />
          {/* night before sunrise and after dark */}
          <path d={seg(H0, rise)} className="td-arc-night" />
          <path d={seg(dark, H1)} className="td-arc-night" />
          {/* twilight */}
          <path d={seg(set, dark)} className="td-arc-twilight" />
          {/* day */}
          <path d={seg(gamEnd, gpm)} className="td-arc-day" />
          {/* golden hours */}
          <path d={seg(rise, gamEnd)} className="td-arc-golden" />
          <path d={seg(gpm, set)} className="td-arc-golden" />
          {/* travelled today */}
          <g clipPath="url(#td-past)">
            <path d={seg(rise, gamEnd)} className="td-arc-past" />
            <path d={seg(gamEnd, gpm)} className="td-arc-past td-arc-past-day" />
            <path d={seg(gpm, set)} className="td-arc-past" />
          </g>
          {[
            [rise, 'var(--accent-mark)'],
            [set, 'var(--accent-2)'],
            [dark, 'var(--night)'],
          ].map(([hh, c]) => (
            <circle key={String(hh)} cx={X(hh as number)} cy={Y(hh as number)} r={3} fill="var(--bg-2)" stroke={c as string} strokeWidth={1.6} />
          ))}
          {inRange && (
            <g className={up ? 'td-sun-dot' : 'td-sun-dot td-sun-dot-down'}>
              <motion.line x1={sx} x2={sx} y1={sy} y2={lineY2} stroke="var(--accent-mark)" strokeDasharray="2 3" opacity={0.6} />
              {up && <motion.circle cx={sx} cy={sy} r={17} fill="url(#td-sunhalo)" className="td-sun-halo" />}
              <motion.circle cx={sx} cy={sy} r={6} fill={up ? 'var(--accent)' : 'var(--bg-2)'} stroke={up ? 'var(--bg-2)' : 'var(--night)'} strokeWidth={up ? 2 : 1.6} />
              <motion.text x={labelX} y={labelY} textAnchor={X(target) > W - 50 ? 'end' : 'start'} className="td-sun-now">
                Now
              </motion.text>
            </g>
          )}
        </svg>
      </div>
      <dl className="td-sun-legend">
        <div>
          <dt>
            <i style={{ background: 'var(--accent-mark)' }} />
            Sunrise
          </dt>
          <dd>
            <Time d={t.sunrise} />
          </dd>
        </div>
        <div>
          <dt>
            <i style={{ background: 'var(--accent-mark)' }} />
            Golden
          </dt>
          <dd>
            <Time d={t.goldenPM[0]} />
          </dd>
        </div>
        <div>
          <dt>
            <i style={{ background: 'var(--accent-2)' }} />
            Sunset
          </dt>
          <dd>
            <Time d={t.sunset} />
          </dd>
        </div>
        <div>
          <dt>
            <i style={{ background: 'var(--night)' }} />
            Dark
          </dt>
          <dd>
            <Time d={t.dark} />
          </dd>
        </div>
      </dl>
    </Card>
  );
}
