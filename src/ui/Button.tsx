// Buttons. Amber fill (`primary`) is only for the live or primary action on a
// screen (Maps on the Now card, "Found it"). Everything else is neutral ink.
import type { ReactNode } from 'react';
import { mapsUrl } from '@/lib/links';
import { ArrowUpRight, MapsDiamond, type Icon } from './icons';
import { Pressable, type PressableProps } from './Pressable';

export type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonOwn = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Phosphor icon component (or any node) before the label. */
  icon?: Icon | ReactNode;
  /** Icon after the label instead (e.g. an arrow). */
  iconEnd?: Icon | ReactNode;
  /** Stretch to the container width. */
  block?: boolean;
  /** Icon weight (default: bold on primary and small, regular otherwise). */
  iconWeight?: 'regular' | 'bold' | 'fill';
  children?: ReactNode;
};

export type ButtonProps = ButtonOwn & PressableProps;

const ICON = { sm: 16, md: 18, lg: 20 } as const;

function renderIcon(icon: ButtonOwn['icon'], size: number, weight: 'regular' | 'bold' | 'fill' = 'regular') {
  if (!icon) return null;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in (icon as object))) {
    const I = icon as Icon;
    return <I size={size} weight={weight} aria-hidden="true" className="btn-icon" />;
  }
  return <span className="btn-icon">{icon as ReactNode}</span>;
}

export function Button({ variant = 'secondary', size = 'md', icon, iconEnd, block, iconWeight, children, className = '', ...rest }: ButtonProps) {
  const weight = iconWeight ?? (variant === 'primary' || size === 'sm' ? 'bold' : 'regular');
  return (
    <Pressable
      {...(rest as PressableProps)}
      scale={size === 'sm' ? 0.94 : 0.96}
      className={`btn btn-${variant} btn-${size} ${block ? 'btn-block' : ''} ${className}`}
    >
      {renderIcon(icon, ICON[size], weight)}
      {children != null && <span className="btn-label">{children}</span>}
      {renderIcon(iconEnd, ICON[size] - 2, 'bold')}
    </Pressable>
  );
}

export type IconButtonProps = Omit<PressableProps, 'children'> & {
  icon: Icon | ReactNode;
  /** Required: what the button does ("Settings", "Rotate turns"). */
  label: string;
  /** glass: floats over content (nav bars, maps). plain: fill on cards. ghost: no fill. */
  variant?: 'glass' | 'plain' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  weight?: 'regular' | 'bold' | 'fill';
  /** For toggles: rendered as aria-pressed. */
  pressed?: boolean;
};

/** A round icon-only button. 44 pt hit area at every size. */
export function IconButton({ icon, label, variant = 'glass', size = 'md', weight, pressed, className = '', ...rest }: IconButtonProps) {
  const px = size === 'sm' ? 16 : size === 'lg' ? 22 : 20;
  return (
    <Pressable
      {...(rest as PressableProps)}
      scale={0.92}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={`icon-btn icon-btn-${variant} icon-btn-${size} ${className}`}
    >
      {renderIcon(icon, px, weight ?? (variant === 'primary' ? 'fill' : 'regular'))}
    </Pressable>
  );
}

export type MapsButtonProps = {
  /** Place name or address for Apple Maps search. */
  q?: string;
  /** "lat,lon" to drop a pin. */
  ll?: string;
  /** Directions to this address/place. */
  daddr?: string;
  /** Spoken as "Open <place> in Maps". Defaults to q/daddr. */
  place?: string;
  label?: string;
  variant?: 'primary' | 'secondary';
  size?: ButtonSize;
  className?: string;
};

/**
 * Labeled Maps button with the road-sign glyph. Opens Apple Maps (the app on
 * iPhone/iPad). `primary` only on the live card; it turns tonal at night.
 */
export function MapsButton({ q, ll, daddr, place, label = 'Maps', variant = 'secondary', size = 'md', className = '' }: MapsButtonProps) {
  const where = place ?? q ?? daddr;
  return (
    <Button
      href={mapsUrl({ q, ll, daddr })}
      external
      variant={variant}
      size={size}
      icon={<MapsDiamond size={ICON[size] + 1} weight="fill" />}
      className={`maps-btn ${className}`}
      aria-label={where ? `Open ${where} in Maps` : 'Open in Maps'}
    >
      {label}
    </Button>
  );
}

/** Inline outbound link (NPS, Caltrans, YouVersion). Opens only on tap. */
export function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={`ext-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={13} weight="bold" aria-hidden="true" className="ext-link-icon" />
      <span className="sr-only"> (opens outside the app)</span>
    </a>
  );
}
