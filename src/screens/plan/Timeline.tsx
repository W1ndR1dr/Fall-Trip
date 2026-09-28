// The day timeline: clock times in a narrow column, a rail with nodes (solid
// = fixed time, hollow = flexible, diamond = choose one), drive legs as their
// own rows with a car on a dashed rail, the ember now-line with a live time
// bubble, past items folded into "N earlier", and the current item as the
// one live card.
import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useStored } from '@/lib/store';
import { Checkbox, Fold, LeaveBy, LiveCard, LivePill, MapsButton, ProgressBar, Tag, fadeUp, stagger, useFirstVisit } from '@/ui';
import { Car, GasPump } from '@/ui/icons';
import {
  MIN,
  choiceKey,
  choiceOptions,
  devotionsFor,
  displayTitle,
  fmtDur,
  fuelWarning,
  hm,
  mapsFor,
  routeSteps,
  sayDur,
  stayLabel,
  tp,
  type DayModel,
  type PlanDayData,
  type Row,
} from './data';
import { ChoiceGroup, Clock, DevotionLinks, DevotionRows, PlaceLinks } from './parts';

type Ctx = { day: PlanDayData; model: DayModel; now: number; lodging: string };

export function DayTimeline({ day, model, now, lodging }: Ctx) {
  const first = useFirstVisit('plan-timeline');
  const { rows, marker } = model;
  const folded = model.live >= 0 || (marker && !marker.before) ? rows.filter((r) => r.state === 'past') : [];
  const shown = rows.filter((r) => !folded.includes(r));
  const ctx = { day, model, now, lodging };

  return (
    <div className="pl-timeline">
      {folded.length > 0 && (
        <div className="pl-fold gutter">
          <Fold summary={`${folded.length} earlier`} detail={earlierDetail(folded)} lead={<Checkbox checked decorative size={22} />}>
            <ol className="pl-tl pl-tl-past" aria-label="Earlier today">
              {folded.map((r, k) => (
                <Item key={r.item.t} row={r} ctx={ctx} withLeg={k > 0} />
              ))}
            </ol>
          </Fold>
        </div>
      )}
      <motion.ol className="pl-tl" aria-label={`${day.label} timeline`} initial={first ? 'hidden' : false} animate="show" variants={stagger(shown.length + 1)}>
        {marker?.before && (
          <motion.li variants={fadeUp} className="pl-before" aria-hidden="true">
            <NowMarker now={now} style={{ top: '50%' }} line />
          </motion.li>
        )}
        {shown.map((r, k) => (
          <Item key={r.item.t} row={r} ctx={ctx} withLeg={k > 0 || r.state === 'enroute'} animated />
        ))}
      </motion.ol>
    </div>
  );
}

function earlierDetail(rows: Row[]) {
  const t = (r: Row) => hm(r.start);
  if (rows.length === 1) return t(rows[0]);
  if (rows.length === 2) {
    const a = tp(rows[0].start), b = tp(rows[1].start);
    return a.period === b.period ? `${a.time} and ${b.time} ${b.period}` : `${t(rows[0])} and ${t(rows[1])}`;
  }
  const a = tp(rows[0].start), b = tp(rows[rows.length - 1].start);
  return a.period === b.period ? `${a.time} to ${b.time} ${b.period}` : `${t(rows[0])} to ${t(rows[rows.length - 1])}`;
}

