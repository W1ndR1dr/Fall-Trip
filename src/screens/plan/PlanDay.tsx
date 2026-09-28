import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { useChecklist, useStored } from '@/lib/store';
import { tripDay, useNow, type TripDayId } from '@/lib/time';
import { Card, Eyebrow, ListGroup, NavRow, Page, Section, Segmented, navigate, spring, usePageScroll } from '@/ui';
import { Backpack, ListChecks, MoonStars } from '@/ui/icons';
import { BEFORE, CONDITIONS, DAY_IDS, PACK_TOTAL, SUN, WEATHER, asOf, dayById, dayModel, type PlanDayData } from './data';
import { DayThumb } from './DayThumb';
import { Stat } from './parts';
import { DayTimeline } from './Timeline';
import './plan.css';

const SHORT: Record<TripDayId, string> = { fri: 'Fri 9', sat: 'Sat 10', sun: 'Sun 11' };

export default function PlanDay({ params }: ScreenProps) {
  const nowDate = useNow(30_000);
  const now = nowDate.getTime();
  const today = tripDay(nowDate);
  const id: TripDayId = DAY_IDS.includes(params.day as TripDayId) ? (params.day as TripDayId) : (today ?? 'fri');
  const day = dayById(id)!;
  const [lodging] = useStored<string>('lodging', '');
  const model = useMemo(() => dayModel(day, now), [day, now]);
  const scroller = usePageScroll();

  // Direction of the day switch, for the content's small slide.
  const [shown, setShown] = useState(id);
  const [dir, setDir] = useState(0);
  if (shown !== id) {
    setDir(DAY_IDS.indexOf(id) > DAY_IDS.indexOf(shown) ? 1 : -1);
    setShown(id);
  }

  const setDay = (d: TripDayId) => {
    if (d === id) return;
    navigate(`/plan/${d}`, { replace: true });
    scroller.current?.scrollTo({ top: 0 });
  };

  const isToday = model.when === 'today';

  return (
    <Page
      title="Plan"
      compact
      leading={<span className="pl-bar-title">Plan</span>}
      barCenter={
        <Segmented<TripDayId>
          label="Day"
          value={id}
          onChange={setDay}
          className="pl-days"
          options={DAY_IDS.map((d) => ({
            value: d,
            aria: `${dayById(d)!.label}, ${dayById(d)!.date}${d === today ? ', today' : ''}`,
            label: (
              <span className="pl-day-seg">
                {SHORT[d]}
                {d === today && <span className="pl-today-dot" aria-hidden="true" />}
              </span>
            ),
          }))}
        />
      }
      sky={isToday ? 'day' : 'plain'}
      width="wide"
    >
      <div className="pl-stage">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={id}
            className="pl-layout"
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 28 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -28, transition: { duration: 0.16, ease: 'easeOut' } }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring.glide}
          >
            <div className="pl-main">
              <DayHeader day={day} isToday={isToday} />
              <DayTimeline day={day} model={model} now={now} lodging={lodging} />
            </div>
            <aside className="pl-aside" aria-label={`${day.label} details`}>
              <SunCard day={day} />
              <WeatherCard day={day} />
              <GetReady />
            </aside>
          </motion.div>
        </AnimatePresence>
      </div>
    </Page>
  );
}

function DayHeader({ day, isToday }: { day: PlanDayData; isToday: boolean }) {
  return (
    <header className="pl-head">
      <div className="pl-head-text">
        <Eyebrow tone={isToday ? 'accent' : 'neutral'}>
          {day.label}, {day.date}
          {isToday ? ' · Today' : ''}
        </Eyebrow>
        <h2 className="t-large-title pl-day-title">{day.title}</h2>
      </div>
      <DayThumb day={day.id} />
      <p className="t-body pl-blurb">{day.blurb}</p>
      <div className="pl-legend" aria-hidden="true">
        <span>
          <i className="pl-node-mini" data-kind="anchor" />
          Fixed time
        </span>
        <span>
          <i className="pl-node-mini" data-kind="flex" />
          Flexible
        </span>
        {day.items.some((i) => i.kind === 'choice') && (
          <span>
            <i className="pl-node-mini" data-kind="choice" />
            Choose one
          </span>
        )}
      </div>
    </header>
  );
}

