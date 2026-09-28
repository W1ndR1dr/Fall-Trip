// Every destination on one grid, no horizontal scrolling. Each tile carries
// real data: the day titles, hunt finds, the next devotion, where the color
// is, what is packed and what is left to check.
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Specimen } from '@/art/specimens';
import { daily } from '@/content/devotions.js';
import { days } from '@/content/trip.js';
import { useChecklist, useStored } from '@/lib/store';
import { Card, fadeUp, stagger, useFirstVisit } from '@/ui';
import { BookOpenText, CalendarDots, CaretRight, Compass, ListChecks, MoonStars, Backpack, type Icon } from '@/ui/icons';
import { ACTIVITY_COUNT, BEFORE_IDS, BEFORE_TOTAL, COLOR_SCALE, HUNT_MAIN, PACK_IDS, PACK_TOTAL, SUN, TOP_SPOT, nextDevotion, readRef, spotStatus } from './data';

function Tile({ href, area, icon: I, tone = 'neutral', title, children, className = '', label }: { href: string; area: string; icon?: Icon; tone?: 'neutral' | 'night'; title: string; children?: ReactNode; className?: string; label?: string }) {
  return (
    <motion.div variants={fadeUp} style={{ gridArea: area }} className="td-tile-wrap">
      <Card href={href} inset={false} className={`td-tile ${className}`} aria-label={label}>
        <span className="td-tile-head">
          {I && <I size={17} weight="bold" className={`td-tile-icon td-tile-icon-${tone}`} aria-hidden="true" />}
          <span className="td-tile-title t-headline">{title}</span>
        </span>
        {children}
      </Card>
    </motion.div>
  );
}

/** Total finds across the three kids' hunt lists ('hunt:0/1/2'). */
function useHuntTotal() {
  const a = useChecklist('hunt:0').count;
  const b = useChecklist('hunt:1').count;
  const c = useChecklist('hunt:2').count;
  return a + b + c;
}

export function Bento({ nightDay = 'sat' }: { nightDay?: 'sat' }) {
  const first = useFirstVisit('today-bento');
  const found = useHuntTotal();
  const pack = useChecklist('pack');
  const before = useChecklist('before');
  const packed = pack.ids.filter((id) => PACK_IDS.has(id)).length;
  const checked = before.ids.filter((id) => BEFORE_IDS.has(id)).length;
  const left = BEFORE_TOTAL - checked;
  const dev = useNextDevotion();
  const level = TOP_SPOT.level; // 1..5 on the five-step scale
  const markAt = ((level - 0.5) / COLOR_SCALE.length) * 100;
  const s = SUN[nightDay];

  return (
    <motion.nav aria-label="Sections" className="td-bento" initial={first ? 'hidden' : false} animate="show" variants={stagger(8)}>
      <Tile href="/plan" area="plan" icon={CalendarDots} title="Plan" className="td-tile-plan" label="Plan, hour by hour">
        <span className="td-plan-sub t-footnote">Hour by hour</span>
        <span className="td-plan-days">
          {days.map((d) => (
            <span key={d.id} className="td-plan-day">
              <span className="td-plan-dow num">{d.label.slice(0, 3)}</span>
              <span className="td-plan-title">{d.title}</span>
            </span>
          ))}
        </span>
      </Tile>

      <Tile href="/kids/hunt" area="hunt" title="Leaf hunt" className="td-tile-hunt" label={`Leaf hunt: ${found ? `${found} found` : `${HUNT_MAIN} things to find`}`}>
        <span className="td-hunt-art" aria-hidden="true">
          <Specimen id="aspen" found />
        </span>
        <span className="td-tile-foot">
          {found ? (
            <>
              <b className="td-big num">{found}</b>
              <span className="t-footnote">found so far</span>
            </>
          ) : (
            <>
              <b className="td-big num">{HUNT_MAIN}</b>
              <span className="t-footnote">things to find</span>
            </>
          )}
        </span>
      </Tile>

      <Tile href={`/faith/${dev.id}`} area="dev" icon={BookOpenText} tone="night" title="Devotions" label={`Devotions. Next: ${dev.title}`}>
        <span className="td-tile-foot">
          <span className="td-dev-title">{dev.title}</span>
          <span className="t-footnote">{readRef(dev)}</span>
        </span>
      </Tile>

      <Tile href="/color" area="color" title="Color report" label={`Color report: ${TOP_SPOT.name} ${spotStatus(TOP_SPOT.proj)}`}>
        <span className="td-tile-foot">
          <span className="td-spectrum" aria-hidden="true">
            {COLOR_SCALE.map((c, i) => (
              <span key={c} className={`td-spec td-spec-${i}`} />
            ))}
            <span className="td-spec-mark" style={{ left: `${markAt}%` }} />
          </span>
          <span className="t-footnote td-color-line">
            <b>{TOP_SPOT.name.split(' ')[0]}</b> {spotStatus(TOP_SPOT.proj)}
          </span>
        </span>
      </Tile>

      <Tile href="/explore" area="act" icon={Compass} title="Activities">
        <span className="td-tile-foot">
          <b className="td-big num">{ACTIVITY_COUNT}</b>
          <span className="t-footnote">optional things to do</span>
        </span>
      </Tile>

      <Tile href="/pack" area="pack" icon={Backpack} title="Packing" label={`Packing: ${packed} of ${PACK_TOTAL} packed`}>
        <span className="td-tile-foot">
          <span className="t-footnote num">
            <b>{packed}</b> of {PACK_TOTAL} packed
          </span>
          <span className="td-meter" aria-hidden="true">
            <span style={{ transform: `scaleX(${packed / PACK_TOTAL})` }} />
          </span>
        </span>
      </Tile>

      <Tile href="/before" area="before" icon={ListChecks} title="Before you go" label={`Before you go: ${left ? `${left} to check` : 'all checked'}`}>
        <span className="td-tile-foot">
          <span className="t-footnote num">{left ? <><b>{left}</b> {left === 1 ? 'thing' : 'things'} to check</> : <b>All checked</b>}</span>
          <span className="t-footnote">Roads, weather, fees</span>
        </span>
      </Tile>

      <Tile href="/kids/sky" area="sky" icon={MoonStars} tone="night" title="Night sky" className="td-tile-sky" label={`Night sky: New Moon on Saturday, dark by ${s.dark} pm`}>
        <span className="td-sky-line t-footnote num">
          New Moon on Saturday · dark by {s.dark}
          <span className="t-period">pm</span>
        </span>
        <CaretRight size={15} weight="bold" className="td-sky-chev" aria-hidden="true" />
      </Tile>
    </motion.nav>
  );
}

/** The next daily devotion not marked done ('done:<id>'), live. */
export function useNextDevotion() {
  // daily has a fixed length, so the hook count is stable.
  const done = daily.map((d) => useStored<boolean>('done:' + d.id, false)[0]); // eslint-disable-line react-hooks/rules-of-hooks
  return nextDevotion((id) => done[daily.findIndex((d) => d.id === id)] === true);
}