/** One item, preceded by the drive that arrives at it. */
function Item({ row, ctx, withLeg, animated }: { row: Row; ctx: Ctx; withLeg: boolean; animated?: boolean }) {
  const { model, now } = ctx;
  const Li = animated ? motion.li : 'li';
  const v = animated ? { variants: fadeUp } : {};
  const legLive = row.state === 'enroute' && model.marker?.leg;
  const live = row.state === 'now' || row.state === 'enroute';
  const nodeKind = row.state === 'past' ? 'past' : live ? 'now' : row.item.kind === 'choice' ? 'choice' : row.item.anchor ? 'anchor' : 'flex';
  const p = model.marker && model.marker.row === row.i && !model.marker.leg && !model.marker.before ? model.marker.p : null;

  return (
    <>
      {row.leg && withLeg && (
        <Li {...v} className="pl-row pl-leg" data-live={legLive || undefined} data-past={row.state === 'past' || undefined}>
          <span className="pl-time" aria-hidden="true" />
          <span className="pl-rail" aria-hidden="true">
            <span className="pl-car">
              <Car size={14} />
            </span>
          </span>
          <span className="pl-leg-label">
            {legLive ? (
              <>
                <b>On the road.</b> {row.leg.label}
              </>
            ) : (
              row.leg.label
            )}
          </span>
          {legLive && <NowMarker now={now} style={{ top: '50%' }} car />}
        </Li>
      )}
      <Li {...v} className="pl-row pl-item" data-state={row.state} data-live={live || undefined} style={p !== null ? ({ '--p': `${(p * 100).toFixed(2)}%` } as CSSProperties) : undefined}>
        <span className="pl-time">
          <Clock at={row.start} className="pl-hm" />
        </span>
        <span className="pl-rail" aria-hidden="true">
          <span className="pl-node" data-kind={nodeKind} />
          {p !== null && <span className="pl-elapsed" />}
        </span>
        <div className="pl-body">{live ? <LiveItem row={row} ctx={ctx} /> : <PlainItem row={row} ctx={ctx} />}</div>
        {p !== null && <NowMarker now={now} style={{ top: 'var(--now-top)' }} />}
      </Li>
    </>
  );
}

/** The ember now-line: a live time bubble, a dot (or the car) on the rail, a short stub. */
function NowMarker({ now, style, car, line }: { now: number; style?: CSSProperties; car?: boolean; line?: boolean }) {
  const { time } = tp(now);
  return (
    <span className="pl-now" style={style} data-car={car || undefined} data-line={line || undefined} aria-hidden="true">
      <span className="pl-now-bubble num">{time}</span>
      {!car && <span className="pl-now-dot" />}
      {!car && <span className="pl-now-stub" />}
    </span>
  );
}

function Meta({ row }: { row: Row }) {
  const stay = stayLabel(row.item.stay);
  const fuel = fuelWarning(row.item);
  if (!stay && !fuel) return null;
  return (
    <div className="pl-meta">
      {fuel && (
        <Tag tone="ember" icon={GasPump}>
          {fuel}
        </Tag>
      )}
      {stay && <span>{stay}</span>}
    </div>
  );
}

function PlainItem({ row, ctx }: { row: Row; ctx: Ctx }) {
  const { item } = row;
  const maps = mapsFor(item, ctx.day.id, ctx.lodging);
  const choice = item.kind === 'choice';
  const intro = choice ? choiceOptions(item, ctx.lodging).intro : item.text;
  const past = row.state === 'past';
  return (
    <>
      <div className="pl-title-row">
        <h3 className="pl-title">{displayTitle(item)}</h3>
        {choice && !past && <Tag tone="choose">Choose one</Tag>}
      </div>
      {intro && <p className="pl-text">{intro}</p>}
      <Meta row={row} />
      {choice && !past && <ChoiceGroup item={item} lodging={ctx.lodging} />}
      <RouteSteps row={row} ctx={ctx} />
      <Actions row={row} maps={maps} />
    </>
  );
}

function Actions({ row, maps, live }: { row: Row; maps: ReturnType<typeof mapsFor>; live?: boolean }) {
  const { item } = row;
  const hasDv = devotionsFor(item).length > 0;
  if (live) {
    return (
      <>
        {maps && (
          <div className="pl-actions">
            <MapsButton size="md" variant="primary" q={maps.query.q} daddr={maps.query.daddr} ll={maps.query.ll} place={maps.place} />
          </div>
        )}
        <DevotionRows item={item} />
        <PlaceLinks ids={item.menu} />
      </>
    );
  }
  return (
    <>
      {(maps || hasDv) && (
        <div className="pl-actions">
          {maps && <MapsButton size="sm" q={maps.query.q} daddr={maps.query.daddr} ll={maps.query.ll} place={maps.place} />}
          <DevotionLinks item={item} />
        </div>
      )}
      <PlaceLinks ids={item.menu} />
    </>
  );
}