function SunCard({ day }: { day: PlanDayData }) {
  const s = SUN[day.id];
  return (
    <Section title="Sun and moon">
      <Card>
        <div className="pl-stats">
          <Stat label="Sunrise">
            {s.sunrise}
            <span className="t-period">am</span>
          </Stat>
          <Stat label="Sunset">
            {s.sunset}
            <span className="t-period">pm</span>
          </Stat>
          <Stat label="Golden hour" tone="accent">
            {s.goldenPM}
            <span className="t-period">pm</span>
          </Stat>
          <Stat label="Dark">
            {s.dark}
            <span className="t-period">pm</span>
          </Stat>
        </div>
        <p className="t-footnote pl-sun-am num">
          Morning golden hour {s.goldenAM} am.
        </p>
        <div className="pl-moon">
          <MoonStars size={18} className="pl-moon-icon" aria-hidden="true" />
          <p className="t-callout">{s.moon}</p>
        </div>
        <p className="t-footnote mt-2.5">In canyons the Sierra crest blocks the sun 30–60 minutes before sunset.</p>
      </Card>
    </Section>
  );
}

function WeatherCard({ day }: { day: PlanDayData }) {
  // Real forecasts once the update routine reaches the trip dates; normals until then.
  const rows = CONDITIONS.forecasts
    .filter((f) => f.onTrip)
    .map((f) => ({ place: f.place, ps: f.periods.filter((p) => p.name.startsWith(day.label)) }))
    .filter((r) => r.ps.length);
  return (
    <Section title="Weather" note={rows.length ? `NWS forecast as of ${asOf(CONDITIONS.retrieved)}` : undefined}>
      <Card pad="none">
        {rows.length > 0 && (
          <ul className="pl-wx">
            {rows.map((r) => (
              <li key={r.place} className="pl-wx-row pl-wx-fc">
                <span className="pl-wx-place">{r.place}</span>
                <span className="pl-wx-fc-list">
                  {r.ps.map((p) => (
                    <span key={p.name}>
                      <b className="num">{p.temp.replace('F', '')}</b> {p.name.replace(day.label, '').trim() || 'Day'} · {p.text}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        )}
        <ul className="pl-wx" aria-label="Normal highs and lows">
          {WEATHER.places.map((p) => (
            <li key={p.name} className="pl-wx-row">
              <span className="pl-wx-place">
                {p.name}
                <span className="pl-wx-elev num">{p.elev}</span>
              </span>
              <span className="pl-wx-temp num" aria-label={`High ${p.hi}, low ${p.lo}`}>
                <b>{p.hi}°</b>
                <span>{p.lo}°</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="t-footnote pl-wx-note">{WEATHER.note}</p>
      </Card>
    </Section>
  );
}

function GetReady() {
  const pack = useChecklist('pack');
  const before = useChecklist('before');
  const packed = pack.ids.filter((i) => /^pack-\d+$/.test(i) && Number(i.slice(5)) < PACK_TOTAL).length;
  const done = before.ids.filter((i) => /^before-\d+$/.test(i) && Number(i.slice(7)) < BEFORE.checklist.length).length;
  return (
    <Section title="Get ready">
      <ListGroup>
        <NavRow href="/pack" icon={Backpack} title="Packing" detail={`${packed} of ${PACK_TOTAL}`} />
        <NavRow href="/before" icon={ListChecks} title="Before you go" subtitle="Roads, weather, a last checklist" detail={`${done} of ${BEFORE.checklist.length}`} />
      </ListGroup>
    </Section>
  );
}
