import type { ScreenProps } from '@/app/routes';
import { sky } from '@/content/kids.js';
import { fmtTime, sunTimes } from '@/lib/time';
import { Button, Card, NightVisionOffer, Page, Section } from '@/ui';
import { BookOpenText, MoonStars } from '@/ui/icons';
import { FindCard, Tally, useKidList } from './KidsParts';

const IDS = sky.finds.map((f) => f.id);

// Looking up on Sat Oct 10 around 8:30 pm from Mammoth (37.6° N). Altitude
// and azimuth are approximate, good enough to point with.
type Obj = { name: string; alt: number; az: number; mag: number; label?: 'left' | 'right' | 'above' | 'below'; planet?: boolean };
const STARS: Obj[] = [
  { name: 'Vega', alt: 50, az: 290, mag: 0 },
  { name: 'Deneb', alt: 72, az: 322, mag: 1.3 },
  { name: 'Altair', alt: 52, az: 218, mag: 0.8, label: 'below' },
  { name: 'Saturn', alt: 24, az: 112, mag: 0.5, planet: true },
];
const DIPPER: [number, number][] = [
  [14, 318], [17, 322], [19, 330], [22, 337], [21, 345], [26, 348], [28, 340],
];
const CASSIOPEIA: [number, number][] = [
  [40, 34], [44, 38], [42, 44], [46, 49], [45, 55],
];
// Milky Way centerline: from the southwest horizon, over Cygnus near the top, down to the northeast.
const MILKY: [number, number][] = [
  [5, 222], [22, 230], [45, 238], [66, 262], [80, 330], [66, 30], [45, 42], [22, 48], [5, 52],
];

const R = 150;
const C = 160;
/** Star-chart projection: zenith in the middle, horizon at the rim, north up, east LEFT (you are looking up). */
const xy = (alt: number, az: number): [number, number] => {
  const r = ((90 - alt) / 90) * R;
  const a = (az * Math.PI) / 180;
  return [C - Math.sin(a) * r, C - Math.cos(a) * r];
};
const path = (pts: [number, number][]) => pts.map(([alt, az], i) => `${i ? 'L' : 'M'}${xy(alt, az).map((v) => v.toFixed(1)).join(' ')}`).join('');

export default function Sky(_props: ScreenProps) {
  const l = useKidList('sky', IDS, 'found');
  const dark = fmtTime(sunTimes('sat').dark);
  return (
    <Page title="Night sky" eyebrow="Saturday, October 10 · New Moon" back={{ href: '/kids', label: 'Kids' }} subtitle={sky.moon.note} sky="candle" width="wide">
      <NightVisionOffer force />

      <Section title="Star finder" note={`Hold it over your head, top to the north. Dark by ${dark}.`}>
        <Card className="kb-chart-card">
          <StarChart />
        </Card>
      </Section>

      <p className="t-reading gutter-text kb-lede">{sky.timing}</p>

      <Section title="Things to find">
        <Tally done={l.done} total={l.total} word="found" />
        <div className="kb-grid">
          {sky.finds.map((f) => (
            <FindCard key={f.id} title={f.name} checked={l.has(f.id)} onToggle={() => l.toggle(f.id)} checkLabel="Found">
              <p className="t-body">{f.how}</p>
              <p className="t-footnote kb-dim">{f.when}</p>
            </FindCard>
          ))}
        </div>
      </Section>

      <Section title="Tips">
        <Card>
          <ul className="kb-tips t-body">
            {sky.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Card>
      </Section>

      <div className="gutter kb-actions">
        <Button icon={BookOpenText} href="/faith/m-stars">
          Devotion: He names the stars
        </Button>
      </div>
    </Page>
  );
}

function StarChart() {
  // Deterministic sprinkle of faint background stars.
  const faint = Array.from({ length: 70 }, (_, i) => {
    const alt = 8 + ((i * 37) % 80);
    const az = (i * 137.5) % 360;
    return { p: xy(alt, az), r: 0.6 + ((i * 7) % 5) * 0.18 };
  });
  return (
    <figure className="kb-chart">
      <svg viewBox="0 0 320 320" role="img" aria-label="Sky chart for about 8:30 pm Saturday: the Summer Triangle high in the west, Saturn low in the east-southeast, the Big Dipper low in the north-northwest, Cassiopeia in the northeast, and the Milky Way arching from southwest to northeast.">
        <defs>
          <radialGradient id="kb-sky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--sky-top, #0c1024)" />
            <stop offset="100%" stopColor="var(--sky-rim, #1a1830)" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={R} className="kb-dome" />
        <path d={path(MILKY)} className="kb-milky" />
        {[30, 60].map((alt) => (
          <circle key={alt} cx={C} cy={C} r={((90 - alt) / 90) * R} className="kb-ring" />
        ))}
        {faint.map((s, i) => (
          <circle key={i} cx={s.p[0]} cy={s.p[1]} r={s.r} className="kb-faint" />
        ))}
        {/* Summer Triangle */}
        <path d={`${path([[STARS[0].alt, STARS[0].az], [STARS[1].alt, STARS[1].az], [STARS[2].alt, STARS[2].az]])}Z`} className="kb-figure" />
        <path d={path(DIPPER)} className="kb-figure" />
        <path d={path(CASSIOPEIA)} className="kb-figure" />
        {DIPPER.concat(CASSIOPEIA).map(([alt, az], i) => {
          const [x, y] = xy(alt, az);
          return <circle key={`d${i}`} cx={x} cy={y} r={2} className="kb-star" />;
        })}
        {STARS.map((s) => {
          const [x, y] = xy(s.alt, s.az);
          return (
            <g key={s.name}>
              <circle cx={x} cy={y} r={s.planet ? 4.2 : 3.4 - s.mag * 0.6} className={s.planet ? 'kb-planet' : 'kb-star'} />
              <text x={x + (s.label === 'below' ? 0 : 7)} y={s.label === 'below' ? y + 15 : y + 4} textAnchor={s.label === 'below' ? 'middle' : 'start'} className="kb-label">
                {s.name}
              </text>
            </g>
          );
        })}
        <text {...lab(xy(18, 331), 0, 14)} className="kb-label kb-label-dim">Big Dipper</text>
        <text {...lab(xy(43, 44), 10, -16)} className="kb-label kb-label-dim">Cassiopeia (W)</text>
        <text {...lab(xy(62, 255), 0, 18)} className="kb-label kb-label-dim">Summer Triangle</text>
        <text {...lab(xy(30, 236), -2, 0)} className="kb-label kb-label-milky">Milky Way</text>
        {(['N', 'E', 'S', 'W'] as const).map((d, i) => {
          const [x, y] = xy(-6, i * 90);
          return (
            <text key={d} x={x} y={y + 4} textAnchor="middle" className="kb-compass">
              {d}
            </text>
          );
        })}
      </svg>
      <figcaption className="t-footnote kb-dim">
        <MoonStars size={14} aria-hidden="true" /> About 8:30 pm Saturday. East is on the left because you're looking up.
      </figcaption>
    </figure>
  );
}

const lab = ([x, y]: [number, number], dx: number, dy: number) => ({ x: x + dx, y: y + dy, textAnchor: 'middle' as const });
