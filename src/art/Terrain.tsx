// Lit terrain. The relief is pre-rendered per theme (scripts/relief.mjs) as a
// few high-resolution tiles, and everything you draw on it (route, stops,
// labels) is live SVG in the SAME map coordinate system as src/art/geo.ts.
//
//   <Terrain region="route" crop={[0, 52, 420, 377]} fade="y" label="The drive from the Bay Area to Mammoth Lakes">
//     <RouteLine points={FRIDAY_DRIVE} />
//     <StopDot at={stop('route', 'tioga')!} kind="major" />
//     <MapLabel at={stop('route', 'tioga')!} title="Tioga Pass" sub="9,945 ft · 6:50 pm" />
//     <WaterLabel at={stop('route', 'monolake')!}>Mono Lake</WaterLabel>
//   </Terrain>
//
// Layers: the relief sits in its own layer, and only that layer carries the
// edge fade, so the route, stops and labels stay at full strength. Overlays
// sit on top, unmasked.
//
// Camera: pass `camera` ({ x, y, zoom } motion values; see useCamera) to move
// and zoom over the base `crop`. The camera is a CSS transform on both layers (compositor
// only; nothing re-lays out), strokes and labels are counter-scaled in flight,
// and sizes snap exactly when the camera settles.
//
// Sizes inside overlays are CSS px; `useTerrain().k` converts (px per map
// unit, measured from the rendered size, times the settled zoom).
import { animate, useMotionValue, useTransform, motion, type MotionValue, type SVGMotionProps, type Transition } from 'motion/react';
import { createContext, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { useTheme, type ResolvedTheme } from '@/lib/theme';
import { REGIONS, splinePath, type Crop, type Pt, type Region } from './geo';
import { RELIEF_TILES } from './terrain-data';

type TerrainCtx = { region: Region; k: number; theme: ResolvedTheme; uid: string; iz: MotionValue<number>; routeMask?: string };
const Ctx = createContext<TerrainCtx>({ region: 'route', k: 1, theme: 'light', uid: 't', iz: undefined as unknown as MotionValue<number> });
/** Inside <Terrain>: the region, px-per-unit scale `k`, theme, and the in-flight counter-scale `iz`. */
export const useTerrain = () => useContext(Ctx);

/** The relief tiles for a region and theme (URLs and map-unit rects). */
export const reliefTiles = (region: Region, theme: ResolvedTheme) =>
  RELIEF_TILES[region][theme].map((t) => ({ ...t, href: `${import.meta.env.BASE_URL}img/topo/${t.f}` }));

/** Where the camera looks: center in map units, and zoom relative to the base crop. */
export type Camera = { x: number; y: number; zoom: number };
/** A live camera: one motion value per axis (derive them from scroll, or use useCamera). */
export type CameraValues = { x: MotionValue<number>; y: MotionValue<number>; zoom: MotionValue<number> };

/**
 * A camera you move imperatively:
 *   const cam = useCamera(cameraFor(base, overview));
 *   cam.to(cameraFor(base, tiogaCrop));          // spring.camera by default
 *   <Terrain crop={base} camera={cam} … />
 */
export function useCamera(initial: Camera) {
  const x = useMotionValue(initial.x);
  const y = useMotionValue(initial.y);
  const zoom = useMotionValue(initial.zoom);
  return useMemo(() => {
    const to = (c: Camera, t: Transition = { type: 'spring', visualDuration: 0.7, bounce: 0 }) =>
      Promise.all([animate(x, c.x, t), animate(y, c.y, t), animate(zoom, c.zoom, t)]);
    const jump = (c: Camera) => {
      x.jump(c.x);
      y.jump(c.y);
      zoom.jump(c.zoom);
    };
    return { x, y, zoom, to, jump };
  }, [x, y, zoom]);
}

/**
 * The camera that frames `target` inside a Terrain whose base crop is `base`
 * (both [x, y, w, h] in map units). Use it to author chapter framings.
 */
export function cameraFor(base: Crop, target: Crop): Camera {
  return { x: target[0] + target[2] / 2, y: target[1] + target[3] / 2, zoom: Math.min(base[2] / target[2], base[3] / target[3]) };
}

export type TerrainProps = {
  region: Region;
  /** Visible part as [x, y, w, h] map units (default: the whole region). With a camera, this is the base framing. */
  crop?: Crop;
  /** Animated camera over the base crop (useCamera, or your own x/y/zoom motion values). */
  camera?: CameraValues;
  /** slice fills the box (cropping), meet shows the whole crop. */
  fit?: 'slice' | 'meet';
  /** Feather the relief's edges into the page (overlays stay crisp): y (top+bottom), bottom, top, edges (all four). */
  fade?: 'none' | 'y' | 'top' | 'bottom' | 'edges';
  /** Accessible description. Without it the map is decorative (aria-hidden). */
  label?: string;
  /** Override px-per-unit. */
  scale?: number;
  /** Extra relief drawn into the masked relief layer (e.g. eastside detail via EAST_TO_ROUTE_TRANSFORM). */
  underlay?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Terrain({ region, crop, camera, fit = 'slice', fade = 'none', label, scale, underlay, children, className = '', style }: TerrainProps) {
  const { theme } = useTheme();
  const R = REGIONS[region];
  const vb = crop ?? ([0, 0, R.width, R.height] as const);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const sizeRef = useRef(size);
  sizeRef.current = size;
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

  const k0 = scale ?? (size ? (fit === 'slice' ? Math.max(size.w / vb[2], size.h / vb[3]) : Math.min(size.w / vb[2], size.h / vb[3])) : 1);

  // Camera: the settled zoom drives React sizes; `iz` corrects them in flight.
  const fx = useMotionValue(vb[0] + vb[2] / 2);
  const fy = useMotionValue(vb[1] + vb[3] / 2);
  const fz = useMotionValue(1);
  const cx = camera?.x ?? fx, cy = camera?.y ?? fy, cz = camera?.zoom ?? fz;
  const [zs, setZs] = useState(() => cz.get());
  const zsRef = useRef(zs);
  zsRef.current = zs;
  const iz = useMotionValue(1);
  const moving = useMotionValue<'transform' | 'auto'>('auto');
  useEffect(() => {
    if (!camera) return;
    let settle: number | undefined;
    const onMove = () => {
      iz.set(zsRef.current / cz.get());
      moving.set('transform');
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        moving.set('auto'); // lets the relief re-rasterize crisply at rest
        setZs(cz.get());
      }, 160);
    };
    const offs = [cx.on('change', onMove), cy.on('change', onMove), cz.on('change', onMove)];
    return () => {
      offs.forEach((f) => f());
      window.clearTimeout(settle);
    };
  }, [camera, cx, cy, cz, iz, moving]);
  useLayoutEffect(() => {
    iz.set(zs / cz.get());
  }, [zs, cz, iz]);

  // Read through a ref: motion keeps the first transformer's closure for its
  // subscriptions, and k0 / the crop change after the first measure.
  const geom = useRef({ k0, vb, on: !!camera });
  geom.current = { k0, vb, on: !!camera };
  const transform = useTransform([cx, cy, cz], ([x, y, z]: number[]) => {
    const s = sizeRef.current;
    const { k0: k, vb, on } = geom.current;
    if (!on || !s) return 'none';
    const ox = (s.w - vb[2] * k) / 2;
    const oy = (s.h - vb[3] * k) / 2;
    const sx = (x - vb[0]) * k + ox;
    const sy = (y - vb[1]) * k + oy;
    return `translate3d(${(s.w / 2 - z * sx).toFixed(2)}px, ${(s.h / 2 - z * sy).toFixed(2)}px, 0) scale(${z.toFixed(4)})`;
  });

  const k = k0 * (camera ? zs : 1);
  const routeMask = fade !== 'none' && size ? `url(#${uid}-fade)` : undefined;
  const ctx = useMemo(() => ({ region, k, theme, uid, iz, routeMask }), [region, k, theme, uid, iz, routeMask]);
  // The visible area in map units (for the route's edge fade).
  const vis = size ? [vb[0] + vb[2] / 2 - size.w / k0 / 2, vb[1] + vb[3] / 2 - size.h / k0 / 2, size.w / k0, size.h / k0] : vb;
  const viewBox = vb.join(' ');
  const par = `xMidYMid ${fit}`;
  const stageStyle = camera ? { transform, transformOrigin: '0 0' } : undefined;

  return (
    <div
      ref={box}
      className={`terrain ${className}`}
      style={{ aspectRatio: style?.height || style?.aspectRatio ? undefined : `${vb[2]} / ${vb[3]}`, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div className={`terrain-layer terrain-fade-${fade}`}>
        <motion.div className="terrain-stage" style={camera ? { ...stageStyle, willChange: moving } : undefined}>
          <svg className="terrain-svg" viewBox={viewBox} preserveAspectRatio={par}>
            <Relief region={region} theme={theme} />
            {underlay}
          </svg>
        </motion.div>
      </div>
      <div className="terrain-layer">
        <motion.div className="terrain-stage" style={camera ? { ...stageStyle, willChange: moving } : undefined}>
          <svg className="terrain-svg" viewBox={viewBox} preserveAspectRatio={par}>
            <defs>
              {/* Feathered backing for labels: a soft pool of page color, no filter. */}
              <radialGradient id={`${uid}-feather`} cx="0.5" cy="0.5" r="0.5">
                <stop offset="0.55" stopColor="var(--map-halo)" stopOpacity="0.72" />
                <stop offset="1" stopColor="var(--map-halo)" stopOpacity="0" />
              </radialGradient>
              {/* The route line (only) fades toward the same edges as the relief; labels and stops never do. */}
              {fade !== 'none' && (
                <mask id={`${uid}-fade`} maskUnits="userSpaceOnUse" x={vis[0]} y={vis[1]} width={vis[2]} height={vis[3]}>
                  {fade === 'edges' ? (
                    <radialGradient id={`${uid}-fg`} cx="0.5" cy="0.5" r="0.6">
                      <stop offset="0.55" stopColor="#fff" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </radialGradient>
                  ) : (
                    <linearGradient id={`${uid}-fg`} x1="0" y1="0" x2="0" y2="1">
                      {(fade === 'y' ? [[0, 0], [0.14, 1], [0.8, 1], [1, 0]] : fade === 'top' ? [[0, 0], [0.22, 1]] : [[0.7, 1], [1, 0]]).map(([o, a]) => (
                        <stop key={o} offset={o} stopColor="#fff" stopOpacity={a} />
                      ))}
                    </linearGradient>
                  )}
                  <rect x={vis[0]} y={vis[1]} width={vis[2]} height={vis[3]} fill={`url(#${uid}-fg)`} />
                </mask>
              )}
            </defs>
            <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * The relief raster as SVG <image> tiles in map units. Use in a Terrain's
 * `underlay` to draw the other region too, e.g. eastside detail on the route map:
 *   underlay={<g transform={EAST_TO_ROUTE_TRANSFORM}><Relief region="eastside" /></g>}
 */
export function Relief({ region, theme }: { region: Region; theme?: ResolvedTheme }) {
  const t = useTheme().theme;
  return (
    <g className="terrain-relief">
      {reliefTiles(region, theme ?? t).map((tile) => (
        <image key={tile.f} href={tile.href} x={tile.x} y={tile.y} width={tile.w} height={tile.h} preserveAspectRatio="none" />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Counter-scaling in flight (camera moving): cheap attribute writes, no React.

function useCounter<E extends SVGElement>(ref: RefObject<E | null>, apply: (el: E, iz: number) => void) {
  const { iz } = useTerrain();
  const fn = useRef(apply);
  fn.current = apply;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !iz) return;
    fn.current(el, iz.get());
    return iz.on('change', (v) => ref.current && fn.current(ref.current, v));
  });
}

/** A <g> that keeps its content at constant screen size around `at` while the camera zooms. */
function Counter({ at, children, className }: { at: Pt; children: ReactNode; className?: string }) {
  const ref = useRef<SVGGElement>(null);
  useCounter(ref, (el, v) => {
    if (Math.abs(v - 1) < 1e-4) el.removeAttribute('transform');
    else el.setAttribute('transform', `translate(${at[0]} ${at[1]}) scale(${v}) translate(${-at[0]} ${-at[1]})`);
  });
  return (
    <g ref={ref} className={className}>
      {children}
    </g>
  );
}

/** A path whose stroke keeps its screen width while the camera zooms. */
type StrokeProps = Omit<SVGMotionProps<SVGPathElement>, 'ref'> & { width: number };
function Stroke({ width, ...rest }: StrokeProps) {
  const ref = useRef<SVGPathElement>(null);
  useCounter(ref, (el, v) => el.setAttribute('stroke-width', String(width * v)));
  return <motion.path ref={ref} strokeWidth={width} {...rest} />;
}

// ---------------------------------------------------------------------------
// Overlays (map units in, CSS px sizes)

export type RouteLineProps = {
  /** Points in map units (smoothed), or ready-made path data. */
  points?: readonly Pt[];
  d?: string;
  /**
   * route  the drive: casing, amber stroke, a soft glow in dark
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
  const { k, theme, uid, routeMask } = useTerrain();
  const path = d ?? splinePath(points ?? []);
  const common = { d: path, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const draw = progress === undefined ? {} : { style: { pathLength: progress } };
  if (variant === 'next') {
    const w = (width ?? 2.6) / k;
    return (
      <g className="map-route map-route-next" mask={routeMask}>
        <Stroke {...common} {...draw} stroke="var(--route-case)" width={w + 3 / k} opacity={0.8} />
        <Stroke {...common} {...draw} stroke="var(--route-2)" width={w} strokeDasharray={`${4 / k} ${4 / k}`} />
      </g>
    );
  }
  if (variant === 'muted') {
    const w = (width ?? 2) / k;
    return (
      <g mask={routeMask}>
        <Stroke {...common} {...draw} stroke="var(--text-3)" width={w} opacity={0.7} strokeDasharray={`${1 / k} ${4 / k}`} />
      </g>
    );
  }
  const w = (width ?? 3) / k;
  const gid = `${uid}-rg`;
  return (
    <g className="map-route" mask={routeMask}>
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--route-2)" />
          <stop offset="1" stopColor="var(--route)" />
        </linearGradient>
      </defs>
      {/* Dark glow: two wide, faint strokes instead of a blur filter, so
          drawing the route (pathLength) never re-filters. Off after dark. */}
      {theme === 'dark' && (
        <g className="map-glow">
          <Stroke {...common} {...draw} stroke="var(--route-2)" width={w * 5} opacity={0.1} />
          <Stroke {...common} {...draw} stroke="var(--route-2)" width={w * 3} opacity={0.22} />
        </g>
      )}
      <Stroke {...common} {...draw} stroke="var(--route-case)" width={w + 3.5 / k} />
      <Stroke {...common} {...draw} stroke={`url(#${gid})`} width={w} />
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
    // The mark is --accent-mark (never bare --accent, which fails 3:1 on the
    // light relief); the halo stays soft.
    return (
      <Counter at={at} className="map-stop map-stop-here">
        <circle cx={x} cy={y} r={13 / k} fill="var(--accent-soft)" />
        {theme === 'dark' && <circle className="map-glow" cx={x} cy={y} r={9.5 / k} fill="var(--accent-mark)" opacity={0.3} />}
        <circle cx={x} cy={y} r={6.5 / k} fill="var(--accent-mark)" stroke="var(--stop-ring)" strokeWidth={2.5 / k} />
      </Counter>
    );
  }
  if (kind === 'major') {
    return (
      <Counter at={at} className="map-stop map-stop-major">
        {theme === 'dark' && <circle className="map-glow" cx={x} cy={y} r={9 / k} fill="var(--accent-mark)" opacity={0.25} />}
        <circle cx={x} cy={y} r={5.5 / k} fill="var(--accent-mark)" stroke="var(--stop-ring)" strokeWidth={2.5 / k} />
      </Counter>
    );
  }
  return (
    <Counter at={at} className="map-stop">
      <circle cx={x} cy={y} r={3.6 / k} fill="var(--stop)" stroke="var(--stop-ring)" strokeWidth={2 / k} />
    </Counter>
  );
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
 * text sits on calm ground whatever the relief does. Labels are never faded
 * with the relief. Keep them off the route line: choose `side`, add `offset`
 * + `leader` when crowded, and drop minor stops at overview zoom.
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
  const padX = 8 / k, padY = 6 / k;
  const bx = (anchor === 'start' ? x - 3 / k : anchor === 'end' ? x - wEst + 3 / k : x - wEst / 2) - padX;
  const halo = { stroke: 'var(--map-halo)', strokeWidth: 3.2 / k, strokeLinejoin: 'round' as const, paintOrder: 'stroke' as const };
  return (
    <Counter at={at} className="map-label">
      {leader && <line x1={at[0]} y1={at[1]} x2={x + (anchor === 'start' ? -2 / k : anchor === 'end' ? 2 / k : 0)} y2={top + blockH / 2} stroke="var(--text-3)" strokeWidth={0.8 / k} opacity={0.8} />}
      <rect x={bx} y={top - padY} width={wEst + padX * 2} height={blockH + padY * 2} fill={`url(#${uid}-feather)`} />
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
    </Counter>
  );
}

/** A body of water's name, in the italic serif. */
export function WaterLabel({ at, children, size = 12.5 }: { at: Pt; children: string; size?: number }) {
  const { k } = useTerrain();
  return (
    <Counter at={at}>
      <text x={at[0]} y={at[1]} textAnchor="middle" dominantBaseline="middle" fontSize={size / k} fill="var(--water-text)" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', letterSpacing: '0.02em' }}>
        {children}
      </text>
    </Counter>
  );
}
