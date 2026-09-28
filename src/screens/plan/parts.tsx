// Small pieces shared by the Plan screens: place links, devotion links, the
// choice radio group, and a time label.
import { motion } from 'motion/react';
import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useStored } from '@/lib/store';
import { haptic } from '@/lib/feedback';
import { Button, MapsButton, Pressable, Tag, announce, spring, useCalm } from '@/ui';
import { BookOpenText, CaretRight } from '@/ui/icons';
import { choiceKey, choiceOptions, devotionLabel, devotionsFor, menuById, tp, type PlanItem } from './data';

/** "9:30" + a small "am". */
export function Clock({ at, className = '' }: { at: number | Date | string; className?: string }) {
  const { time, period } = tp(at);
  return (
    <span className={`num ${className}`}>
      {time}
      <span className="t-period">{period}</span>
    </span>
  );
}

/** The optional activities behind an item: chips that open /do/:id. */
export function PlaceLinks({ ids, className = '' }: { ids?: string[]; className?: string }) {
  const entries = (ids ?? []).map(menuById).filter((m): m is NonNullable<typeof m> => !!m);
  if (!entries.length) return null;
  return (
    <div className={`pl-places ${className}`}>
      {entries.map((m) => (
        <Pressable key={m.id} href={`/do/${m.id}`} className="pl-place" scale={1}>
          <span>{m.name}</span>
          <CaretRight size={11} weight="bold" aria-hidden="true" />
        </Pressable>
      ))}
    </div>
  );
}

/** Devotion buttons for an item ("Saturday devotion", "Ask the animals"). */
export function DevotionLinks({ item }: { item: PlanItem }) {
  return (
    <>
      {devotionsFor(item).map((dv) => (
        <Button key={dv.id} size="sm" href={`/faith/${dv.id}`} icon={BookOpenText} className="pl-dv">
          {devotionLabel(dv)}
        </Button>
      ))}
    </>
  );
}

/** In the live card: each devotion as a full-width row ("Saturday devotion", its title). */
export function DevotionRows({ item }: { item: PlanItem }) {
  const list = devotionsFor(item);
  if (!list.length) return null;
  return (
    <ul className="pl-dv-rows">
      {list.map((dv) => (
        <li key={dv.id}>
          <Pressable href={`/faith/${dv.id}`} className="pl-dv-row" scale={0.98}>
            <span className="pl-dv-well" aria-hidden="true">
              <BookOpenText size={17} weight="fill" />
            </span>
            <span className="pl-dv-text">
              <span className="pl-dv-title">{devotionLabel(dv)}</span>
              <span className="pl-dv-sub">{dv.kind === 'daily' ? dv.title : 'Moment'}</span>
            </span>
            <CaretRight size={14} weight="bold" className="pl-dv-caret" aria-hidden="true" />
          </Pressable>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Choose one": a radio group persisted at `choice:<item.t>`. Options come
 * from the item (routes on Sunday, "Energy left? … Running on fumes? …"
 * otherwise). The chosen option shows its Maps button.
 */
export function ChoiceGroup({ item, lodging, inCard }: { item: PlanItem; lodging: string; inCard?: boolean }) {
  const { options } = choiceOptions(item, lodging);
  const [chosen, setChosen] = useStored<string | null>(choiceKey(item), null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const calm = useCalm();
  const index = options.findIndex((o) => o.id === chosen);

  const pick = (i: number) => {
    const o = options[i];
    if (!o) return;
    if (o.id !== chosen) haptic(10);
    setChosen(o.id);
    announce(`Chosen: ${o.title}`);
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + options.length) % options.length;
    pick(n);
    refs.current[n]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={`Choose one: ${options.map((o) => o.title).join(' or ')}`} className={`pl-choice ${inCard ? 'pl-choice-in' : ''}`}>
      {options.map((o, i) => {
        const on = o.id === chosen;
        return (
          <div key={o.id} className="pl-opt" data-on={on || undefined}>
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on || (index < 0 && i === 0) ? 0 : -1}
              className="pl-opt-main"
              onClick={() => pick(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="pl-radio" data-on={on || undefined} aria-hidden="true">
                <motion.span className="pl-radio-dot" initial={false} animate={{ scale: on ? 1 : 0.3, opacity: on ? 1 : 0 }} transition={calm ? { duration: 0 } : spring.pop} />
              </span>
              <span className="pl-opt-text">
                {o.ask && <span className="pl-opt-ask">{o.ask}</span>}
                <span className="pl-opt-title">
                  {o.title}
                  {o.recommended && (
                    <>
                      {' '}
                      <Tag>Recommended</Tag>
                    </>
                  )}
                </span>
                <span className="pl-opt-detail">{o.detail}</span>
              </span>
            </button>
            {(o.href || (on && o.maps)) && (
              <div className="pl-opt-foot">
                {on && o.maps && <MapsButton size="sm" q={o.maps.query.q} daddr={o.maps.query.daddr} ll={o.maps.query.ll} place={o.maps.place} />}
                {o.href && (
                  <Pressable href={o.href} className="pl-opt-link" scale={0.97}>
                    Route details
                    <CaretRight size={13} weight="bold" aria-hidden="true" />
                  </Pressable>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** A labelled value in a stat grid (sun times, route facts). */
export function Stat({ label, children, tone }: { label: ReactNode; children: ReactNode; tone?: 'accent' | 'ember' }) {
  return (
    <div className="pl-stat">
      <span className="pl-stat-label">{label}</span>
      <span className={`pl-stat-value num ${tone === 'accent' ? 'text-accent-text' : tone === 'ember' ? 'text-ember' : ''}`}>{children}</span>
    </div>
  );
}
