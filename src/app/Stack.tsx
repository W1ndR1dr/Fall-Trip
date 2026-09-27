// The page stack: one frame per location, animated by how we got there.
//   push  new page slides in from the right; the old one slides 28% left and dims
//   pop   the reverse
//   fade  tab switch: quick cross-fade, no slide (like iOS)
//   none  replace: instant
// Reduced motion turns every mode into a short cross-fade.
// In the installed app (standalone), a drag from the left edge goes back.
import { AnimatePresence, animate, motion, useDragControls, useIsPresent, useMotionValue, type TargetAndTransition, type Variants } from 'motion/react';
import { Suspense, useEffect, useMemo, useRef, type PointerEvent } from 'react';
import { Route, Router, Switch, matchRoute, useLocation, useRouter } from 'wouter';
import { spring, useCalm } from '@/ui/motion';
import { FrameContext } from './frame';
import { canGoBack, goBack, isStandalone, lastNavigation, navigate, tabOf, type NavMode } from './nav';
import { ROUTES } from './routes';
import { NotFound } from './NotFound';

const variants: Variants = {
  enter: (m: NavMode): TargetAndTransition =>
    m === 'push' ? { x: '100%', opacity: 1, zIndex: 2, '--dim': 0 } : m === 'pop' ? { x: '-28%', opacity: 1, zIndex: 1, '--dim': 1 } : m === 'fade' ? { x: 0, opacity: 0, zIndex: 2, '--dim': 0 } : { x: 0, opacity: 1, zIndex: 2, '--dim': 0 },
  center: (m: NavMode): TargetAndTransition => ({
    x: 0,
    opacity: 1,
    '--dim': 0,
    transition: m === 'fade' ? { opacity: { duration: 0.16, ease: 'easeOut' } } : m === 'none' ? { duration: 0 } : spring.glide,
  }),
  exit: (m: NavMode): TargetAndTransition =>
    m === 'push'
      ? { x: '-28%', zIndex: 1, '--dim': 1, transition: spring.glide }
      : m === 'pop'
        ? { x: '100%', zIndex: 3, '--dim': 0, transition: spring.glide }
        : m === 'fade'
          ? { opacity: 0, zIndex: 1, transition: { duration: 0.12, ease: 'easeOut' } }
          : { opacity: 0, transition: { duration: 0 } },
};

export function Stack() {
  const [location] = useLocation();
  const router = useRouter();
  const calm = useCalm();
  const nav = lastNavigation();
  let mode: NavMode = nav.to === location ? nav.mode : 'none';
  if (calm && mode !== 'none') mode = 'fade';

  // Frames are keyed by route (or the route's own key), so pages that are
  // "the same page" (Plan days) update in place.
  let key = location;
  for (const r of ROUTES) {
    const [ok, params] = matchRoute(router.parser, r.path, location);
    if (ok) {
      key = r.key ? r.key(params as Record<string, string>) : location;
      break;
    }
  }

  // Move focus to <main> after navigation, for screen readers and keyboards.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [location]);

  return (
    <AnimatePresence initial={false} custom={mode}>
      <Frame key={key} path={location} mode={mode} />
    </AnimatePresence>
  );
}

function Frame({ path, mode }: { path: string; mode: NavMode }) {
  const present = useIsPresent();
  // Freeze the location for this frame so an exiting page keeps its content.
  const hook = useMemo(() => {
    const h = () => [path, navigate] as [string, typeof navigate];
    return h;
  }, [path]);
  const frame = useMemo(() => ({ path, mode, present }), [path, mode, present]);

  // Edge-swipe back (installed app only; Safari has its own gesture).
  const x = useMotionValue<string | number>(0);
  const controls = useDragControls();
  const swipe = present && isStandalone() && canGoBack() && tabOf(path) !== 'none';
  const width = () => window.innerWidth || 390;
  const onEdgeDown = (e: PointerEvent) => controls.start(e);

  return (
    <motion.div
      className="frame"
      custom={mode}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      style={{ x }}
      inert={!present}
      aria-hidden={!present || undefined}
      drag={swipe ? 'x' : false}
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 1 }}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (info.offset.x > width() * 0.35 || info.velocity.x > 500) {
          goBack('/');
        } else {
          animate(x, 0, spring.glide);
        }
      }}
    >
      <FrameContext.Provider value={frame}>
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
      </FrameContext.Provider>
      {swipe && <div className="edge-swipe" onPointerDown={onEdgeDown} aria-hidden="true" />}
    </motion.div>
  );
}
