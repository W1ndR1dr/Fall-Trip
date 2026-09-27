// Lit terrain. The relief is a pre-rendered raster per theme (scripts/relief.mjs)
// and everything you draw on it (route, stops, labels) is live SVG in the SAME
// map coordinate system as src/art/geo.ts.
//
//   <Terrain region="route" crop={[0, 52, 420, 377]} fade="y" label="The drive from the Bay Area to Mammoth Lakes">
//     <RouteLine points={FRIDAY_DRIVE} />
//     <StopDot at={stop('route', 'tioga')!} kind="major" />
//     <MapLabel at={stop('route', 'tioga')!} title="Tioga Pass" sub="9,945 ft · 6:50 pm" />
//     <WaterLabel at={stop('route', 'monolake')!}>Mono Lake</WaterLabel>
//   </Terrain>
//
// Sizes inside overlays are given in CSS pixels; `useTerrain().k` converts
// (px per map unit, measured from the rendered size). For an animated camera,
// pass `crop` as a MotionValue<string> viewBox and your own `scale`.
import { motion, type MotionValue } from 'motion/react';
import { createContext, useContext, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useTheme, type ResolvedTheme } from '@/lib/theme';
import { REGIONS, splinePath, type Crop, type Pt, type Region } from './geo';

type TerrainCtx = { region: Region; k: number; theme: ResolvedTheme; uid: string };
const Ctx = createContext<TerrainCtx>({ region: 'route', k: 1, theme: 'light', uid: 't' });
/** Inside <Terrain>: the region, px-per-unit scale `k`, and theme. */
export const useTerrain = () => useContext(Ctx);

export const reliefUrl = (region: Region, theme: ResolvedTheme) => `${import.meta.env.BASE_URL}img/topo/relief-${region}-${theme}.webp`;

