import { MapLabel, StopDot, Terrain, cropAround } from '@/art';
import { motion } from 'motion/react';
import { useChecklist } from '@/lib/store';
import { haptic } from '@/lib/feedback';
import { IconButton, spring, useCalm } from '@/ui';
import { Star } from '@/ui/icons';
import { colorReport } from '@/content/trip.js';
import { ENERGY, placeOf, spanFor } from './data';

/** A small lit-terrain crop centered on where the activity is. Decorative. */
export function PlaceThumb({ id, size = 72, km = 11, aspect = 1, className = '', label }: { id: string; size?: number | string; km?: number; aspect?: number; className?: string; label?: string }) {
  const p = placeOf(id);
  if (!p) return null;
  const crop = cropAround(p.region, p.at, spanFor(p.region, km), aspect);
  return (
    <div className={`ac-thumb ${className}`} style={{ width: size, aspectRatio: String(aspect) }} aria-hidden="true">
      <Terrain region={p.region} crop={crop} style={{ width: '100%', height: '100%' }}>
        <StopDot at={p.at} kind="here" />
        {label && <MapLabel at={p.at} title={label} side="right" size="md" />}
      </Terrain>
    </div>
  );
}

/** Three dots: how much walking. */
export function Effort({ n }: { n: number }) {
  return (
    <span className="ac-effort" role="img" aria-label={`Effort: ${ENERGY[n] ?? n} (${n} of 3)`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? 'on' : ''} />
      ))}
    </span>
  );
}

/** Star an activity to shortlist it ('maybes', same key as before). */
export function StarButton({ id, name, size = 'md' }: { id: string; name: string; size?: 'sm' | 'md' }) {
  const maybes = useChecklist('maybes');
  const on = maybes.has(id);
  const calm = useCalm();
  return (
    <motion.span
      className="ac-star-wrap"
      key={on ? 'on' : 'off'}
      initial={calm || !on ? false : { scale: 0.6, rotate: -25 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={spring.bounce}
    >
    <IconButton
      icon={Star}
      weight={on ? 'fill' : 'regular'}
      variant="plain"
      size={size}
      pressed={on}
      className={`ac-star ${on ? 'is-on' : ''}`}
      label={on ? `Starred: ${name}` : `Star ${name}`}
      onClick={() => {
        maybes.toggle(id);
        haptic();
      }}
    />
    </motion.span>
  );
}

/** Just starting → Past peak, with a marker at `level` (1–5). */
export function Spectrum({ level, label }: { level: number; label?: string }) {
  const at = ((Math.min(5, Math.max(1, level)) - 0.5) / 5) * 100;
  return (
    <span className="ac-spectrum" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {colorReport.scale.map((s, i) => (
        <span key={s} className={`ac-spec ac-spec-${i}`} />
      ))}
      <span className="ac-spec-mark" style={{ left: `${at}%` }} />
    </span>
  );
}
