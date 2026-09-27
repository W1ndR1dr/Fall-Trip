// The page stack. The top page is live; the page under it (the previous
// history entry) stays mounted, inert and hidden, so back and the edge swipe
// never wait for a remount.
//
//   push  the new page slides in from the right; the old one slides 28% left,
//         dims, and stays mounted underneath
//   pop   the reverse: the page underneath is already there
//   fade  tab switch: the incoming page fades in ON TOP of the outgoing one,
//         which holds fully opaque (no double exposure, no dip to the page)
//   none  replace (Plan day, Explore filter): same frame, re-renders in place
//   swipe the edge swipe already moved both pages; the stack only settles
// Reduced motion turns every moving mode into the short fade.
//
// Frames are animated imperatively on motion values (x, opacity, --dim,
// z-index, visibility), which keeps a page that changes role (top → under →
// top) mounted instead of re-creating it.
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, usePresence, type MotionValue } from 'motion/react';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent, type ReactNode } from 'react';
import { Route, Router, Switch, matchRoute, useLocation, useRouter } from 'wouter';
import { spring, useCalm } from '@/ui/motion';
import { FrameContext } from './frame';
import { goBack, isStandalone, isTabRoot, lastNavigation, navigate, type NavMode } from './nav';
import { ROUTES } from './routes';
import { NotFound } from './NotFound';

const PARALLAX = 0.28;
const FADE = { duration: 0.16, ease: 'easeOut' } as const;

type Entry = { key: string; path: string };
type Role = 'top' | 'under';
type FrameValues = {
  x: MotionValue<number>;
  opacity: MotionValue<number>;
  dim: MotionValue<number>;
  z: MotionValue<number>;
  vis: MotionValue<string>;
  el: HTMLDivElement | null;
  /** In-flight swipe commit, awaited before the swiped page is removed. */
  settling?: PromiseLike<unknown>;
};
type Registry = Map<string, FrameValues>;

export function Stack() {
  const [location] = useLocation();
  const router = useRouter();
  const calm = useCalm();
  const nav = lastNavigation();
  let mode: NavMode = nav.to === location ? nav.mode : 'none';
  if (calm && mode !== 'none' && mode !== 'swipe') mode = 'fade';
  const modeRef = useRef<NavMode>(mode);
  modeRef.current = mode;

  // Frames are keyed by route (or the route's own key), so pages that are
  // "the same page" (Plan days, Explore filters) update in place.
  let key = location;
  for (const r of ROUTES) {
    const [ok, params] = matchRoute(router.parser, r.path, location);
    if (ok) {
      key = r.key ? r.key(params as Record<string, string>) : location;
      break;
    }
  }

  // Our picture of the history stack, indexed by the depth nav.ts stamps.
  const entries = useRef<Entry[]>([]);
  const idx = nav.idx;
  if (nav.to === location && nav.dir === 'push') entries.current.length = idx;
  entries.current[idx] = { key, path: location };
  const below = idx > 0 ? entries.current[idx - 1] : undefined;
  const under = below && below.key !== key ? below : undefined;

  // A page that was just on screen can become the under page at once. One that
  // has to mount (after a pop) waits until the transition has settled.
  const mounted = useRef(new Set<string>());
  const [settled, setSettled] = useState(nav.seq);
  const ready = !!under && (mounted.current.has(under.key) || settled === nav.seq);
  useEffect(() => {
    if (settled === nav.seq) return;
    // After the transition (~450 ms), when the main thread is idle.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idle = 0;
    const id = window.setTimeout(() => {
      if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setSettled(nav.seq), { timeout: 1500 });
      else setSettled(nav.seq);
    }, 480);
    return () => {
      window.clearTimeout(id);
      if (idle) w.cancelIdleCallback?.(idle);
    };
  }, [nav.seq, settled]);
  useEffect(() => {
    mounted.current = new Set([key, ...(under && ready ? [under.key] : [])]);
  });

  const registry = useRef<Registry>(new Map());

  const swipeOk = !!under && ready && isStandalone() && !isTabRoot(location);

  return (
    <StackPresence>
      {under && ready && <Frame key={under.key} id={under.key} path={under.path} role="under" arrival={mode} modeRef={modeRef} registry={registry} />}
      <Frame key={key} id={key} path={location} role="top" arrival={mode} modeRef={modeRef} registry={registry} underKey={swipeOk ? under!.key : undefined} />
    </StackPresence>
  );
}

// AnimatePresence only keeps exiting frames mounted; frames run their own exits.
function StackPresence({ children }: { children: ReactNode }) {
  return <AnimatePresence initial={false}>{children}</AnimatePresence>;
}

