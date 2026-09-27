// Kid identity: each child has a color (amber, ember, moss) and a number.
// Names come from Settings (useKids); defaults are "Kid 1/2/3".
import type { ReactNode } from 'react';
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
      style={{ width: size, height: size, fontSize: Math.round(size * 0.44), background: `var(--kid-${k}-fill)`, color: `var(--kid-${k}-ink)`, boxShadow: `0 0 0 1.5px var(--kid-${k}) inset` }}
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
  className?: string;
};

/**
 * Kid 2 reads · Kid 3 prays (devotions), or the hunt's kid switcher (size lg,
 * detail as a second line). Tappable when onClick is given (aria-pressed).
 */
export function KidChip({ index, name, detail, active, onClick, size = 'sm', className = '' }: KidChipProps) {
  const k = (index % 3) + 1;
  const inner = (
    <>
      <KidAvatar index={index} size={size === 'lg' ? 36 : 28} />
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
  if (onClick)
    return (
      <Pressable onClick={onClick} aria-pressed={active} className={cls} style={style} scale={size === 'lg' ? 0.95 : 0.94}>
        {inner}
      </Pressable>
    );
  return (
    <span className={cls} style={style}>
      {inner}
    </span>
  );
}
