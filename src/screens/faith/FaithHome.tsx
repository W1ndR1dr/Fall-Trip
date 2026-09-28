// Devotions home: today's devotion (during the trip), one for each day, the
// short moments pinned to stops, bonus moments, the memory verse, and the
// way into the journal and the Sunday look-back.
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { ScreenProps } from '@/app/routes';
import { useKids } from '@/lib/family';
import { get, useStored } from '@/lib/store';
import { timeParts, tripDay, tripPhase, useNow } from '@/lib/time';
import { Card, KidChip, ListGroup, ListRow, LivePill, LiveCard, Page, Pips, Section, Eyebrow, fadeUp, stagger, useFirstVisit } from '@/ui';
import { ArrowRight, Bird, Check, BookBookmark, Drop, Flower, Leaf as LeafIcon, Mountains, MoonStars, NotePencil, Sparkle, Sun, Tree } from '@/ui/icons';
import { Leaf } from '@/art';
import { useDoneIds, useStoreValue, useTranslation } from './bits';
import { BONUS, DAILY, DAY_LABEL, MEMORY_VERSE, MOMENTS, PROMPTS, TRIP_DAYS, hasTurns, memoryWords, promptIndex, slotFor, turnsFor, whenWithoutDay, type Devotion } from './data';
import type { Icon } from '@/ui/icons';

const GLYPH: Record<string, Icon> = {
  'm-granite': Mountains,
  'm-springs': Drop,
  'm-beasts': Bird,
  'm-trees': Tree,
  'm-stars': MoonStars,
  'b-sunset': Sun,
  'b-manifold': LeafIcon,
  'b-word': Sparkle,
  'b-lilies': Flower,
};

const shortTime = (d: Date) => {
  const p = timeParts(d);
  return `${p.time} ${p.period}`;
};