type FrameProps = {
  /** The frame's stack key (same as its React key). */
  id: string;
  path: string;
  role: Role;
  /** How the current navigation arrived (for a newly mounted frame). */
  arrival: NavMode;
  /** The live navigation mode (read at exit time). */
  modeRef: MutableRefObject<NavMode>;
  registry: MutableRefObject<Registry>;
  /** Set on the top frame when an edge swipe may reveal this page underneath. */
  underKey?: string;
};

function Frame({ id, path, role, arrival, modeRef, registry, underKey }: FrameProps) {
  const [isPresent, safeToRemove] = usePresence();
  const el = useRef<HTMLDivElement>(null);
  const width = () => el.current?.offsetWidth || window.innerWidth || 390;

  const x = useMotionValue(0);
  const opacity = useMotionValue(1);
  const dim = useMotionValue(0);
  const z = useMotionValue(role === 'top' ? 2 : 1);
  const vis = useMotionValue(role === 'top' ? 'visible' : 'hidden');
  const values = useRef<FrameValues>({ x, opacity, dim, z, vis, el: null });

  // The Stack (focus) and the frame above (edge swipe) find us by key.
  useLayoutEffect(() => {
    const r = registry.current;
    r.set(id, values.current);
    return () => {
      if (r.get(id) === values.current) r.delete(id);
    };
  }, [id, registry]);

  // Freeze the location for this frame so an exiting page keeps its content.
  const hook = useMemo(() => {
    const h = () => [path, navigate] as [string, typeof navigate];
    return h;
  }, [path]);
  // The screen itself only re-renders when its path changes: a role change
  // (top ↔ under) updates the frame context, not the whole screen tree.
  const content = useMemo(
    () => (
      <Router hook={hook}>
        <Suspense fallback={<div className="page" aria-busy="true" />}>
          <Switch location={path}>
            {ROUTES.map((r) => (
              <Route key={r.path} path={r.path} component={r.Component as never} />
            ))}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    ),
    [hook, path],
  );
  const active = isPresent && role === 'top';

  // `inert` restyles the page's whole subtree, so an arriving page only
  // drops it once its transition has settled (nobody can use a page that is
  // still sliding in). Then focus moves to its title, so VoiceOver reads the
  // page name and keyboard users start at the top. Leaving pages go inert at once.
  const [interactive, setInteractive] = useState(active && (arrival === 'none' || arrival === 'swipe'));
  const firstMount = useRef(true);
  useEffect(() => {
    const initial = firstMount.current;
    firstMount.current = false;
    if (!active) {
      setInteractive(false);
      return;
    }
    const m = modeRef.current;
    const focus = !(initial && arrival === 'none') && m !== 'none';
    const ready = () => {
      setInteractive(true);
      if (focus)
        requestAnimationFrame(() => {
          const h1 = el.current?.querySelector<HTMLElement>('h1');
          (h1 ?? document.getElementById('main'))?.focus({ preventScroll: true });
        });
    };
    if (m === 'none' || m === 'swipe' || initial && arrival === 'none') return ready();
    // After the transition, at the next idle moment.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idle = 0;
    const id = window.setTimeout(() => {
      if (w.requestIdleCallback) idle = w.requestIdleCallback(ready, { timeout: 300 });
      else ready();
    }, m === 'fade' ? 180 : 440);
    return () => {
      window.clearTimeout(id);
      if (idle) w.cancelIdleCallback?.(idle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  const frame = useMemo(() => ({ path, mode: arrival, present: active }), [path, arrival, active]);

  // Arrival and role changes.
  const prevRole = useRef<Role | null>(null);
  useLayoutEffect(() => {
    if (!isPresent) return;
    const from = prevRole.current;
    prevRole.current = role;
    const W = width();
    const m = modeRef.current;
    const stops: { stop: () => void }[] = [];
    const run = (mv: MotionValue<number>, to: number, t: object) => stops.push(animate(mv, to, t));

    if (role === 'top') {
      z.set(2);
      vis.set('visible');
      if (from === null) {
        // Newly mounted on top.
        if (arrival === 'push') {
          x.set(W);
          opacity.set(1);
          dim.set(0);
          run(x, 0, spring.glide);
        } else if (arrival === 'pop') {
          // No page was kept underneath (e.g. after a reload): slide in from under.
          x.set(-W * PARALLAX);
          dim.set(1);
          run(x, 0, spring.glide);
          run(dim, 0, spring.glide);
        } else if (arrival === 'fade') {
          x.set(0);
          dim.set(0);
          opacity.set(0);
          run(opacity, 1, FADE);
        }
      } else if (from === 'under') {
        // The page underneath comes back.
        if (m === 'swipe') {
          // The swipe is already animating it into place.
        } else if (m === 'fade' || m === 'none') {
          x.set(0);
          dim.set(0);
          if (m === 'fade') {
            opacity.set(0);
            run(opacity, 1, FADE);
          } else opacity.set(1);
        } else {
          opacity.set(1);
          run(x, 0, spring.glide);
          run(dim, 0, spring.glide);
        }
      }
    } else {
      z.set(1);
      if (from === null) {
        // Mounted underneath after a pop settled: park it, hidden.
        x.set(-W * PARALLAX);
        dim.set(1);
        opacity.set(1);
        vis.set('hidden');
      } else if (from === 'top') {
        if (m === 'push') {
          const a = animate(x, -W * PARALLAX, spring.glide);
          run(dim, 1, spring.glide);
          stops.push(a);
          a.then(() => prevRole.current === 'under' && vis.set('hidden'));
        } else {
          // fade (tab switch) or calm: hold still and opaque while the new
          // page fades in on top, then park.
          const id = window.setTimeout(() => {
            if (prevRole.current !== 'under') return;
            x.set(-W * PARALLAX);
            dim.set(1);
            vis.set('hidden');
          }, 200);
          stops.push({ stop: () => window.clearTimeout(id) });
        }
      }
    }
    // Animations are not stopped on re-run: a new animate() on the same value
    // interrupts the old one, which is what an interrupted gesture needs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, isPresent]);

  // Exit (removed from the stack).
  useLayoutEffect(() => {
    if (isPresent) return;
    const m = modeRef.current;
    const done = () => safeToRemove?.();
    if (prevRole.current === 'under') return done();
    if (m === 'swipe') {
      z.set(3);
      Promise.resolve(values.current.settling).then(done);
    } else if (m === 'pop') {
      z.set(3);
      animate(x, width(), spring.glide).then(done);
    } else if (m === 'fade') {
      // Hold opaque under the incoming page, then go.
      z.set(1);
      window.setTimeout(done, FADE.duration * 1000 + 20);
    } else if (m === 'push') {
      z.set(1);
      animate(x, -width() * PARALLAX, spring.glide).then(done);
      animate(dim, 1, spring.glide);
    } else done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  // Edge swipe back (installed app only; Safari has its own gesture).
  const controls = useDragControls();
  const swipe = active && !!underKey;
  const onEdgeDown = (e: PointerEvent) => controls.start(e);
  const below = () => (underKey ? registry.current.get(underKey) : undefined);

  return (
    <motion.div
      ref={(n) => {
        el.current = n;
        values.current.el = n;
      }}
      className="frame"
      data-role={active ? 'top' : 'under'}
      // Parked pages use content-visibility: hidden, which skips painting
      // them but keeps their style and layout cached, so revealing one is cheap
      // (visibility: hidden would restyle the whole page on the way back).
      style={{ x, opacity, zIndex: z, contentVisibility: vis } as never}
      inert={!(active && interactive)}
      aria-hidden={!active || undefined}
      // Children measure layout relative to the frame (it slides), so page
      // transitions never set off layout animations inside the page.
      layoutRoot
      drag={swipe ? 'x' : false}
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 1 }}
      dragMomentum={false}
      onDragStart={() => {
        const u = below();
        if (!u) return;
        u.vis.set('visible');
        u.opacity.set(1);
        u.dim.set(1);
      }}
      onDrag={() => {
        const u = below();
        if (!u) return;
        const W = width();
        const p = Math.max(0, Math.min(1, x.get() / W));
        u.x.set(-W * PARALLAX * (1 - p));
        u.dim.set(1 - p);
      }}
      onDragEnd={(_, info) => {
        const u = below();
        const W = width();
        const commit = info.offset.x > W * 0.35 || info.velocity.x > 500;
        const v = info.velocity.x;
        if (commit) {
          const a = animate(x, W, { ...spring.glide, velocity: v });
          if (u) {
            animate(u.x, 0, { ...spring.glide, velocity: v * PARALLAX });
            animate(u.dim, 0, spring.glide);
          }
          values.current.settling = a.then(() => undefined);
          goBack('/', { mode: 'swipe' });
        } else {
          animate(x, 0, { ...spring.glide, velocity: v });
          if (u) {
            animate(u.x, -W * PARALLAX, spring.glide);
            animate(u.dim, 1, spring.glide).then(() => u.vis.set('hidden'));
          }
        }
      }}
    >
      <FrameContext.Provider value={frame}>{content}</FrameContext.Provider>
      {/* The push dim: its own layer, animated by opacity. (An inherited
          custom property on the frame would restyle the whole page.) */}
      <motion.div className="frame-dim" style={{ opacity: dim }} aria-hidden="true" />
      {swipe && <div className="edge-swipe" onPointerDown={onEdgeDown} aria-hidden="true" />}
    </motion.div>
  );
}
