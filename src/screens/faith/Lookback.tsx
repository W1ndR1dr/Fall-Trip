// Look back (Sunday): the weekend in the family's own words. Journal lines by
// day and person, what the leaf hunt found, the devotions you did, and a
// closing verse to read together.
import { motion } from 'motion/react';
import type { ScreenProps } from '@/app/routes';
import { hunt } from '@/content/kids.js';
import { activities } from '@/content/trip.js';
import { useFamily, useKids } from '@/lib/family';
import { get } from '@/lib/store';
import { Button, Card, EmptyState, ListGroup, ListRow, Page, Pips, Section, fadeUp, stagger, useFirstVisit } from '@/ui';
import { Check, NotePencil } from '@/ui/icons';
import { BarTitle, PersonAvatar, useDoneIds, useStoreValue, useTranslation } from './bits';
import { ALL, DAY_LABEL, PROMPTS, TRIP_DAYS, promptIndex } from './data';
import { ScriptureText, Notice, TranslationSwitch } from './Passage';

const CLOSING = 'Ecclesiastes 3:11';
type HuntItem = { id: string; bonus?: boolean };
const HUNT = hunt as HuntItem[];
const MAIN = HUNT.filter((h) => !h.bonus).map((h) => h.id);
const PHOTOS = (activities as { photos: { id: string }[] }).photos.map((p) => p.id);

const ids = (key: string): string[] => {
  const v = get<unknown>(key, []);
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
};

export default function Lookback(_props: ScreenProps) {
  const kids = useKids();
  const family = useFamily();
  const done = useDoneIds();
  const [tr] = useTranslation();
  const first = useFirstVisit('faith-lookback');

  // Snapshots of the stored data (strings so the store hook can compare them).
  const journalRaw = useStoreValue(() => JSON.stringify(TRIP_DAYS.map((d) => [0, 1, 2, 3, 4].map((i) => String(get<string>(`journal:${d}:${i}`, '') || '').trim()))));
  const huntRaw = useStoreValue(() => JSON.stringify([0, 1, 2].map((k) => ids(`hunt:${k}`))));
  const photos = useStoreValue(() => ids('photos').filter((p) => PHOTOS.includes(p)).length);

  const journal = JSON.parse(journalRaw) as string[][];
  const found = JSON.parse(huntRaw) as string[][];
  const mainFound = found.map((f) => f.filter((x) => MAIN.includes(x)).length);
  const bonusFound = found.map((f, k) => f.length - mainFound[k]);
  const leaves = found.reduce((a, f) => a + f.length, 0);
  const doneList = ALL.filter((d) => done.has(d.id));
  const days = TRIP_DAYS.map((d, k) => ({ d, entries: family.map((name, i) => ({ name, i, text: journal[k]?.[i] ?? '' })).filter((e) => e.text) })).filter((x) => x.entries.length);

  return (
    <Page title="Look back" eyebrow="Sunday · Oct 11" subtitle="Read these together on the drive home or at dinner." back={{ href: '/faith', label: 'Devotions' }} barCenter={<BarTitle title="Look back" />} sky="candle">
      <motion.div initial={first ? 'hidden' : false} animate="show" variants={stagger(6, 0.05)}>
        <motion.div variants={fadeUp} className="lb-stats gutter">
          <Stat n={leaves} label={leaves === 1 ? 'hunt find' : 'hunt finds'} />
          <Stat n={doneList.length} label={doneList.length === 1 ? 'devotion' : 'devotions'} />
          <Stat n={photos} label={`of ${PHOTOS.length} photos`} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title="Journal">
            {days.length ? (
              <div className="lb-days">
                {days.map(({ d, entries }) => (
                  <Card key={d} className="lb-day" as="article">
                    <div className="lb-day-head">
                      <h3 className="t-title-3">{DAY_LABEL[d].long}</h3>
                      <p className="t-footnote">{PROMPTS[promptIndex(d)]}</p>
                    </div>
                    <ul className="lb-entries">
                      {entries.map((e) => (
                        <li key={e.i} className="lb-entry">
                          <PersonAvatar index={e.i} name={e.name} size={26} />
                          <div className="lb-entry-text">
                            <span className="lb-entry-name">{e.name}</span>
                            <p className="t-reading lb-entry-line">{e.text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <EmptyState icon={NotePencil} title="No journal lines yet" action={<Button size="sm" href="/faith/journal" icon={NotePencil}>Open the journal</Button>}>
                  Add one line each evening. They all show up here on Sunday.
                </EmptyState>
              </Card>
            )}
          </Section>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title="Leaf hunt">
            <ListGroup label="Leaf hunt by kid">
              {kids.map((name, k) => (
                <ListRow
                  key={k}
                  href="/kids/hunt"
                  icon={<PersonAvatar index={k} name={name} size={30} />}
                  title={name}
                  subtitle={<Pips total={MAIN.length} filled={mainFound[k]} variant="leaf" color={`var(--kid-${k + 1})`} label={`${mainFound[k]} of ${MAIN.length} found`} size={12} />}
                  detail={
                    <>
                      {mainFound[k]} of {MAIN.length}
                      {bonusFound[k] > 0 && <span className="lb-bonus"> +{bonusFound[k]}</span>}
                    </>
                  }
                />
              ))}
            </ListGroup>
          </Section>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title="Devotions" action={<span className="t-footnote num lb-note">{doneList.length} of {ALL.length} done</span>}>
            {doneList.length ? (
              <ListGroup label="Devotions done">
                {doneList.map((d) => (
                  <ListRow key={d.id} href={`/faith/${d.id}`} icon={<Check size={16} weight="bold" className="lb-check" aria-hidden="true" />} title={d.title} subtitle={d.read.join(' · ')} />
                ))}
              </ListGroup>
            ) : (
              <p className="t-callout gutter-text">Mark a devotion done at the end of its page and it shows up here.</p>
            )}
          </Section>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Section title="To close">
            <Card className="lb-close">
              <div className="lb-close-head">
                <span className="psg-ref">
                  {CLOSING}
                  <span className="psg-tr"> · {tr}</span>
                </span>
                <TranslationSwitch />
              </div>
              <ScriptureText passage={CLOSING} tr={tr} className="lb-verse" />
              <p className="t-callout lb-prompt">Go around the circle: what is one thing from this weekend you want to remember? Then thank God for it together.</p>
              <div className="lb-notice">
                <Notice tr={tr} />
              </div>
            </Card>
          </Section>
        </motion.div>
      </motion.div>
    </Page>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="lb-stat">
      <span className="lb-stat-n num">{n}</span>
      <span className="lb-stat-l">{label}</span>
    </div>
  );
}
