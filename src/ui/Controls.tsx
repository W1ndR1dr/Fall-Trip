// Form controls: Segmented, Switch, Checkbox, CheckRow, TextField.
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { haptic } from '@/lib/feedback';
import { spring, useCalm } from './motion';

// ---------------------------------------------------------------------------
// Segmented

export type SegmentOption<T extends string> = { value: T; label: ReactNode; /** Accessible name if label is not text. */ aria?: string };

export type SegmentedProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Required: what is being chosen ("Day", "Translation"). */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
};

/**
 * iOS segmented control. The thumb glides on the indicator spring; each label
 * turns to full ink as the thumb crosses its midpoint. 44 pt hit areas.
 * Arrow keys move the selection (radiogroup semantics).
 */
export function Segmented<T extends string>({ options, value, onChange, label, size = 'md', className = '' }: SegmentedProps<T>) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const pos = useMotionValue(index);
  const calm = useCalm();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const c = calm ? pos.set(index) : animate(pos, index, spring.indicator);
    return () => c?.stop?.();
  }, [index, calm, pos]);

  const x = useTransform(pos, (p) => `${p * 100}%`);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (index + d + options.length) % options.length;
    onChange(options[n].value);
    refs.current[n]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={`seg seg-${size} ${className}`} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }} onKeyDown={onKey}>
      <motion.span className="seg-thumb" aria-hidden="true" style={{ width: `calc((100% - 6px) / ${options.length})`, x }} />
      {options.map((o, i) => (
        <SegButton key={o.value} i={i} pos={pos} selected={i === index} onSelect={() => onChange(o.value)} label={o.aria} buttonRef={(el) => (refs.current[i] = el)}>
          {o.label}
        </SegButton>
      ))}
    </div>
  );
}

function SegButton({ i, pos, selected, onSelect, children, label, buttonRef }: { i: number; pos: MotionValue<number>; selected: boolean; onSelect: () => void; children: ReactNode; label?: string; buttonRef: (el: HTMLButtonElement | null) => void }) {
  const color = useTransform(pos, (p) => (Math.abs(p - i) < 0.5 ? 'var(--text)' : 'var(--text-2)'));
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      tabIndex={selected ? 0 : -1}
      className="seg-btn"
      style={{ color }}
      onClick={() => {
        if (!selected) haptic(8);
        onSelect();
      }}
    >
      {children}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Switch

export type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name when there is no visible label (e.g. inside a ListRow, pass the row title). */
  label: string;
  disabled?: boolean;
};

/** On/off. The "on" track is ink, not a color: a setting is not an event. */
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className="switch"
      data-on={checked || undefined}
      onClick={() => {
        haptic(8);
        onChange(!checked);
      }}
    >
      <motion.span className="switch-knob" layout transition={spring.snap} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Checkbox + CheckRow

export type CheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: number;
  /** Kid color for per-kid lists; defaults to amber. */
  color?: string;
  /** Render as a presentational mark (when the whole row is the button). */
  decorative?: boolean;
};

const CHECK = 'M7.2 12.4l3.1 3.1 6.5-6.9';

/** Round check. Fill pops (alive spring), the tick draws, the row text dims. */
export function Checkbox({ checked, onChange, label, size = 24, color, decorative }: CheckboxProps) {
  const calm = useCalm();
  const mark = (
    <span className="check" data-on={checked || undefined} style={{ width: size, height: size, ...(color ? { ['--check-fill' as string]: color } : null) }} aria-hidden={decorative || undefined}>
      <motion.span className="check-fill" initial={false} animate={{ scale: checked ? 1 : 0.6, opacity: checked ? 1 : 0 }} transition={calm ? { duration: 0 } : spring.pop} />
      <svg viewBox="0 0 24 24" className="check-tick">
        <motion.path
          d={CHECK}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={calm ? { duration: 0 } : { pathLength: { duration: 0.22, delay: checked ? 0.04 : 0, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.05, delay: checked ? 0.04 : 0 } }}
        />
      </svg>
    </span>
  );
  if (decorative || !onChange) return mark;
  return (
    <button type="button" role="checkbox" aria-checked={checked} aria-label={label} className="check-btn" onClick={() => onChange(!checked)}>
      {mark}
    </button>
  );
}

export type CheckRowProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Trailing detail (quantity, "Kid 2"). */
  detail?: ReactNode;
  color?: string;
  className?: string;
};

/** A checklist row: the whole row toggles. Pair with useSettledOrder to sink done items. */
export function CheckRow({ checked, onChange, title, subtitle, detail, color, className = '' }: CheckRowProps) {
  return (
    <motion.li layout="position" transition={spring.glide} className="row-li">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        className={`row row-tappable check-row ${className}`}
        data-done={checked || undefined}
        onClick={() => {
          haptic(10);
          onChange(!checked);
        }}
      >
        <span className="row-lead">
          <Checkbox checked={checked} decorative color={color} />
        </span>
        <span className="row-text">
          <span className="row-title">{title}</span>
          {subtitle && <span className="row-sub">{subtitle}</span>}
        </span>
        {detail != null && <span className="row-detail num">{detail}</span>}
      </button>
    </motion.li>
  );
}

/**
 * Order for a checklist where done items sink to the bottom, but only after
 * the list has been still for `delay` ms (600 by default), so a row never
 * jumps out from under the finger that just checked it.
 */
export function useSettledOrder<T>(items: T[], isDone: (item: T) => boolean, delay = 600): T[] {
  const sort = () => [...items.filter((i) => !isDone(i)), ...items.filter(isDone)];
  const [order, setOrder] = useState<T[]>(sort);
  const key = items.map((i) => (isDone(i) ? '1' : '0')).join('') + items.length;
  useEffect(() => {
    // New or removed items show immediately; completion reflows after a pause.
    setOrder((prev) => (prev.length !== items.length || prev.some((p) => !items.includes(p)) ? sort() : prev.map((p) => items[items.indexOf(p)])));
    const t = window.setTimeout(() => setOrder(sort()), delay);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return order;
}

// ---------------------------------------------------------------------------
// TextField

export type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: ReactNode;
  type?: 'text' | 'search' | 'tel' | 'url';
  autoComplete?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  /** Visually hide the label (it is still read). */
  hideLabel?: boolean;
  className?: string;
};

export function TextField({ label, value, onChange, placeholder, hint, type = 'text', autoComplete = 'off', multiline, rows = 3, maxLength, hideLabel, className = '' }: TextFieldProps) {
  const id = useId();
  const hintId = hint ? id + '-hint' : undefined;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'field-label t-footnote'}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} className="field-input field-area" value={value} rows={rows} maxLength={maxLength} placeholder={placeholder} aria-describedby={hintId} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} className="field-input" type={type} value={value} maxLength={maxLength} placeholder={placeholder} autoComplete={autoComplete} autoCapitalize="words" spellCheck={false} aria-describedby={hintId} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && (
        <p id={hintId} className="field-hint t-caption">
          {hint}
        </p>
      )}
    </div>
  );
}
