// The Now card's map strip: real terrain cropped around where you are, with
// the next leg dashed in ember. Loaded lazily (the terrain code stays out of
// the shell bundle).
import { useLayoutEffect, useRef, useState } from 'react';
import { MapLabel, RouteLine, StopDot, Terrain } from '@/art/Terrain';
import { STOP_NAMES, cropAround, stop, type Pt, type Region, type StopKey } from '@/art/geo';

export type NowMapProps = { here: StopKey; next?: StopKey | null; nextSub?: string; height?: number };

/** A gentle bow between two points so the leg reads as a road, not a ruler. */
function bow(a: Pt, b: Pt): Pt[] {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  return [a, [mx - dy * 0.14, my + dx * 0.14], b];
}

export default function NowMap({ here, next, nextSub, height = 128 }: NowMapProps) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(358);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const m = () => setW(el.clientWidth || 358);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const both = next && next !== here ? next : null;
  const region: Region = stop('eastside', here) && (!both || stop('eastside', both)) ? 'eastside' : 'route';
  const a = stop(region, here)!;
  const b = both ? stop(region, both)! : null;
  const aspect = w / height;
  // Frame both places (with room for labels) when they fit at a useful
  // zoom; otherwise frame where you are and let the leg run off the strip.
  const unitsPerPx = region === 'eastside' ? 0.42 : 0.3;
  const single = w * unitsPerPx;
  let crop;
  let pair = false;
  if (b) {
    const dx = Math.abs(b[0] - a[0]), dy = Math.abs(b[1] - a[1]);
    const width = Math.max(dx * 1.7 + 80, (dy + 34) * aspect, single * 0.6);
    if (width <= single * 2.4) {
      pair = true;
      crop = cropAround(region, [(a[0] + b[0]) / 2 + (b[0] > a[0] ? -6 : 6), (a[1] + b[1]) / 2], width, aspect);
    } else {
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      crop = cropAround(region, [a[0] + ((b[0] - a[0]) / d) * single * 0.22, a[1] + ((b[1] - a[1]) / d) * single * 0.1], single, aspect);
    }
  } else {
    crop = cropAround(region, [a[0] + single * 0.12, a[1]], single, aspect);
  }
  // Each label goes on the open side of its dot, and never off the strip.
  const k = Math.max(w / crop[2], height / crop[3]);
  const side = (p: Pt, other: Pt | null): 'left' | 'right' | 'above' | 'below' => {
    const room = 96 / k; // a label's width, in map units
    const pref = other ? (other[0] > p[0] ? 'left' : 'right') : 'right';
    const fitsLeft = p[0] - crop[0] > room + 10 / k;
    const fitsRight = crop[0] + crop[2] - p[0] > room + 10 / k;
    if (pref === 'left' && fitsLeft) return 'left';
    if (pref === 'right' && fitsRight) return 'right';
    if (other) return other[1] > p[1] ? 'above' : 'below';
    return fitsRight ? 'right' : 'left';
  };
  const hereSide = side(a, pair ? b : b && [a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1]);
  const nextSide = b ? side(b, a) : 'right';
  const showNext = !!b && pair;
  return (
    <div ref={box} className="td-nowmap">
      <Terrain region={region} crop={crop} fade="bottom" style={{ height }} label={both ? `Map of ${STOP_NAMES[here]} and the way to ${STOP_NAMES[both]}` : `Map of ${STOP_NAMES[here]}`}>
        {b && <RouteLine points={bow(a, b)} variant="next" />}
        {showNext && <StopDot at={b!} />}
        <StopDot at={a} kind="here" />
        {showNext && <MapLabel at={b!} title={STOP_NAMES[both!]} sub={nextSub} side={nextSide} size="sm" />}
        <MapLabel at={a} title={STOP_NAMES[here]} side={hereSide} size="sm" />
      </Terrain>
    </div>
  );
}
