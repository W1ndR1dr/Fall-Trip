// Small pieces the faith screens share: stored preferences, the large-print
// toggle, an auto-height wrapper, the leaf burst, and person avatars.
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { get, subscribe, useStored } from '@/lib/store';
import { IconButton, KidAvatar, spring, useCalm, usePageScroll } from '@/ui';
import { TextAa } from '@/ui/icons';
import { specimenSilhouette } from '@/art';
import { ALL, type Translation } from './data';
import './faith.css';

// ---------------------------------------------------------------------------
// Stored preferences (keys from the old app)

/** 'translation': ESV or NIV (Settings and every passage card share it). */
export function useTranslation(): [Translation, (t: Translation) => void] {
  const [raw, set] = useStored<string>('translation', 'ESV');
  return [raw === 'NIV' ? 'NIV' : 'ESV', set];
}

/** 'kidReader': large print (Andika) for the kids' reading. */
export function useLargePrint(): [boolean, (on: boolean) => void] {
  const [raw, set] = useStored<boolean>('kidReader', false);
  return [raw === true, set];
}

export function LargePrintButton() {
  const [on, set] = useLargePrint();
  return <IconButton icon={TextAa} label="Large print" pressed={on} onClick={() => set(!on)} />;
}

/** A primitive derived from the store, re-read on every store change. */
export function useStoreValue<T extends string | number | boolean>(read: () => T): T {
  return useSyncExternalStore(subscribe, read, read);
}

/** The ids of every devotion marked done ('done:<id>'), live. */
export function useDoneIds(): Set<string> {
  const key = useSyncExternalStore(
    subscribe,
    () =>
      ALL.filter((d) => get<boolean>(`done:${d.id}`, false) === true)
        .map((d) => d.id)
        .join(','),
    () => '',
  );
  return useMemo(() => new Set(key ? key.split(',') : []), [key]);
}

// ---------------------------------------------------------------------------
// BarTitle: the compact title for Page's `barCenter`. It behaves like the
// shared one (fades in once the large title is under the bar) but is capped
// to the space the back pill and actions leave, so a long title truncates
// instead of running under "‹ Devotions".

export function BarTitle({ title }: { title: string }) {
  const scroller = usePageScroll();
  const { scrollY } = useScroll({ container: scroller });
  const T = useRef(40);
  const [maxW, setMaxW] = useState<number | undefined>(undefined);
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    const measure = () => {
      const h1 = sc.querySelector<HTMLElement>('h1.page-title');
      const bar = sc.querySelector<HTMLElement>('.navbar');
      if (h1 && bar) {
        const base = sc.getBoundingClientRect().top - sc.scrollTop;
        T.current = Math.max(12, h1.getBoundingClientRect().bottom - base - bar.offsetHeight);
      }
      const row = sc.querySelector<HTMLElement>('.navbar-row');
      if (row) {
        const lead = sc.querySelector<HTMLElement>('.navbar-lead')?.offsetWidth ?? 0;
        const trail = sc.querySelector<HTMLElement>('.navbar-trail')?.offsetWidth ?? 0;
        const cs = getComputedStyle(row);
        const inner = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        setMaxW(Math.max(72, Math.floor(inner - 2 * Math.max(lead, trail) - 24)));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sc);
    const h1 = sc.querySelector('h1');
    if (h1) ro.observe(h1);
    return () => ro.disconnect();
  }, [scroller]);
  const ramp = (y: number) => Math.max(0, Math.min(1, (y - T.current) / 14));
  const opacity = useTransform(scrollY, ramp);
  const y = useTransform(scrollY, (v) => 6 - 6 * ramp(v));
  return (
    <motion.span className="navbar-title" aria-hidden="true" style={{ opacity, y, maxWidth: maxW }}>
      {title}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// AutoHeight: content that changes height (ESV ↔ NIV, large print) eases to
// its new height instead of jumping everything below it.

export function AutoHeight({ children, className = '' }: { children: ReactNode; className?: string }) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number | 'auto'>('auto');
  const calm = useCalm();
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div className={`fx-autoh ${className}`} initial={false} animate={{ height: h }} transition={calm ? { duration: 0 } : spring.glide}>
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Leaf burst: a few aspen leaves in fall pigments rise from a point and
// drift down. Decorative; nothing under reduced motion (announce instead).

const LEAF_D = specimenSilhouette('aspen');
const PIGMENTS = ['var(--pig-gold)', 'var(--pig-red)', 'var(--accent-2)', 'var(--pig-gold)'];

type Part = { dx: number; up: number; fall: number; r0: number; spin: number; size: number; dur: number; delay: number; color: string };

function makeParts(n: number, spread: number): Part[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (-Math.PI / 2) + ((i / Math.max(1, n - 1)) - 0.5) * Math.PI * 0.95 + (Math.random() - 0.5) * 0.35;
    const v = (0.75 + Math.random() * 0.5) * spread;
    return {
      dx: Math.cos(a) * 120 * v,
      up: Math.sin(a) * 110 * v - 20,
      fall: 70 + Math.random() * 60,
      r0: Math.random() * 360,
      spin: (Math.random() < 0.5 ? -1 : 1) * (160 + Math.random() * 220),
      size: 15 + Math.random() * 9,
      dur: 1.05 + Math.random() * 0.45,
      delay: Math.random() * 0.06,
      color: PIGMENTS[i % PIGMENTS.length],
    };
  });
}