export type TerrainProps = {
  region: Region;
  /** Visible part as [x, y, w, h] map units (default: the whole region), or an animated viewBox string. */
  crop?: Crop | MotionValue<string>;
  /** slice fills the box (cropping), meet shows the whole crop. */
  fit?: 'slice' | 'meet';
  /** Feather the edges into the page: y (top+bottom), bottom, top, edges (all four). */
  fade?: 'none' | 'y' | 'top' | 'bottom' | 'edges';
  /** Accessible description. Without it the map is decorative (aria-hidden). */
  label?: string;
  /** Override px-per-unit (for animated crops). */
  scale?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Terrain({ region, crop, fit = 'slice', fade = 'none', label, scale, children, className = '', style }: TerrainProps) {
  const { theme } = useTheme();
  const R = REGIONS[region];
  const staticCrop: Crop | null = crop && !isMotion(crop) ? (crop as Crop) : null;
  const vb = staticCrop ?? ([0, 0, R.width, R.height] as const);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const k = scale ?? (size ? (fit === 'slice' ? Math.max(size.w / vb[2], size.h / vb[3]) : Math.min(size.w / vb[2], size.h / vb[3])) : 1);
  const ctx = useMemo(() => ({ region, k, theme, uid }), [region, k, theme, uid]);
  const viewBox = crop && isMotion(crop) ? (crop as MotionValue<string>) : vb.join(' ');

  return (
    <div
      ref={box}
      className={`terrain terrain-fade-${fade} ${className}`}
      style={{ aspectRatio: style?.height || style?.aspectRatio ? undefined : `${vb[2]} / ${vb[3]}`, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <motion.svg className="terrain-svg" viewBox={viewBox as never} preserveAspectRatio={`xMidYMid ${fit}`}>
        <defs>
          {/* Feathered backing for labels: the relief softens under text. */}
          <filter id={`${uid}-feather`} x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur stdDeviation={4 / k} />
          </filter>
          <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={3 / k} />
          </filter>
        </defs>
        <Relief region={region} theme={theme} />
        <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
      </motion.svg>
    </div>
  );
}

const isMotion = (v: unknown): v is MotionValue => typeof v === 'object' && v !== null && 'get' in v && typeof (v as MotionValue).get === 'function';

/**
 * The relief raster as an SVG <image> in map units. Use inside a Terrain to
 * draw the other region too, e.g. eastside detail on the route map:
 *   <g transform={EAST_TO_ROUTE_TRANSFORM}><Relief region="eastside" /></g>
 */
export function Relief({ region, theme }: { region: Region; theme?: ResolvedTheme }) {
  const t = useTheme().theme;
  const R = REGIONS[region];
  return <image href={reliefUrl(region, theme ?? t)} x={0} y={0} width={R.width} height={R.height} preserveAspectRatio="none" className="terrain-relief" />;
}

// ---------------------------------------------------------------------------
// Overlays (map units in, CSS px sizes)

export type RouteLineProps = {
  /** Points in map units (smoothed), or ready-made path data. */
  points?: readonly Pt[];
  d?: string;
  /**
   * route  the drive: casing, amber stroke, glow in dark
   * next   the next leg: dashed ember
   * muted  a leg already driven or an alternative
   */
  variant?: 'route' | 'next' | 'muted';
  /** 0..1 drawn length (number or MotionValue), for the route drawing itself. */
  progress?: number | MotionValue<number>;
  /** Main stroke width in px. */
  width?: number;
};

export function RouteLine({ points, d, variant = 'route', progress, width }: RouteLineProps) {
  const { k, theme, uid } = useTerrain();
  const path = d ?? splinePath(points ?? []);
  const pl = progress === undefined ? undefined : progress;
  const common = { d: path, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const draw = pl === undefined ? {} : { style: { pathLength: pl } };
  if (variant === 'next') {
    const w = (width ?? 2.6) / k;
    return (
      <g className="map-route map-route-next">
        <motion.path {...common} {...draw} stroke="var(--route-case)" strokeWidth={w + 3 / k} opacity={0.8} />
        <motion.path {...common} {...draw} stroke="var(--route-2)" strokeWidth={w} strokeDasharray={`${4 / k} ${4 / k}`} />
      </g>
    );
  }
  if (variant === 'muted') {
    const w = (width ?? 2) / k;
    return <motion.path {...common} {...draw} stroke="var(--text-3)" strokeWidth={w} opacity={0.7} strokeDasharray={`${1 / k} ${4 / k}`} />;
  }
  const w = (width ?? 3) / k;
  const gid = `${uid}-rg`;
  return (
    <g className="map-route">
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--route-2)" />
          <stop offset="1" stopColor="var(--route)" />
        </linearGradient>
      </defs>
      <motion.path {...common} {...draw} stroke="var(--route-case)" strokeWidth={w + 3.5 / k} />
      {theme === 'dark' && <motion.path {...common} {...draw} stroke="var(--route-2)" strokeWidth={w * 2} opacity={0.5} filter={`url(#${uid}-glow)`} />}
      <motion.path {...common} {...draw} stroke={`url(#${gid})`} strokeWidth={w} />
    </g>
  );
}

/**
 * A stop marker. minor: small ink dot. major: amber (destinations, the pass).
 * here: where you are now, with a soft halo.
 */
export function StopDot({ at, kind = 'minor' }: { at: Pt; kind?: 'minor' | 'major' | 'here' }) {
  const { k, theme } = useTerrain();
  const [x, y] = at;
  if (kind === 'here') {
    return (
      <g className="map-stop map-stop-here">
        <circle cx={x} cy={y} r={12 / k} fill="var(--accent-soft)" />
        <circle cx={x} cy={y} r={6.5 / k} fill="var(--accent)" stroke="var(--bg-2)" strokeWidth={2.5 / k} />
      </g>
    );
  }
  if (kind === 'major') {
    return (
      <g className="map-stop map-stop-major">
        {theme === 'dark' && <circle cx={x} cy={y} r={9 / k} fill="var(--accent-mark)" opacity={0.25} />}
        <circle cx={x} cy={y} r={5.5 / k} fill="var(--accent-mark)" stroke="var(--stop-ring)" strokeWidth={2.5 / k} />
      </g>
    );
  }
  return <circle className="map-stop" cx={x} cy={y} r={3.6 / k} fill="var(--stop)" stroke="var(--stop-ring)" strokeWidth={2 / k} />;
}

export type MapLabelProps = {
  at: Pt;
  title: string;
  /** Second line: arrival time, elevation ("9,945 ft · 6:50 pm"). */
  sub?: string;
  /** Emphasized first part of `sub` in amber text (elevation at the pass). */
  subAccent?: string;
  /** Which side of the point the label sits on. */
  side?: 'right' | 'left' | 'above' | 'below';
  /** Extra offset in px [dx, dy], e.g. to clear the route line. */
  offset?: readonly [number, number];
  /** Draw a hairline from the point to the offset label. */
  leader?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Stop label with a halo in the page color and a feathered backing, so the
 * text sits on calm ground whatever the relief does. Keep labels off the
 * route line: choose `side`, add `offset` + `leader` when crowded, and drop
 * minor stops at overview zoom.
 */
export function MapLabel({ at, title, sub, subAccent, side = 'right', offset = [0, 0], leader, size = 'md' }: MapLabelProps) {
  const { k, uid } = useTerrain();
  const fs = (size === 'lg' ? 13 : size === 'sm' ? 10.5 : 11.5) / k;
  const fs2 = (size === 'sm' ? 9.5 : 10.5) / k;
  const gap = 9 / k;
  const [ox, oy] = [offset[0] / k, offset[1] / k];
  const anchor = side === 'left' ? 'end' : side === 'right' ? 'start' : 'middle';
  const x = at[0] + ox + (side === 'right' ? gap : side === 'left' ? -gap : 0);
  const lines = sub ? 2 : 1;
  const blockH = fs * 1.15 + (sub ? fs2 * 1.25 : 0);
  const top = side === 'above' ? at[1] + oy - gap - blockH : side === 'below' ? at[1] + oy + gap : at[1] + oy - blockH / 2;
  const y1 = top + fs * 0.92;
  const y2 = y1 + fs2 * 1.28;
  // Rough text extent for the feathered backing.
  const wEst = Math.max(title.length * fs * 0.56, (sub ?? '').length * fs2 * 0.55);
  const bx = anchor === 'start' ? x - 3 / k : anchor === 'end' ? x - wEst + 3 / k : x - wEst / 2;
  const halo = { stroke: 'var(--map-halo)', strokeWidth: 3.2 / k, strokeLinejoin: 'round' as const, paintOrder: 'stroke' as const };
  return (
    <g className="map-label">
      {leader && <line x1={at[0]} y1={at[1]} x2={x + (anchor === 'start' ? -2 / k : anchor === 'end' ? 2 / k : 0)} y2={top + blockH / 2} stroke="var(--text-3)" strokeWidth={0.8 / k} opacity={0.8} />}
      <rect x={bx} y={top - 2 / k} width={wEst} height={blockH + 4 / k} rx={4 / k} fill="var(--map-halo)" opacity={0.6} filter={`url(#${uid}-feather)`} />
      <text x={x} y={y1} textAnchor={anchor} fontSize={fs} fontWeight={600} fill="var(--text)" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.005em' }} {...halo}>
        {title}
      </text>
      {lines > 1 && (
        <text x={x} y={y2} textAnchor={anchor} fontSize={fs2} fontWeight={500} fill="var(--text-2)" style={{ fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums' }} {...halo}>
          {subAccent && (
            <tspan fill="var(--accent-text)" fontWeight={600}>
              {subAccent}
            </tspan>
          )}
          {subAccent && sub ? ' · ' : ''}
          {sub}
        </text>
      )}
    </g>
  );
}

/** A body of water's name, in the italic serif. */
export function WaterLabel({ at, children, size = 12.5 }: { at: Pt; children: string; size?: number }) {
  const { k } = useTerrain();
  return (
    <text x={at[0]} y={at[1]} textAnchor="middle" dominantBaseline="middle" fontSize={size / k} fill="var(--water-text)" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', letterSpacing: '0.02em' }}>
      {children}
    </text>
  );
}
