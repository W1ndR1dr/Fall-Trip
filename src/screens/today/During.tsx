// Home during the trip: what is happening now, when to leave, what's next,
// the sun, and today's devotion. Before Friday noon the countdown holds the
// Now card's place; at departure it re-lays out into the card (layoutId).
import { AnimatePresence, motion } from 'motion/react';
import { lazy, Suspense, type ReactNode } from 'react';
import { daily } from '@/content/devotions.js';
import { DEPART } from '@/content/trip.js';
import { useKids } from '@/lib/family';
import { useChecklist, useStored } from '@/lib/store';
import { isAfterDark, timeParts, tripDay, type TripDayId } from '@/lib/time';
import {
  Eyebrow,
  IconButton,
  KidAvatar,
  LeaveBy,
  ListGroup,
  LiveCard,
  LivePill,
  MapsButton,
  NavRow,
  NightVisionOffer,
  OfflineChip,
  Page,
  Pressable,
  ProgressBar,
  Section,
  Card,
  Tag,
  fadeUp,
  spring,
  stagger,
  useCalm,
  useFirstVisit,
} from '@/ui';
import { BookOpenText, CaretRight, Check, Footprints, GearSix, Leaf, MoonStars, RoadHorizon, ThermometerSimple, Toilet, Tree, Coffee, Car } from '@/ui/icons';
import { Hero } from './Hero';
import { SunArc, clockHours } from './SunArc';
import {
  cleanWalk,
  cleanWc,
  dayById,
  driveLabel,
  factsFor,
  findDevotion,
  fmtShort,
  mapsFor,
  moonFor,
  nowState,
  placeOf,
  readRef,
  splitTitle,
  tiogaStatus,
  turns,
  weatherFor,
  TOP_SPOT,
  spotStatus,
  HUNT_MAIN,
  type NowState,
  type TimelineItem,
} from './data';

const NowMap = lazy(() => import('./NowMap'));