/** Fires once each time `fire` increases. Place inside a positioned element. */
export function LeafBurst({ fire, count = 9, spread = 1, className = '' }: { fire: number; count?: number; spread?: number; className?: string }) {
  const calm = useCalm();
  const [bursts, setBursts] = useState<{ id: number; parts: Part[] }[]>([]);
  const last = useRef(fire);
  useEffect(() => {
    if (fire === last.current) return;
    last.current = fire;
    if (calm || !fire) return;
    const id = fire;
    setBursts((b) => [...b.slice(-1), { id, parts: makeParts(count, spread) }]);
    const t = window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1800);
    return () => window.clearTimeout(t);
  }, [fire, calm, count, spread]);
  return (
    <span className={`fx-burst ${className}`} aria-hidden="true">
      <AnimatePresence>
        {bursts.flatMap((b) =>
          b.parts.map((p, i) => (
            <motion.svg
              key={`${b.id}-${i}`}
              viewBox="0 0 96 96"
              width={p.size}
              height={p.size}
              className="fx-leaf"
              initial={{ x: 0, y: 0, rotate: p.r0, opacity: 0, scale: 0.4 }}
              animate={{ x: p.dx, y: [0, p.up, p.up + p.fall], rotate: p.r0 + p.spin, opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                x: { duration: p.dur, delay: p.delay, ease: [0.2, 0.7, 0.3, 1] },
                y: { duration: p.dur, delay: p.delay, times: [0, 0.32, 1], ease: ['easeOut', 'easeIn'] },
                opacity: { duration: p.dur, delay: p.delay, times: [0, 0.08, 0.7, 1] },
                scale: { duration: p.dur, delay: p.delay, times: [0, 0.2, 0.8, 1] },
                rotate: { duration: p.dur, delay: p.delay, ease: 'linear' },
              }}
            >
              <path d={LEAF_D} fill={p.color} />
            </motion.svg>
          )),
        )}
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// People: kids get their colored avatar; parents a quiet neutral disc.

export function PersonAvatar({ index, name, size = 30 }: { index: number; name: string; size?: number }) {
  if (index < 3) return <KidAvatar index={index} size={size} />;
  const initial = (name.trim()[0] ?? '?').toUpperCase();
  return (
    <span className="fx-parent num" aria-hidden="true" style={{ width: size, height: size, fontSize: `min(calc(${(size * 0.44).toFixed(1)}rem / 17), ${Math.round(size * 0.6)}px)` }}>
      {initial}
    </span>
  );
}

/** "9:15" + "am" for a Date (Pacific). */
export function TimeText({ parts }: { parts: { time: string; period: string } }) {
  return (
    <span className="num">
      {parts.time}
      <span className="t-period">{parts.period}</span>
    </span>
  );
}
