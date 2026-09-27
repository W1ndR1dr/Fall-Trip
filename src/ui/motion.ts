// Motion tokens. Two families of springs:
//   settle: critically damped, no bounce, no overshoot. Navigation and layout.
//   alive:  a small bounce. Only where someone just *did* something
//           (found a leaf, checked a box). Never on navigation.
// Everything runs inside <MotionConfig reducedMotion="user">, which drops
// transforms for people who ask for less motion; use `useCalm()` when an
// effect needs an explicit opacity/instant fallback.
import { useReducedMotion, type Transition, type Variants } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

type Spring = Transition & { type: 'spring' };

export const spring = {
  // settle ---------------------------------------------------------------
  /** Presses and tiny UI state (switch knob, chip). ~0.15 s. */
  snap: { type: 'spring', stiffness: 800, damping: 56, mass: 1 } as Spring,
  /** Page push/pop, card to detail. ~0.42 s, critically damped. */
  glide: { type: 'spring', stiffness: 380, damping: 40, mass: 1 } as Spring,
  /** Tab lens, segmented thumb, stepper lens. ~0.28 s. */
  indicator: { type: 'spring', stiffness: 520, damping: 42, mass: 0.8 } as Spring,
  /** Bottom sheets. */
  sheet: { type: 'spring', stiffness: 420, damping: 42, mass: 1 } as Spring,
  /** Map camera moves (route story, viewBox changes). */
  camera: { type: 'spring', visualDuration: 0.7, bounce: 0 } as Spring,
  /** Content entering (fade-up, list items). */
  enter: { type: 'spring', visualDuration: 0.45, bounce: 0 } as Spring,
  /** Progress bars filling. */
  fill: { type: 'spring', stiffness: 200, damping: 30, mass: 1 } as Spring,

  // alive ----------------------------------------------------------------
  /** Check box fill, pip fill, badge in. Small overshoot. */
  pop: { type: 'spring', stiffness: 700, damping: 28, mass: 1 } as Spring,
  /** The hunt "found it" jump. Bounce ~0.45. */
  bounce: { type: 'spring', stiffness: 400, damping: 14, mass: 1 } as Spring,
} as const;

export type SpringName = keyof typeof spring;

/** Short tweens for pure opacity/color changes. */
export const fade = {
  quick: { duration: 0.12, ease: 'easeOut' } as Transition,
  base: { duration: 0.18, ease: 'easeOut' } as Transition,
  slow: { duration: 0.3, ease: 'easeOut' } as Transition,
};

// ---------------------------------------------------------------------------
// Shared variants

/** Fade up 10 px. Use for content that arrives after data or a tap. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: spring.enter },
};

/**
 * List stagger: 35 ms apart, total capped at 0.25 s so long lists never
 * drag. Put `variants={stagger(n)}` on the parent and `variants={fadeUp}` on
 * each child. Run it on first mount per session only (see `useFirstVisit`).
 */
export function stagger(count: number, each = 0.035, cap = 0.25): Variants {
  const gap = count > 1 ? Math.min(each, cap / (count - 1)) : 0;
  return { hidden: {}, show: { transition: { staggerChildren: gap } } };
}

const seen = new Set<string>();
/** True the first time `key` mounts this session. Restored views skip entrances. */
export function useFirstVisit(key: string): boolean {
  const [first] = useState(() => !seen.has(key));
  useEffect(() => {
    seen.add(key);
  }, [key]);
  return first;
}

// ---------------------------------------------------------------------------
// Reduced motion

/** True when the person asked for less motion. Swap movement for opacity. */
export function useCalm(): boolean {
  return useReducedMotion() ?? false;
}

/** Pick a transition: the spring normally, a short fade when calm. */
export function useSpringFor(name: SpringName): Transition {
  const calm = useCalm();
  return calm ? fade.base : spring[name];
}

// ---------------------------------------------------------------------------
// Press

export const pressScale = { card: 0.97, button: 0.96, small: 0.94, tile: 0.92 } as const;

/**
 * Press state with a 60 ms delay, so a finger that starts a scroll never
 * flashes a pressed card. A quick tap (released before the delay) still
 * shows a brief press. Movement over 8 px cancels.
 *
 *   const press = usePress();
 *   <motion.button {...press.bind} animate={{ scale: press.pressed ? .97 : 1 }}
 *     transition={press.transition} data-pressed={press.pressed || undefined} />
 */
export function usePress({ delay = 60, disabled = false }: { delay?: number; disabled?: boolean } = {}) {
  const [pressed, setPressed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const start = useRef<{ x: number; y: number; t: number; shown: boolean } | null>(null);

  const clear = () => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
  };
  useEffect(() => clear, []);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
      start.current = { x: e.clientX, y: e.clientY, t: performance.now(), shown: false };
      clear();
      timer.current = window.setTimeout(() => {
        if (start.current) start.current.shown = true;
        setPressed(true);
      }, delay);
    },
    [delay, disabled],
  );
  const end = useCallback((commit: boolean) => {
    const s = start.current;
    start.current = null;
    clear();
    if (commit && s && !s.shown) {
      // Quick tap: show a short press so the tap feels acknowledged.
      setPressed(true);
      timer.current = window.setTimeout(() => setPressed(false), 90);
    } else {
      setPressed(false);
    }
  }, []);
  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    const s = start.current;
    if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 8) end(false);
  }, [end]);

  return {
    pressed,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: () => end(true),
      onPointerCancel: () => end(false),
      // Touch fires pointerleave right after pointerup, which would cancel the
      // quick-tap acknowledgement; only a mouse leaving mid-press cancels.
      // (Touch cancels arrive as pointercancel or the 8 px move check.)
      onPointerLeave: (e: ReactPointerEvent) => {
        if (e.pointerType === 'mouse' && start.current) end(false);
      },
    },
    transition: pressed ? { type: 'spring' as const, stiffness: 800, damping: 40 } : { type: 'spring' as const, stiffness: 500, damping: 30 },
  };
}
