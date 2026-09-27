// Small status pieces: Tag, Chip, LivePill, LeaveBy, OfflineChip,
// ProgressBar, ProgressRing, Pips, NumberRoller.
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Clock, LeafPip, WifiSlash, type Icon } from './icons';
import { Pressable } from './Pressable';
import { spring, useCalm } from './motion';

// ---------------------------------------------------------------------------
// Tag: tiny uppercase label on items

export type TagTone = 'now' | 'fixed' | 'choose' | 'ember' | 'night' | 'ok' | 'neutral';

/**
 * now     amber fill: the item happening now (one per screen)
 * fixed   neutral: a time that can't move (reservations, sunset)
 * choose  outlined: "Choose one" on choice items
 * ember   deadline tone
 * night / ok / neutral for the rest
 */
export function Tag({ tone = 'neutral', children, icon: I }: { tone?: TagTone; children: ReactNode; icon?: Icon }) {
  return (
    <span className={`tag tag-${tone}`}>
      {I && <I size={11} weight="bold" aria-hidden="true" />}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Chip: a pill with optional icon; interactive when onClick/href is given

export type ChipProps = {
  children: ReactNode;
  icon?: Icon;
  /** Filter chips: selected uses solid ink (neutral), never amber. */
  selected?: boolean;
  onClick?: () => void;
  href?: string;
  tone?: 'neutral' | 'accent' | 'ember' | 'night' | 'ok';
  size?: 'sm' | 'md';
  className?: string;
};

export function Chip({ children, icon: I, selected, onClick, href, tone = 'neutral', size = 'sm', className = '' }: ChipProps) {
  const inner = (
    <>
      {I && <I size={size === 'sm' ? 14 : 16} weight="bold" aria-hidden="true" />}
      <span>{children}</span>
    </>
  );
  const cls = `chip chip-${tone} chip-${size} ${selected ? 'chip-selected' : ''} ${className}`;
  if (href) return <Pressable href={href} className={`${cls} chip-tappable`} scale={0.94}>{inner}</Pressable>;
  if (onClick)
    return (
      <Pressable onClick={onClick} aria-pressed={selected} className={`${cls} chip-tappable`} scale={0.94}>
        {inner}
      </Pressable>
    );
  return <span className={cls}>{inner}</span>;
}

/** The live indicator: pulsing dot + "Now". */
export function LivePill({ children = 'Now' }: { children?: ReactNode }) {
  return (
    <span className="live-pill">
      <span className="live-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

/** Ember deadline chip: "Leave by 10:50". `time` is display text ("10:50"). */
export function LeaveBy({ time, period }: { time: string; period?: string }) {
  return (
    <span className="leave-by num">
      <Clock size={14} weight="bold" aria-hidden="true" />
      Leave by {time}
      {period && <span className="t-period">{period}</span>}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Online status

function subscribeOnline(fn: () => void) {
  addEventListener('online', fn);
  addEventListener('offline', fn);
  return () => {
    removeEventListener('online', fn);
    removeEventListener('offline', fn);
  };
}
export function useOnline(): boolean {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
}

/** "Offline · all saved": shown only while offline (or always with `force`). */
export function OfflineChip({ force = false }: { force?: boolean }) {
  const online = useOnline();
  const show = force || !online;
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.span className="offline-chip" role="status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={spring.snap}>
          <WifiSlash size={14} weight="bold" aria-hidden="true" />
          Offline · all saved
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// ProgressBar

export type ProgressBarProps = {
  /** 0..1 */
  value: number;
  /** Accessible name ("Time at Lundy", "Packed"). */
  label: string;
  /** Labels under the bar at each end ("15 min in", "1 hr 15 left"). */
  start?: ReactNode;
  end?: ReactNode;
  /** accent: the ember→amber gradient (live things). neutral: ink. */
  tone?: 'accent' | 'neutral';
  /** Spoken value, e.g. "15 minutes in, 1 hour 15 left". */
  valueText?: string;
  className?: string;
};

export function ProgressBar({ value, label, start, end, tone = 'accent', valueText, className = '' }: ProgressBarProps) {
  const calm = useCalm();
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className={`progress ${className}`}>
      <div className={`progress-track progress-${tone}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)} aria-valuetext={valueText}>
        <motion.div className="progress-fill" initial={false} animate={{ scaleX: v }} transition={calm ? { duration: 0 } : spring.fill} />
      </div>
      {(start || end) && (
        <div className="progress-labels num" aria-hidden={valueText ? true : undefined}>
          <span>{start}</span>
          <span>{end}</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressRing

export function ProgressRing({ value, size = 44, stroke = 3, color = 'var(--accent-mark)', label, children }: { value: number; size?: number; stroke?: number; color?: string; label?: string; children?: ReactNode }) {
  const calm = useCalm();
  const r = (size - stroke) / 2;
  const v = Math.max(0, Math.min(1, value));
  return (
    <span className="progress-ring" style={{ width: size, height: size }} role={label ? 'img' : undefined} aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={false}
          animate={{ pathLength: v, opacity: v > 0 ? 1 : 0 }}
          transition={calm ? { duration: 0 } : spring.fill}
        />
      </svg>
      {children && <span className="progress-ring-center">{children}</span>}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pips: ordered fill (first N filled), dot or leaf-shaped

export function Pips({ total, filled, variant = 'dot', color = 'var(--accent-mark)', label, size }: { total: number; filled: number; variant?: 'dot' | 'leaf'; color?: string; label?: string; size?: number }) {
  const calm = useCalm();
  // Existing pips appear as they are; only a pip that fills later pops.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <span className={`pips pips-${variant}`} role="img" aria-label={label ?? `${filled} of ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const on = i < filled;
        // Keyed by state: a pip that fills remounts and springs up from .45
        // (spring.pop overshoots ~14%, then settles).
        return (
          <motion.span key={`${i}-${on ? 'on' : 'off'}`} className="pip" initial={on && mounted && !calm ? { scale: 0.45 } : false} animate={{ scale: 1 }} transition={spring.pop}>
            {variant === 'leaf' ? <LeafPip on={on} color={color} size={size ?? 13} /> : <span className="pip-dot" style={{ background: on ? color : undefined, width: size, height: size }} data-on={on || undefined} />}
          </motion.span>
        );
      })}
    </span>
  );
}

// ---------------------------------------------------------------------------
// NumberRoller: each digit rolls on change with a 1.5 px motion blur

export type NumberRollerProps = {
  value: number | string;
  className?: string;
  /** Spoken text; defaults to the value. */
  label?: string;
};

export function NumberRoller({ value, className = '', label }: NumberRollerProps) {
  const chars = String(value).split('');
  const calm = useCalm();
  const [first, setFirst] = useState(true);
  useEffect(() => setFirst(false), []);
  return (
    <span className={`roller num ${className}`}>
      <span className="sr-only">{label ?? String(value)}</span>
      {chars.map((c, i) => {
        const fromRight = chars.length - 1 - i;
        return (
          <span className="roller-col" key={fromRight} aria-hidden="true">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={c}
                className="roller-digit"
                initial={first || calm ? false : { y: '55%', opacity: 0, filter: 'blur(1.5px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                exit={calm ? { opacity: 0, transition: { duration: 0 } } : { y: '-55%', opacity: 0, filter: 'blur(1.5px)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, delay: fromRight * 0.03 }}
              >
                {c}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}
