// Gratitude journal: one line from each person, each evening. Entries save
// as you type (debounced) to 'journal:<day>:<i>'; the day tab is 'journalDay'.
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { useFamily } from '@/lib/family';
import { useStored } from '@/lib/store';
import { tripDay, useNow, type TripDayId } from '@/lib/time';
import { Button, Eyebrow, ListGroup, NavRow, Page, Segmented, fade, spring, useCalm } from '@/ui';
import { ArrowsClockwise, BookBookmark, Check } from '@/ui/icons';
import { BarTitle, PersonAvatar } from './bits';
import { DAY_LABEL, PROMPTS, TRIP_DAYS, promptIndex } from './data';

const DAY_OPTIONS = TRIP_DAYS.map((d) => ({ value: d, label: `${DAY_LABEL[d].short} ${DAY_LABEL[d].n}`, aria: `${DAY_LABEL[d].long}, ${DAY_LABEL[d].date}` }));
const isDay = (v: unknown): v is TripDayId => v === 'fri' || v === 'sat' || v === 'sun';

// During the trip the journal opens on today's page (once per session);
// otherwise it keeps the last day you chose.
let openedOnToday = false;

export default function Journal(_props: ScreenProps) {
  const family = useFamily();
  const today = tripDay(useNow(60_000));
  const [stored, setStored] = useStored<string>('journalDay', today ?? 'fri');
  const day: TripDayId = isDay(stored) ? stored : 'fri';
  const [shift, setShift] = useState(0);
  const calm = useCalm();

  useEffect(() => {
    if (today && !openedOnToday) {
      openedOnToday = true;
      if (stored !== today) setStored(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const setDay = (d: TripDayId) => {
    setStored(d);
    setShift(0);
  };
  const prompt = PROMPTS[(promptIndex(day) + shift) % PROMPTS.length];

  return (
    <Page title="Gratitude journal" subtitle="One line from each person, each evening. Saved on this device as you type." back={{ href: '/faith', label: 'Devotions' }} barCenter={<BarTitle title="Gratitude journal" />} sky="candle">
      <div className="section gutter">
        <Segmented label="Day" value={day} onChange={setDay} options={DAY_OPTIONS} />
      </div>

      <div className="jn-prompt gutter-text">
        <Eyebrow>
          {DAY_LABEL[day].long} · {DAY_LABEL[day].date}
        </Eyebrow>
        <div className="jn-prompt-row">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2 key={prompt} className="t-title-2 jn-q" initial={calm ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={calm ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={calm ? fade.base : spring.enter}>
              {prompt}
            </motion.h2>
          </AnimatePresence>
        </div>
        <Button size="sm" variant="ghost" icon={ArrowsClockwise} onClick={() => setShift((s) => s + 1)} className="jn-another">
          Another question
        </Button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={day} className="jn-card" initial={calm ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={calm ? fade.base : { ...spring.enter, opacity: fade.base }}>
          {family.map((name, i) => (
            <Entry key={`${day}-${i}`} day={day} i={i} name={name} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="section">
        <ListGroup>
          <NavRow href="/faith/lookback" icon={BookBookmark} title="Look back" subtitle="Every line from the weekend, by day" />
        </ListGroup>
      </div>
    </Page>
  );
}

function Entry({ day, i, name }: { day: TripDayId; i: number; name: string }) {
  const key = `journal:${day}:${i}`;
  const [stored, setStored] = useStored<string>(key, '');
  const text = typeof stored === 'string' ? stored : '';
  const [v, setV] = useState(text);
  const latest = useRef(text);
  const pending = useRef<number | undefined>(undefined);
  const savedTimer = useRef<number | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const calm = useCalm();

  // Another tab (or Settings' erase) changed it while we weren't typing.
  useEffect(() => {
    if (pending.current === undefined && text !== latest.current) {
      latest.current = text;
      setV(text);
    }
  }, [text]);

  const flush = () => {
    if (pending.current === undefined) return;
    window.clearTimeout(pending.current);
    pending.current = undefined;
    setStored(latest.current);
    setSaved(true);
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1400);
  };

  // Save whatever is pending when the page goes away.
  useEffect(
    () => () => {
      if (pending.current !== undefined) {
        window.clearTimeout(pending.current);
        setStored(latest.current);
      }
      window.clearTimeout(savedTimer.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onChange = (x: string) => {
    setV(x);
    latest.current = x;
    window.clearTimeout(pending.current);
    pending.current = window.setTimeout(flush, 450);
  };

  // Grow with the text.
  useLayoutEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [v]);

  return (
    <div className="jn-entry">
      <div className="jn-who">
        <label htmlFor={id} className="jn-label">
          <PersonAvatar index={i} name={name} size={28} />
          <span className="jn-name">{name}</span>
        </label>
        <AnimatePresence>
          {saved && (
            <motion.span className="jn-saved t-caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: calm ? 0.1 : 0.4 } }} transition={fade.quick}>
              <Check size={12} weight="bold" aria-hidden="true" />
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <textarea
        ref={ta}
        id={id}
        className="jn-input"
        rows={1}
        value={v}
        maxLength={1000}
        placeholder="One line…"
        onChange={(e) => onChange(e.target.value)}
        onBlur={flush}
        enterKeyHint="done"
        autoCapitalize="sentences"
      />
    </div>
  );
}
