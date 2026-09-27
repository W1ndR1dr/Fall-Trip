// Kid identity: each child has a color (amber, ember, moss) and a number.
// Names come from Settings (useKids); defaults are "Kid 1/2/3".
import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { haptic } from '@/lib/feedback';
import { ProgressRing } from './Indicators';
import { Pressable } from './Pressable';

export const KID_COLOR = ['var(--kid-1)', 'var(--kid-2)', 'var(--kid-3)'] as const;
export const KID_TEXT = ['var(--kid-1-text)', 'var(--kid-2-text)', 'var(--kid-3-text)'] as const;

/** Round avatar in the kid's color with an AA numeral (or initial). */
export function KidAvatar({ index, size = 34, children }: { index: number; size?: number; children?: ReactNode }) {
  const k = (index % 3) + 1;
  return (
    <span
      className="kid-avatar num"
      aria-hidden="true"
      // The disc is a picture-sized target (px); the numeral is rem, so it
      // follows Dynamic Type, capped so it always fits its disc.
      style={{ width: size, height: size, fontSize: `min(calc(${(size * 0.44).toFixed(1)}rem / 17), ${Math.round(size * 0.62)}px)`, background: `var(--kid-${k}-fill)`, color: `var(--kid-${k}-ink)`, boxShadow: `0 0 0 1.5px var(--kid-${k}) inset` }}
    >
      {children ?? k}
    </span>
  );
}

export type KidChipProps = {
  index: number;
  name: string;
  /** Second line or trailing words: "reads", "3 found". */
  detail?: ReactNode;
  /** The chip for the current step/turn lights up. */
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'lg';
  /** 0..1: a progress ring in the kid's color around the avatar (hunt switcher). */
  progress?: number;
  /** Render as one option of a single-select group (see KidPicker). */
  radio?: boolean;
  className?: string;
};

/**
 * Kid 2 reads · Kid 3 prays (devotions), or the hunt's kid switcher (size lg,
 * detail as a second line). Tappable when onClick is given (aria-pressed).
 */
export function KidChip({ index, name, detail, active, onClick, size = 'sm', progress, radio, className = '' }: KidChipProps) {
  const k = (index % 3) + 1;
  const av = size === 'lg' ? 36 : 28;
  const avatar = <KidAvatar index={index} size={progress === undefined ? av : av - 6} />;
  const inner = (
    <>
      {progress === undefined ? (
        avatar
      ) : (
        <ProgressRing value={progress} size={av + 4} stroke={2.5} color={`var(--kid-${k})`}>
          {avatar}
        </ProgressRing>
      )}
      {size === 'lg' ? (
        <span className="kid-chip-text">
          <span className="kid-chip-name">{name}</span>
          {detail && <span className="kid-chip-detail num">{detail}</span>}
        </span>
      ) : (
        <span className="kid-chip-inline">
          <b>{name}</b>
          {detail && <> {detail}</>}
        </span>
      )}
    </>
  );
  const cls = `kid-chip kid-chip-${size} ${active ? 'kid-chip-active' : ''} ${className}`;
  const style = { ['--kid' as string]: `var(--kid-${k})` };
  if (radio)
    return (
      <Pressable onClick={onClick} role="radio" aria-checked={!!active} tabIndex={active ? 0 : -1} className={cls} style={style} scale={size === 'lg' ? 0.95 : 0.94}>
        {inner}
      </Pressable>
    );
  if (onClick)
    return (
      <Pressable onClick={onClick} aria-pressed={active} className={`${cls} chip-tappable`} style={style} scale={size === 'lg' ? 0.95 : 0.94}>
        {inner}
      </Pressable>
    );
  return (
    <span className={cls} style={style}>
      {inner}
    </span>
  );
}

export type KidPickerProps = {
  /** Selected kid index. */
  value: number;
  onChange: (index: number) => void;
  /** Names from useKids(). */
  names: readonly string[];
  /** Second line per kid ("6 found"). */
  details?: readonly ReactNode[];
  /** 0..1 per kid: progress rings in each kid's color. */
  progress?: readonly number[];
  /** Accessible name for the group ("Whose hunt"). */
  label: string;
  className?: string;
};

/**
 * The kid switcher (hunt): one large chip per kid, single-select. A radio
 * group: arrow keys move the choice, like Segmented.
 */
export function KidPicker({ value, onChange, names, details, progress, label, className = '' }: KidPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (value + d + names.length) % names.length;
    onChange(n);
    requestAnimationFrame(() => ref.current?.querySelectorAll<HTMLElement>('[role=radio]')[n]?.focus());
  };
  return (
    <div ref={ref} role="radiogroup" aria-label={label} className={`kid-picker ${className}`} style={{ gridTemplateColumns: `repeat(${names.length}, minmax(0, 1fr))` }} onKeyDown={onKey}>
      {names.map((n, i) => (
        <KidChip
          key={i}
          index={i}
          name={n}
          detail={details?.[i]}
          progress={progress?.[i]}
          size="lg"
          radio
          active={i === value}
          onClick={() => {
            if (i !== value) haptic(8);
            onChange(i);
          }}
        />
      ))}
    </div>
  );
}