/** The live card: what's happening now, or where you're driving to. */
function LiveItem({ row, ctx }: { row: Row; ctx: Ctx }) {
  const { item } = row;
  const { now, model } = ctx;
  const maps = mapsFor(item, ctx.day.id, ctx.lodging);
  const enroute = row.state === 'enroute';
  const next = model.rows[row.i + 1];
  // Leave-by for the next stop (its start minus its drive), when there is one.
  const leave = !enroute && next?.leaveFor ? next.leaveFor : null;
  const choice = item.kind === 'choice';
  const intro = choice ? choiceOptions(item, ctx.lodging).intro : item.text;

  let bar: { value: number; start: string; end: string; say: string } | null = null;
  if (enroute && row.leaveFor) {
    const total = (row.start - row.leaveFor) / MIN;
    const gone = (now - row.leaveFor) / MIN;
    bar = { value: gone / total, start: `${fmtDur(gone)} on the road`, end: `${fmtDur(total - gone)} to go`, say: `${sayDur(gone)} on the road, ${sayDur(total - gone)} to go` };
  } else if (!enroute) {
    const until = leave ?? row.end;
    const total = (until - row.start) / MIN;
    const gone = (now - row.start) / MIN;
    if (total >= 20) bar = { value: gone / total, start: `${fmtDur(gone)} in`, end: `${fmtDur(until - now > 0 ? (until - now) / MIN : 0)} left`, say: `${sayDur(gone)} in, ${sayDur((until - now) / MIN)} left` };
  }

  return (
    <LiveCard inset={false} className="pl-live">
      <div className="pl-live-head">
        <LivePill>{enroute ? 'On the way' : 'Now'}</LivePill>
        {enroute && <span className="t-footnote num">Arrive about {tp(row.start).time}</span>}
        {leave && (
          <span className="pl-live-leave">
            <LeaveBy time={tp(leave).time} />
          </span>
        )}
      </div>
      <div className="pl-title-row mt-2.5">
        <h3 className="t-title-1">{displayTitle(item)}</h3>
      </div>
      {intro && <p className="pl-text pl-text-live">{intro}</p>}
      {(item.anchor || item.stay || fuelWarning(item) || choice) && (
        <div className="pl-meta">
          {choice && <Tag tone="choose">Choose one</Tag>}
          {item.anchor && <Tag tone="fixed">Fixed</Tag>}
          {fuelWarning(item) && (
            <Tag tone="ember" icon={GasPump}>
              {fuelWarning(item)}
            </Tag>
          )}
          {item.stay && <span>{stayLabel(item.stay)}</span>}
        </div>
      )}
      {bar && <ProgressBar className="mt-4" value={bar.value} label={enroute ? `Drive to ${displayTitle(item)}` : `Time at ${displayTitle(item)}`} start={bar.start} end={<b>{bar.end}</b>} valueText={bar.say} />}
      {choice && <ChoiceGroup item={item} lodging={ctx.lodging} inCard />}
      <RouteSteps row={row} ctx={ctx} />
      <div className="mt-1">
        <Actions row={row} maps={maps} live />
      </div>
    </LiveCard>
  );
}

/**
 * Sunday: after the route is chosen, "Leave Mammoth" lists that route's
 * stops, with the current one marked while driving.
 */
function RouteSteps({ row, ctx }: { row: Row; ctx: Ctx }) {
  const items = ctx.day.items;
  const prev = items[row.i - 1];
  const chooser = prev?.choices?.length ? prev : null;
  const [chosen] = useStored<string | null>(chooser ? choiceKey(chooser) : '__none', null);
  if (!chooser || row.item.kind !== 'drive') return null;
  const id = chosen && chooser.choices!.includes(chosen) ? chosen : null;
  if (!id) return <p className="pl-note">Choose a route above to see its stops here.</p>;
  const steps = routeSteps(id).filter((s) => !s.home && !/^Leave Mammoth/i.test(s.title));
  const live = row.state === 'now';
  const timed = steps.filter((s) => s.at !== null);
  const cur = live ? timed.filter((s) => s.at! <= ctx.now).pop() : undefined;
  return (
    <ol className="pl-steps" aria-label="Stops on the way home">
      {steps.map((s, k) => {
        const on = s === cur;
        const done = live && s.at !== null && s.at <= ctx.now && !on;
        return (
          <li key={k} className="pl-step" data-alt={s.alt || undefined} data-on={on || undefined} data-done={done || undefined}>
            <span className="pl-step-time num">{s.time ? s.time.replace('~', '') : ''}</span>
            <span className="pl-step-dot" aria-hidden="true" />
            <span className="pl-step-text">
              <span className="pl-step-title">
                {s.optional && <Tag>Optional</Tag>} {s.title}
                {on && <span className="sr-only"> (now)</span>}
              </span>
              {s.sub && (
                <span className="pl-step-sub">
                  {s.fuel && <GasPump size={13} weight="bold" className="pl-step-warn" aria-hidden="true" />}
                  {s.sub}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
