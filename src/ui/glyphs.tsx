// Custom glyphs that share Phosphor's 24-unit grid and 1.5 px stroke.
import { useId, type SVGProps } from 'react';

type GlyphProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & { size?: number | string; weight?: 'regular' | 'fill' };

/**
 * Road-sign diamond with a turn arrow: the "open in Maps" glyph. Always used
 * with a text label (see MapsButton); never as an unlabeled circle.
 */
export function MapsDiamond({ size = 20, weight = 'fill', ...rest }: GlyphProps) {
  const id = useId();
  const arrow = 'M9.4 15.2v-2.7a1.9 1.9 0 0 1 1.9-1.9h3.9M13.4 8.6l2 2-2 2';
  const diamond = 'M10.6 3.4a2 2 0 0 1 2.8 0l7.2 7.2a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1 0-2.8Z';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      {weight === 'fill' ? (
        <>
          <mask id={id}>
            <rect width="24" height="24" fill="#fff" />
            <path d={arrow} stroke="#000" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </mask>
          <path d={diamond} fill="currentColor" mask={`url(#${id})`} />
        </>
      ) : (
        <>
          <path d={diamond} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={arrow} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

/** Side-view car for drive legs on the timeline rail. */
export function Car({ size = 14, weight = 'fill', ...rest }: GlyphProps) {
  const body =
    'M3.2 15.6v-2.4c0-.9.6-1.6 1.4-1.8l1.9-.5 2.2-3.1c.4-.5 1-.8 1.6-.8h4.5c.6 0 1.1.3 1.5.7l2.6 3.1 1.6.4c.9.2 1.5 1 1.5 1.9v2.5c0 .5-.4.9-.9.9H4.1a.9.9 0 0 1-.9-.9Z';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      {weight === 'fill' ? (
        <>
          <path d={body} fill="currentColor" />
          <path d="M9.6 8.2h2.4v2.9H7.8l1.8-2.6Zm3.9 0h1.4c.3 0 .5.1.7.3l2.1 2.6h-4.2V8.2Z" fill="var(--bg-2, #fff)" opacity=".55" />
          <circle cx="7.6" cy="16.6" r="2.1" fill="currentColor" stroke="var(--bg-2, #fff)" strokeWidth="1.2" />
          <circle cx="16.6" cy="16.6" r="2.1" fill="currentColor" stroke="var(--bg-2, #fff)" strokeWidth="1.2" />
        </>
      ) : (
        <>
          <path d={body} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="7.6" cy="16.6" r="1.8" fill="var(--bg-2, #fff)" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16.6" cy="16.6" r="1.8" fill="var(--bg-2, #fff)" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

/**
 * The aspen-leaf mark (wordmark, app icon). Drawn with the same construction
 * as the hunt art: carotenoid gold, pale veins, a flat petiole.
 */
export function LeafMark({ size = 20, className = '', ...rest }: Omit<GlyphProps, 'weight'>) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`art ${className}`} {...rest}>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2=".5" y2="0">
          <stop offset="0" stopColor="#E9892A" />
          <stop offset="1" stopColor="#FAC654" />
        </linearGradient>
      </defs>
      <path d="M12 2.6c4.9 3.3 7.2 7 6.6 10.6-.5 3.1-3.2 5.1-6.6 5.1s-6.1-2-6.6-5.1C4.8 9.6 7.1 5.9 12 2.6Z" fill={`url(#${id})`} />
      <path
        d="M12 6v12.3M12 9.6l-2.7 2.1M12 9.6l2.7 2.1M12 12.8l-3.4 2.3M12 12.8l3.4 2.3"
        stroke="#FFF1C9"
        strokeWidth=".9"
        strokeLinecap="round"
        opacity=".85"
        fill="none"
      />
      <path d="M12 18.3c0 1.3-.3 2.3-1 3.1" stroke="#B8651A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** A leaf-shaped pip (hunt progress). `on` fills it with the mark color. */
export function LeafPip({ on = false, color = 'var(--accent-mark)', size = 14, ...rest }: Omit<GlyphProps, 'weight' | 'size'> & { on?: boolean; color?: string; size?: number }) {
  const stroke = on ? color : 'var(--text-3)';
  return (
    <svg width={size} height={(size * 17) / 13} viewBox="0 0 13 17" aria-hidden="true" {...rest}>
      <path
        d="M6.5 1C10 3.6 11.7 6.5 11.2 9.3c-.4 2.4-2.3 3.9-4.7 3.9S2.2 11.7 1.8 9.3C1.3 6.5 3 3.6 6.5 1Z"
        fill={on ? color : 'none'}
        stroke={stroke}
        strokeWidth="1.1"
        opacity={on ? 1 : 0.7}
      />
      <path d="M6.5 13.2v2.6" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" opacity={on ? 1 : 0.7} />
    </svg>
  );
}