export default function FaithHome(_props: ScreenProps) {
  const now = useNow();
  const phase = tripPhase(now);
  const day = tripDay(now);
  const today = phase === 'during' && day ? DAILY.find((d) => d.day === day) : undefined;
  const done = useDoneIds();
  const first = useFirstVisit('faith-home');

  // Moments pinned to today's stops (during the trip), in plan order.
  const todays = today
    ? MOMENTS.map((m) => ({ m, slot: slotFor(m) }))
        .filter((x) => x.slot?.day.id === day)
        .sort((a, b) => a.slot!.start.getTime() - b.slot!.start.getTime())
    : [];
  const todaysIds = new Set(todays.map((x) => x.m.id));
  // In plan order (content order puts South Tufa before Lundy).
  const at = (m: Devotion) => slotFor(m)?.start.getTime() ?? Infinity;
  const otherMoments = MOMENTS.filter((m) => !todaysIds.has(m.id)).sort((a, b) => at(a) - at(b));
  // "Now" goes to one thing only: today's devotion if its stop is now, else a moment.
  const todaySlot = today ? slotFor(today) : undefined;
  const todayLive = !!todaySlot && now >= todaySlot.start && now < todaySlot.end;
  const liveMoment = todayLive ? undefined : todays.find((x) => now >= x.slot!.start && now < x.slot!.end)?.m.id;

  const dailyDone = DAILY.filter((d) => done.has(d.id)).length;
  const momentsDone = MOMENTS.filter((d) => done.has(d.id)).length;

  return (
    <Page title="Devotions" subtitle="About five minutes each, led by the kids: Look, Read, Wonder, Pray, Do." sky="candle">
      <motion.div initial={first ? 'hidden' : false} animate="show" variants={stagger(6, 0.05)}>
        {today && (
          <motion.div variants={fadeUp}>
            <Section title="Today">
              <TodayCard d={today} live={todayLive} done={done.has(today.id)} slotTitle={todaySlot?.item.title} />
            </Section>
            {todays.length > 0 && (
              <Section title="Also today">
                <ListGroup label="Moments today">
                  {todays.map(({ m, slot }) => (
                    <MomentRow key={m.id} d={m} done={done.has(m.id)} live={liveMoment === m.id} sub={<>{shortTime(slot!.start)} · {m.place}</>} />
                  ))}
                </ListGroup>
              </Section>
            )}
          </motion.div>
        )}

        <motion.div variants={fadeUp}>
          <Section title="Each day" action={<span className="t-footnote num fh-count">{dailyDone} of 3 done</span>}>
            <ListGroup label="Daily devotions">
              {DAILY.map((d) => (
                <ListRow
                  key={d.id}
                  href={`/faith/${d.id}`}
                  icon={<DateWell day={d.day!} today={d.id === today?.id} />}
                  title={<span className="fh-serif">{d.title}</span>}
                  subtitle={
                    <>
                      {d.read.join(' · ')} · {whenWithoutDay(d.when)}
                    </>
                  }
                  detail={done.has(d.id) ? <DoneMark /> : undefined}
                  className="fh-day"
                />
              ))}
            </ListGroup>
          </Section>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title={today ? 'Other stops' : 'Along the way'} note={today ? undefined : 'A minute or two each, at the stops in the plan.'} action={<span className="t-footnote num fh-count">{momentsDone} of {MOMENTS.length} done</span>}>
            <ListGroup label="Moments at stops">
              {otherMoments.map((m) => {
                const s = slotFor(m);
                return (
                  <MomentRow
                    key={m.id}
                    d={m}
                    done={done.has(m.id)}
                    sub={
                      s ? (
                        <>
                          {DAY_LABEL[s.day.id].short} {shortTime(s.start)} · {m.place}
                        </>
                      ) : (
                        m.place
                      )
                    }
                  />
                );
              })}
            </ListGroup>
          </Section>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title="Any time">
            <ListGroup label="Bonus moments">
              {BONUS.map((b) => (
                <MomentRow key={b.id} d={b} done={done.has(b.id)} sub={b.when} />
              ))}
            </ListGroup>
          </Section>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title="Memory verse">
            <VerseCard />
          </Section>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title="Together">
            <div className="fh-pair gutter">
              <JournalTile day={day} />
              <Card href="/faith/lookback" inset={false} className="fh-tile">
                <span className="fh-tile-icon" aria-hidden="true">
                  <BookBookmark size={20} weight="bold" />
                </span>
                <span className="fh-tile-title">Look back</span>
                <span className="fh-tile-sub">The whole weekend, on Sunday</span>
              </Card>
            </div>
          </Section>
        </motion.div>

        <motion.p variants={fadeUp} className="t-footnote gutter-text fh-foot">
          Download the ESV and NIV in the YouVersion Bible app before you go: reading then works offline, though its audio needs a signal. Each passage here links to the same verses in the app.
        </motion.p>
      </motion.div>
    </Page>
  );
}

// ---------------------------------------------------------------------------

function DoneMark() {
  return (
    <span className="fh-done">
      <Check size={16} weight="bold" aria-hidden="true" />
      <span className="sr-only">Done</span>
    </span>
  );
}

function DateWell({ day, today }: { day: 'fri' | 'sat' | 'sun'; today?: boolean }) {
  const l = DAY_LABEL[day];
  return (
    <span className="fh-date" data-today={today || undefined} aria-hidden="true">
      <span className="fh-date-dow">{l.short}</span>
      <span className="fh-date-n num">{l.n}</span>
    </span>
  );
}

function MomentRow({ d, done, live, sub }: { d: Devotion; done: boolean; live?: boolean; sub?: ReactNode }) {
  const I = GLYPH[d.id] ?? Sparkle;
  return (
    <ListRow
      href={`/faith/${d.id}`}
      icon={I}
      iconTone="night"
      title={
        live ? (
          <span className="fh-live-title">
            {d.title} <LivePill />
          </span>
        ) : (
          d.title
        )
      }
      subtitle={sub}
      detail={done ? <DoneMark /> : undefined}
    />
  );
}

