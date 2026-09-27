// Surfaces and structure: Section, Card (E1), LiveCard (E2), IconWell,
// Eyebrow, Divider.
import { useId, type CSSProperties, type ReactNode } from 'react';
import type { Icon } from './icons';
import { Pressable, type PressableProps } from './Pressable';

type Tone = 'neutral' | 'accent' | 'ember' | 'night' | 'ok';

/** Small uppercase label. At most one per block. `accent` only for live context. */
export function Eyebrow({ children, tone = 'neutral', className = '', as: As = 'div' }: { children: ReactNode; tone?: Tone; className?: string; as?: 'div' | 'span' | 'p' | 'h2' | 'h3' }) {
  return <As className={`t-eyebrow eyebrow-${tone} ${className}`}>{children}</As>;
}

/** Hairline. `inset` lines up with list text after an icon. */
export function Divider({ inset = 0, className = '' }: { inset?: number; className?: string }) {
  return <hr className={`divider ${className}`} style={inset ? { marginLeft: inset } : undefined} />;
}

export type SectionProps = {
  /** Heading text. Rendered as an h2 in eyebrow style (or serif with `serif`). */
  title?: ReactNode;
  /** Trailing link/action in the header row ("Saturday plan ›"). */
  action?: ReactNode;
  /** Title in the serif (a named section like "The drive") instead of eyebrow caps. */
  serif?: boolean;
  /** Short note under the title. */
  note?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Heading level (default 2). */
  level?: 2 | 3;
  id?: string;
};

/** A titled block. Sections sit 22 px apart; cards inside use the 16 px gutter. */
export function Section({ title, action, serif, note, children, className = '', level = 2, id }: SectionProps) {
  const hid = useId();
  return (
    <section className={`section ${className}`} aria-labelledby={title ? hid : undefined} id={id}>
      {(title || action) && <SectionHeader id={hid} title={title} action={action} serif={serif} note={note} level={level} />}
      {children}
    </section>
  );
}

export function SectionHeader({ title, action, serif, note, level = 2, id }: Omit<SectionProps, 'children' | 'className'>) {
  const H = level === 3 ? 'h3' : 'h2';
  return (
    <div className="section-head">
      <div className="section-head-row">
        <H id={id} className={serif ? 't-title-2 section-title-serif' : 't-eyebrow section-title'}>
          {title}
        </H>
        {action && <div className="section-action">{action}</div>}
      </div>
      {note && <p className="t-footnote section-note">{note}</p>}
    </div>
  );
}

type CardOwn = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Inner padding: none, sm (12), md (16, default). */
  pad?: 'none' | 'sm' | 'md';
  /** Sits inside the 16 px gutter (default). false = parent handles margins. */
  inset?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
};

/** E1: the ordinary card. Pass `href` or `onClick` to make the whole card tappable. */
export function Card(props: CardOwn & Partial<PressableProps>) {
  return <SurfaceBase {...props} level="card" />;
}

/**
 * E2: the live card (Now, the current plan item, found tiles). Amber rim, a
 * warm bloom from the top-left, and an ember under-glow in dark. One per
 * screen, and only for what is happening now.
 */
export function LiveCard(props: CardOwn & Partial<PressableProps>) {
  return <SurfaceBase {...props} level="live" />;
}

function SurfaceBase({ children, className = '', style, pad = 'md', inset = true, as: As = 'div', level, ...rest }: CardOwn & Partial<PressableProps> & { level: 'card' | 'live' }) {
  const cls = `surface surface-${level} pad-${pad} ${inset ? 'surface-inset' : ''} ${className}`;
  const interactive = 'href' in rest || 'onClick' in rest;
  if (interactive) {
    return (
      <Pressable {...(rest as PressableProps)} className={`${cls} surface-tappable`} style={style} scale={0.97}>
        {children}
      </Pressable>
    );
  }
  return (
    <As className={cls} style={style}>
      {children}
    </As>
  );
}

/** A rounded-square icon well (34 px) for list rows and tiles. */
export function IconWell({ icon: I, tone = 'neutral', size = 34, children }: { icon?: Icon; tone?: Tone; size?: number; children?: ReactNode }) {
  return (
    <span className={`icon-well icon-well-${tone}`} style={{ width: size, height: size }} aria-hidden="true">
      {I ? <I size={Math.round(size * 0.53)} weight="bold" /> : children}
    </span>
  );
}
