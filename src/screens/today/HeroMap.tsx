// The drive, at a glance, right under the countdown: the High Sierra lit by
// the theme's sun, with Friday's route drawing itself on first view and each
// stop arriving as the line reaches it.
import { useEffect, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent } from 'motion/react';
import { FRIDAY_DRIVE, MapLabel, RouteLine, StopDot, Terrain, WaterLabel, cropAround, stop, type Pt } from '@/art';
import { useCalm } from '@/ui';
import { ArrowDown } from '@/ui/icons';

const LINE = FRIDAY_DRIVE.slice(3); // Crane Flat → Mammoth
const CROP = cropAround('route', [168, 236], 360, 1.12);
const R = (k: Parameters<typeof stop>[1]) => stop('route', k)!;

type S = { at: Pt; title: string; sub?: string; kind: 'minor' | 'major'; side: 'left' | 'right'; accent?: boolean };
const STOPS: S[] = [
  { at: R('craneflat'), title: 'Crane Flat', sub: 'Last gas · 4:35 pm', kind: 'minor', side: 'right' },
  { at: R('olmsted'), title: 'Olmsted Point', sub: '5:40 pm', kind: 'minor', side: 'right' },
  { at: R('tioga'), title: 'Tioga Pass', sub: '6:50 pm', kind: 'major', side: 'right', accent: true },
  { at: R('leevining'), title: 'Lee Vining', sub: '7:15 pm', kind: 'minor', side: 'left' },
  { at: R('mammoth'), title: 'Mammoth Lakes', sub: '8:00 pm', kind: 'major', side: 'right' },
];

// Where along the line (0–1) each stop sits, by cumulative length.
const lens = LINE.map((_, i) => (i === 0 ? 0 : Math.hypot(LINE[i][0] - LINE[i - 1][0], LINE[i][1] - LINE[i - 1][1])));
const total = lens.reduce((a, b) => a + b, 0);
const cum = lens.map((_, i) => lens.slice(0, i + 1).reduce((a, b) => a + b, 0) / total);
const nearest = (p: Pt) => {
  let best = 0;
  LINE.forEach((q, i) => {
    if (Math.hypot(q[0] - p[0], q[1] - p[1]) < Math.hypot(LINE[best][0] - p[0], LINE[best][1] - p[1])) best = i;
  });
  return cum[best];
};
const AT = STOPS.map((s) => nearest(s.at));

export function HeroMap({ onFollow }: { onFollow?: () => void }) {
  const calm = useCalm();
  const p = useMotionValue(calm ? 1 : 0);
  const [reached, setReached] = useState(calm ? 1 : 0);
  useMotionValueEvent(p, 'change', (v) => setReached(v));
  useEffect(() => {
    if (calm) {
      p.set(1);
      return;
    }
    const c = animate(p, 1, { duration: 2.2, delay: 0.35, ease: [0.45, 0, 0.2, 1] });
    return () => c.stop();
  }, [calm, p]);

  return (
    <section className="td-hm" aria-labelledby="td-hm-title">
      <div className="td-hm-head">
        <span className="td-hm-titles">
          <span id="td-hm-title" className="t-title-2">The drive</span>
          <span className="t-footnote">Friday · about 8 hours</span>
        </span>
        {onFollow && (
          <button type="button" className="td-hm-follow" onClick={onFollow}>
            Follow it
            <ArrowDown size={15} weight="bold" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="td-heromap" aria-label="Map of Friday's drive: Crane Flat, Olmsted Point, Tioga Pass at 9,945 feet, Lee Vining, and Mammoth Lakes by about 8 pm" role="img">
        <Terrain region="route" crop={CROP} fade="none" style={{ width: '100%', height: '100%' }}>
          <WaterLabel at={R('monolake')}>Mono Lake</WaterLabel>
          <RouteLine points={LINE} progress={p} width={3} />
          {STOPS.map((s, i) => {
            const on = reached >= AT[i] - 0.01;
            return (
              <g key={s.title} className={`td-hm-stop ${on ? 'is-on' : ''}`}>
                <StopDot at={s.at} kind={s.kind} />
                <MapLabel at={s.at} title={s.title} sub={s.sub} subAccent={s.accent ? '9,945 ft' : undefined} side={s.side} size={s.kind === 'major' ? 'md' : 'sm'} />
              </g>
            );
          })}
        </Terrain>
      </div>
    </section>
  );
}