const DAY_NUM: Record<TripDayId, number> = { fri: 1, sat: 2, sun: 3 };
const WEEKDAY: Record<TripDayId, string> = { fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
const DATE: Record<TripDayId, string> = { fri: 'Oct 9', sat: 'Oct 10', sun: 'Oct 11' };

function T({ d, small }: { d: Date; small?: boolean }) {
  const { time, period } = timeParts(d);
  return (
    <span className={`num ${small ? '' : 'td-time'}`}>
      {time}
      <span className="t-period">{period}</span>
    </span>
  );
}

export function During({ now }: { now: Date }) {
  const dayId = tripDay(now) ?? 'fri';
  const day = dayById(dayId);
  const st = nowState(now);
  const departed = now.getTime() >= new Date(DEPART).getTime();
  const afterDark = isAfterDark(now);
  const hour = clockHours(now);
  const sky = afterDark ? 'plain' : hour >= 17 ? 'dawn' : 'day';
  const showNow = departed && !!st.current;
  const first = useFirstVisit('today-during');

  // What follows the Now card: the rest of today (skipping the inline NEXT),
  // or the first of tomorrow.
  const rest = st.upcoming.slice(showNow && st.nextToday ? 1 : 0);
  const later = rest.slice(0, 2);
  const laterDay = later[0]?.day.id as TripDayId | undefined;
  const laterTitle = !later.length ? null : laterDay !== dayId ? `${WEEKDAY[laterDay!]} morning` : showNow ? 'Later today' : 'Next';

  return (
    <Page
      title={day.title}
      docTitle="Fall Trip"
      eyebrow={`${WEEKDAY[dayId]}, ${DATE[dayId]} · Day ${DAY_NUM[dayId]} of 3`}
      subtitle={<Conditions day={dayId} afterDark={afterDark} />}
      actions={<IconButton href="/settings" icon={GearSix} label="Settings" />}
      sky={sky}
    >
      <div className="td-now-slot">
        <AnimatePresence initial={false} mode="popLayout">
          {showNow ? <NowCard key="now" st={st} now={now} dayId={dayId} /> : <Hero key="hero" now={now} eyebrow="Leaving today" />}
        </AnimatePresence>
      </div>

      <NightVisionOffer className="td-nv" />

      {later.length > 0 && (
        <Section
          title={laterTitle}
          action={
            <a href={`#/plan/${laterDay}`}>
              {WEEKDAY[laterDay!]} plan <CaretRight size={14} weight="bold" aria-hidden="true" />
            </a>
          }
        >
          <motion.ul className="td-later surface surface-inset pad-none" initial={first ? 'hidden' : false} animate="show" variants={stagger(later.length)}>
            {later.map((it) => (
              <LaterRow key={it.index} it={it} />
            ))}
          </motion.ul>
        </Section>
      )}

      <div className="section">
        <SunArc day={dayId} now={now} />
      </div>

      <TodayDevotion dayId={dayId} />

      <Section title="Also">
        <AlsoLinks />
      </Section>
    </Page>
  );
}

// ---------------------------------------------------------------------------

function Conditions({ day, afterDark }: { day: TripDayId; afterDark: boolean }) {
  const w = weatherFor(day);
  const tioga = tiogaStatus();
  const moon = moonFor(day);
  return (
    <span className="td-cond">
      <OfflineChip />
      <span className="td-cond-item">
        <ThermometerSimple size={16} weight="bold" aria-hidden="true" />
        <span className="num">
          <b>{w.hi}°</b> / {w.lo}°
        </span>
        <span className="td-cond-soft">{w.source === 'normal' ? 'normal' : 'forecast'}</span>
      </span>
      {tioga.open !== null && (
        <span className="td-cond-item">
          <RoadHorizon size={16} weight="bold" aria-hidden="true" />
          Tioga Rd <b className={tioga.open ? 'td-ok' : 'td-closed'}>{tioga.open ? 'open' : 'closed'}</b>
          {tioga.open && tioga.delay && <span className="td-cond-soft">· {tioga.delay}</span>}
        </span>
      )}
      {moon.newMoon && (
        <span className="td-cond-item">
          <MoonStars size={16} weight="bold" aria-hidden="true" />
          <b>{afterDark ? moon.label : `${moon.label} tonight`}</b>
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------

function NowCard({ st, now, dayId }: { st: NowState; now: Date; dayId: TripDayId }) {
  const calm = useCalm();
  const kids = useKids();
  const [lodging] = useStored<string>('lodging', '');
  const it = st.current!;
  const { title, kicker } = splitTitle(it.title);
  const facts = factsFor(it);
  const here = placeOf(it);
  const nx = st.nextToday;
  const there = nx ? placeOf(nx) : null;
  const lodgingItem = it.kind === 'lodging' || /home base/i.test(it.title);
  const maps = lodgingItem ? (lodging.trim() ? { q: lodging.trim() } : null) : mapsFor(it);
  const dv = findDevotion(it.devotion ?? undefined);
  const [nudge] = useStored<number>('turn:' + (dv?.id ?? '_'), 0);
  const tn = dv ? turns(dv.id, nudge) : null;
  const deadline = kicker && /last gas/i.test(kicker);

  let progress: ReactNode = null;
  if (st.span) {
    const total = (st.span.end.getTime() - st.span.start.getTime()) / 60e3;
    const inMin = (now.getTime() - st.span.start.getTime()) / 60e3;
    const left = total - inMin;
    const late = left <= 0;
    progress = (
      <ProgressBar
        className="td-now-progress"
        value={total > 0 ? inMin / total : 1}
        label={`Time at ${title}`}
        start={`${fmtShort(inMin)} in`}
        end={late ? <b>Time to go</b> : <b>{fmtShort(left)} left</b>}
        valueText={late ? 'Time to go' : `${fmtShort(inMin)} in, ${fmtShort(left)} left`}
      />
    );
  }
  const leave = st.leaveBy ? timeParts(st.leaveBy) : null;
  const leaveLate = st.leaveBy ? now >= st.leaveBy : false;
  const since = timeParts(it.at);
  const text = !facts ? firstSentences(it.text, 2) : null;

  return (
    <motion.div layoutId="today-now" className="td-now-wrap" transition={calm ? { duration: 0 } : spring.glide}>
      <LiveCard pad="none" className="td-now" as="article">
        {here && (
          <Suspense fallback={<div className="td-nowmap td-nowmap-empty" style={{ height: 128 }} />}>
            <NowMap here={here} next={there} nextSub={nx ? `${timeParts(nx.at).time} ${timeParts(nx.at).period}` : undefined} />
          </Suspense>
        )}
        <motion.div className="td-now-body" initial={calm ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12, duration: 0.3 }}>
          <div className="td-now-row">
            <LivePill />
            <span className="t-footnote num td-since">
              Since {since.time}
              <span className="t-period">{since.period}</span>
            </span>
            {leave && (
              <span className="td-leave">
                {leaveLate ? <span className="leave-by num">Leave now</span> : <LeaveBy time={leave.time} period={leave.period} />}
              </span>
            )}
          </div>
          <h2 className="t-title-1 td-now-title">{title}</h2>
          {kicker && (deadline ? <div className="td-now-tag"><Tag tone="ember">{kicker}</Tag></div> : <p className="t-callout td-now-kicker">{kicker}</p>)}
          {facts && (
            <ul className="td-facts">
              {facts.walk && (
                <li>
                  <Footprints size={16} weight="bold" aria-hidden="true" />
                  <span>{cleanWalk(facts.walk)}</span>
                </li>
              )}
              {facts.wc && cleanWc(facts.wc) && (
                <li>
                  <Toilet size={16} weight="bold" aria-hidden="true" />
                  <span>{cleanWc(facts.wc)}</span>
                </li>
              )}
            </ul>
          )}
          {text && <p className="t-callout td-now-text">{text}</p>}
          {progress}
          {(maps || lodgingItem) && (
            <div className="td-now-actions">
              {maps ? (
                <MapsButton variant="primary" q={maps.q} daddr={maps.daddr} place={lodgingItem ? 'your lodging' : title} label={lodgingItem ? 'Maps to lodging' : 'Maps'} />
              ) : (
                <a className="td-now-hint t-footnote" href="#/settings">
                  Add the lodging address in Settings for a Maps button
                </a>
              )}
            </div>
          )}
          {dv && tn && (
            <Pressable href={`/faith/${dv.id}`} className="td-devrow" scale={0.98}>
              <span className="td-devrow-icon" aria-hidden="true">
                <BookOpenText size={18} weight="bold" />
              </span>
              <span className="td-devrow-text">
                <span className="td-devrow-title">{dv.title}</span>
                <span className="t-footnote td-devrow-sub">
                  Devotion here · <b style={{ color: `var(--kid-${tn.reader + 1}-text)` }}>{kids[tn.reader]}</b> reads
                </span>
              </span>
              <CaretRight size={16} weight="bold" className="td-chev" aria-hidden="true" />
            </Pressable>
          )}
          {nx && (
            <Pressable href={`/plan/${dayId}`} className="td-nextrow" scale={0.98} aria-label={`Next at ${timeParts(nx.at).time} ${timeParts(nx.at).period}: ${splitTitle(nx.title).title}. Open the ${WEEKDAY[dayId]} plan`}>
              <span className="t-eyebrow td-nextrow-k">Next</span>
              <span className="td-nextrow-t">
                <T d={nx.at} />
              </span>
              <span className="td-nextrow-text">
                <span className="td-nextrow-title">{splitTitle(nx.title).title}</span>
                {driveLabel(nx.drive) && (
                  <span className="t-footnote td-nextrow-sub">
                    <Car size={14} aria-hidden="true" />
                    {driveLabel(nx.drive)}
                  </span>
                )}
              </span>
              <CaretRight size={16} weight="bold" className="td-chev" aria-hidden="true" />
            </Pressable>
          )}
        </motion.div>
      </LiveCard>
    </motion.div>
  );
}

function firstSentences(s: string, n: number) {
  const parts = s.match(/[^.!?]+[.!?]+["”’)]?(\s|$)/g);
  return parts ? parts.slice(0, n).join('').trim() : s;
}

// ---------------------------------------------------------------------------

function LaterRow({ it }: { it: TimelineItem }) {
  const { title, kicker } = splitTitle(it.title);
  const drive = driveLabel(it.drive);
  const maps = it.kind === 'lodging' ? null : mapsFor(it);
  const meta = [kicker && !/last gas/i.test(kicker) ? kicker : null, it.stay ? `Stay ${it.stay}` : null].filter(Boolean).join(' · ');
  return (
    <motion.li className="td-later-row" variants={fadeUp}>
      <span className="td-later-time">
        <T d={it.at} />
      </span>
      <span className="td-later-text">
        <span className="t-headline td-later-title">
          {title}
          {kicker && /last gas/i.test(kicker) && (
            <>
              {' '}
              <Tag tone="ember">Last gas</Tag>
            </>
          )}
        </span>
        {(drive || meta) && (
          <span className="t-footnote td-later-sub">
            {drive && (
              <span className="td-later-drive">
                <Car size={14} aria-hidden="true" />
                {drive}
              </span>
            )}
            {drive && meta && ' · '}
            {meta}
          </span>
        )}
      </span>
      {maps && <MapsButton size="sm" q={maps.q} daddr={maps.daddr} place={title} className="td-later-maps" />}
    </motion.li>
  );
}

// ---------------------------------------------------------------------------

function TodayDevotion({ dayId }: { dayId: TripDayId }) {
  const kids = useKids();
  const dv = daily.find((d) => d.day === dayId)!;
  const [done] = useStored<boolean>('done:' + dv.id, false);
  const [nudge] = useStored<number>('turn:' + dv.id, 0);
  const tn = turns(dv.id, nudge);
  return (
    <Section title="Today’s devotion">
      <Card href={`/faith/${dv.id}`} className="td-devcard">
        <span className="td-devcard-top">
          <Eyebrow tone="night" as="span">
            {readRef(dv)}
          </Eyebrow>
          {done && (
            <span className="td-done t-footnote">
              <Check size={13} weight="bold" aria-hidden="true" /> Done
            </span>
          )}
        </span>
        <span className="t-title-2 td-devcard-title">{dv.title}</span>
        <span className="t-footnote td-devcard-when">{dv.when}</span>
        <span className="td-turns">
          <span className="td-turn">
            <KidAvatar index={tn.reader} size={24} />
            <span>
              <b>{kids[tn.reader]}</b> reads
            </span>
          </span>
          <span className="td-turn">
            <KidAvatar index={tn.prayer} size={24} />
            <span>
              <b>{kids[tn.prayer]}</b> prays
            </span>
          </span>
          <CaretRight size={16} weight="bold" className="td-chev td-devcard-chev" aria-hidden="true" />
        </span>
      </Card>
    </Section>
  );
}

function AlsoLinks() {
  const a = useChecklist('hunt:0').count;
  const b = useChecklist('hunt:1').count;
  const c = useChecklist('hunt:2').count;
  const found = a + b + c;
  return (
    <ListGroup>
      <NavRow href="/kids/hunt" icon={Leaf} title="Leaf hunt" detail={found ? `${found} found` : `${HUNT_MAIN} to find`} />
      <NavRow href="/color" icon={Tree} title="Color report" subtitle={`${TOP_SPOT.name} ${spotStatus(TOP_SPOT.proj)}`} />
      <NavRow href="/food" icon={Coffee} title="Food and cocoa" subtitle="Cafés, cocoa and caramel apples" />
      <NavRow href="/kids/sky" icon={MoonStars} title="Night sky" subtitle="New Moon on Saturday" />
    </ListGroup>
  );
}
