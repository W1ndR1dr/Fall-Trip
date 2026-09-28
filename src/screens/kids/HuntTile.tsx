// One leaf-hunt tile: a <button data-hunt-item aria-pressed> with the thing to
// look for drawn as an outline. When a kid finds it, the kid's warm color
// floods the tile from the tap point (a clip-path circle) carrying the full
// fall-color drawing with it, the drawing jumps, and a check pops in. Tapping
// again reverses the flood back into the tap point.
//
// The flood only plays for this kid's own taps (`fx`). Switching kids or
// restoring a saved hunt cross-fades instead, so nothing celebrates by itself.
import { animate, motion, useMotionTemplate, useMotionValue, type AnimationPlaybackControls } from 'motion/react';
import { useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { Specimen } from '@/art';
import { haptic } from '@/lib/feedback';
import { fade, pressScale, spring, useCalm, usePress } from '@/ui';
import { Lightbulb } from '@/ui/icons';

/** A user toggle on this tile: `n` changes once per tap, `at` is the origin in tile px. */
export type TileFx = { n: number; at: [number, number] | null };

export type HuntTileProps = {
  id: string;
  /** Short label a 6-year-old can read ("Aspen leaf"). */
  label: string;
  found: boolean;
  /** 0..2: whose hunt this is (the flood and check use that kid's color). */
  kid: number;
  fx?: TileFx;
  /** Tap: toggle found. `at` is the tap point in tile px (null from the keyboard). */
  onToggle: (id: string, at: [number, number] | null, tile: HTMLElement) => void;
  onHint: (id: string) => void;
};

const FAR = 2000; // a radius that covers any tile
const LONG_PRESS = 480;

export function HuntTile({ id, label, found, kid, fx, onToggle, onHint }: HuntTileProps) {
  const calm = useCalm();
  const press = usePress();
  const k = (kid % 3) + 1;
  const tile = useRef<HTMLButtonElement>(null);

  // Flood: a circle clip on the found layer.
  const r = useMotionValue(FAR);
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const floodOpacity = useMotionValue(found ? 1 : 0);
  const clipPath = useMotionTemplate`circle(${r}px at ${ox}px ${oy}px)`;
  // The drawing's jump (shared by the outline and the color layer).
  const artScale = useMotionValue(1);
  // Check badge.
  const badgeScale = useMotionValue(found ? 1 : 0);
  const badgeRotate = useMotionValue(0);
  const badgeOpacity = useMotionValue(found ? 1 : 0);

  const prev = useRef({ found, n: fx?.n ?? 0 });
  const seq = useRef(0);
  const running = useRef<AnimationPlaybackControls[]>([]);

  useLayoutEffect(() => {
    const was = prev.current;
    const n = fx?.n ?? 0;
    prev.current = { found, n };
    if (was.found === found) return;
    const token = ++seq.current;
    running.current.forEach((a) => a.stop());
    const run = (a: AnimationPlaybackControls) => (running.current.push(a), a);
    running.current = [];
    const mine = n !== was.n;
    const el = tile.current;

    if (!mine || calm || !el) {
      // Kid switch, the hint sheet, or reduced motion: a quiet cross-fade.
      r.set(FAR);
      artScale.set(1);
      badgeRotate.set(0);
      run(animate(floodOpacity, found ? 1 : 0, calm ? { duration: 0.15 } : fade.base));
      run(animate(badgeOpacity, found ? 1 : 0, { duration: 0.15 }));
      badgeScale.set(found ? 1 : 0.6);
      if (found && !calm) run(animate(badgeScale, 1, spring.pop));
      return;
    }

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const [x, y] = fx?.at ?? [w / 2, h / 2];
    const far = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 2;
    ox.set(x);
    oy.set(y);
    if (found) {
      // Continue from an interrupted reverse; otherwise start at the point.
      const cur = r.get();
      r.set(floodOpacity.get() >= 1 && cur < far ? cur : 0);
      floodOpacity.set(1);
      run(
        animate(r, far, {
          type: 'spring',
          visualDuration: 0.62,
          bounce: 0,
          onComplete: () => {
            if (seq.current === token) r.set(FAR);
          },
        }),
      );
      // Jump: a velocity kick on the alive spring (1 → ~1.14 → 1).
      run(animate(artScale, 1, { ...spring.bounce, velocity: 4.4 }));
      badgeScale.set(0);
      badgeRotate.set(-30);
      badgeOpacity.set(1);
      run(animate(badgeScale, 1, { type: 'spring', stiffness: 600, damping: 20, delay: 0.06 }));
      run(animate(badgeRotate, 0, { type: 'spring', stiffness: 600, damping: 20, delay: 0.06 }));
    } else {
      // Gentle reverse: the color drains back into the tap point.
      r.set(Math.min(r.get(), far));
      run(
        animate(r, 0, {
          type: 'spring',
          visualDuration: 0.42,
          bounce: 0,
          onComplete: () => {
            if (seq.current !== token) return;
            floodOpacity.set(0);
            r.set(FAR);
          },
        }),
      );
      run(animate(artScale, 1, { type: 'spring', stiffness: 320, damping: 26, velocity: -1.6 }));
      run(animate(badgeScale, 0.4, { duration: 0.16, ease: 'easeIn' }));
      run(animate(badgeOpacity, 0, { duration: 0.14 }));
      run(animate(badgeRotate, -20, { duration: 0.16 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found, fx?.n]);

  // Long press opens the hint (and swallows the click that follows).
  const hold = useRef<{ t: number; x: number; y: number; fired: boolean } | null>(null);
  const tap = useRef<[number, number] | null>(null);
  const clearHold = () => {
    if (hold.current) window.clearTimeout(hold.current.t);
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    press.bind.onPointerDown(e);
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const b = e.currentTarget.getBoundingClientRect();
    tap.current = [e.clientX - b.left, e.clientY - b.top];
    clearHold();
    const t = window.setTimeout(() => {
      if (!hold.current) return;
      hold.current.fired = true;
      haptic(12);
      onHint(id);
    }, LONG_PRESS);
    hold.current = { t, x: e.clientX, y: e.clientY, fired: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    press.bind.onPointerMove(e);
    const h = hold.current;
    if (h && !h.fired && Math.hypot(e.clientX - h.x, e.clientY - h.y) > 8) {
      clearHold();
      hold.current = null;
    }
  };
  const endHold = () => {
    clearHold();
    // keep `fired` until the click handler has seen it
    if (hold.current && !hold.current.fired) hold.current = null;
  };

  // "Biggest leaf" is drawn oversized and bleeds off its tile: the in-flow art
  // box keeps the tile's height, and the drawing hangs off the corner.
  const big = id === 'big';
  const art = (isFound: boolean) =>
    big ? (
      <>
        <span className="hunt-art" aria-hidden="true" />
        <span className="hunt-bigwrap" aria-hidden="true">
          <motion.span className="hunt-big" style={{ scale: artScale }}>
            <Specimen id={id} found={isFound} />
          </motion.span>
        </span>
      </>
    ) : (
      <motion.span className="hunt-art" style={{ scale: artScale }} aria-hidden="true">
        <Specimen id={id} found={isFound} />
      </motion.span>
    );

  return (
    <div className="hunt-cell" style={{ ['--kid' as string]: `var(--kid-${k})`, ['--kid-ink' as string]: `var(--kid-${k}-ink)`, ['--kid-fill' as string]: `var(--kid-${k}-fill)` }}>
      <motion.button
        ref={tile}
        type="button"
        className="hunt-tile"
        data-hunt-item={id}
        data-found={found || undefined}
        aria-pressed={found}
        data-pressed={press.pressed || undefined}
        animate={{ scale: press.pressed ? pressScale.tile : 1 }}
        transition={press.transition}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => {
          press.bind.onPointerUp();
          endHold();
        }}
        onPointerCancel={() => {
          press.bind.onPointerCancel();
          clearHold();
          hold.current = null;
        }}
        onPointerLeave={(e) => {
          press.bind.onPointerLeave(e);
          if (e.pointerType === 'mouse') endHold();
        }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={(e) => {
          if (hold.current?.fired) {
            hold.current = null;
            tap.current = null;
            return;
          }
          hold.current = null;
          // A click without a pointer (keyboard) floods from the center.
          const at = e.detail === 0 ? null : tap.current;
          tap.current = null;
          onToggle(id, at, e.currentTarget);
        }}
      >
        <span className="hunt-layer hunt-base">
          {art(false)}
          <span className="hunt-label">{label}</span>
        </span>
        <motion.span className="hunt-layer hunt-flood" style={{ clipPath, WebkitClipPath: clipPath, opacity: floodOpacity }} aria-hidden="true">
          {art(true)}
          <span className="hunt-label">{label}</span>
        </motion.span>
        <motion.span className="hunt-check" style={{ scale: badgeScale, rotate: badgeRotate, opacity: badgeOpacity }} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path d="M7.2 12.4l3.1 3.1 6.5-6.9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.button>
      <button type="button" className="hunt-hint" aria-label={`Hint: ${label}`} onClick={() => onHint(id)}>
        <Lightbulb size={14} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