function TodayCard({ d, live, done, slotTitle }: { d: Devotion; live: boolean; done: boolean; slotTitle?: string }) {
  const kids = useKids();
  const [nudge] = useStored<number>(`turn:${d.id}`, 0);
  const t = hasTurns(d) ? turnsFor(d.id, nudge) : null;
  const Surface = live ? LiveCard : Card;
  return (
    <Surface href={`/faith/${d.id}`} className="fh-today">
      <span className="fh-today-art" aria-hidden="true">
        <Leaf pigment="gold" />
      </span>
      <div className="fh-today-top">
        {live ? <LivePill>{slotTitle ? `Now · ${slotTitle}` : 'Now'}</LivePill> : <Eyebrow>{DAY_LABEL[d.day!].long}</Eyebrow>}
      </div>
      <h3 className="t-title-1 fh-today-title">{d.title}</h3>
      <p className="t-callout fh-today-when">
        {whenWithoutDay(d.when)} · {d.read.join(' · ')}
      </p>
      <div className="fh-today-foot">
        {t && (
          <span className="fh-today-turns">
            <KidChip index={t.reader} name={kids[t.reader]} detail="reads" />
            <KidChip index={t.prayer} name={kids[t.prayer]} detail="prays" />
          </span>
        )}
        <span className="fh-go" data-done={done || undefined}>
          {done ? (
            <>
              <Check size={15} weight="bold" aria-hidden="true" /> Done
            </>
          ) : (
            <>
              Start <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </>
          )}
        </span>
      </div>
    </Surface>
  );
}

function VerseCard() {
  const [tr] = useTranslation();
  const words = memoryWords(tr);
  const [hiddenRaw] = useStored<number[]>(`mv:${tr}`, []);
  const hidden = new Set(Array.isArray(hiddenRaw) ? hiddenRaw : []);
  const n = words.filter((_, i) => hidden.has(i)).length;
  return (
    <Card href="/faith/verse" className="fh-verse">
      <div className="fh-verse-head">
        <span className="fh-verse-ref">
          {MEMORY_VERSE} <span className="fh-verse-tr">· {tr}</span>
        </span>
        <span className="t-footnote num">{n === 0 ? `${words.length} words` : n === words.length ? 'All hidden' : `${n} of ${words.length} hidden`}</span>
      </div>
      <p className="fh-verse-text" aria-label={n ? `${words.length - n} of ${words.length} words showing` : words.join(' ')}>
        {words.map((w, i) => (
          <span key={i} className="fh-vw" data-hidden={hidden.has(i) || undefined} aria-hidden="true">
            {w}
          </span>
        ))}
      </p>
      <div className="fh-verse-foot">
        <Pips total={words.length} filled={n} color="var(--night)" label={`${n} of ${words.length} words hidden`} size={6} />
        <span className="fh-go">
          {n === words.length ? 'Say it again' : n ? 'Keep going' : 'Start'} <ArrowRight size={15} weight="bold" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}

function JournalTile({ day }: { day: 'fri' | 'sat' | 'sun' | null }) {
  // Lines written so far across the weekend (5 people × 3 days).
  const lines = useStoreValue(() => TRIP_DAYS.reduce((a, d) => a + [0, 1, 2, 3, 4].filter((i) => String(get<string>(`journal:${d}:${i}`, '') || '').trim()).length, 0));
  const prompt = PROMPTS[promptIndex(day ?? 'fri')];
  return (
    <Card href="/faith/journal" inset={false} className="fh-tile">
      <span className="fh-tile-icon" aria-hidden="true">
        <NotePencil size={20} weight="bold" />
      </span>
      <span className="fh-tile-title">Gratitude journal</span>
      <span className="fh-tile-sub">{day ? `Tonight: ${prompt}` : lines ? `${lines} ${lines === 1 ? 'line' : 'lines'} so far` : 'One line from everyone, each evening'}</span>
    </Card>
  );
}

