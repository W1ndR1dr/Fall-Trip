import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import type { ScreenProps } from '@/app/routes';
import { useChecklist, useStored } from '@/lib/store';
import { areas, colorReport } from '@/content/trip.js';
import { Card, Chip, EmptyState, Page, Pressable, Section, fadeUp, navigate, spring, stagger, useCalm, useFirstVisit } from '@/ui';
import { CaretRight, Coffee, Clock, Star } from '@/ui/icons';
import { ACTIVITIES, AREA_KEYS, FILTERS, FILTER_KEYS, isFood, matches, type Activity, type FilterKey } from './data';
import { Effort, PlaceThumb, Spectrum, StarButton } from './parts';
import './activities.css';

const TOP = colorReport.spots[0];

export default function Explore({ params }: ScreenProps) {
  const [saved, setSaved] = useStored<string>('exploreFilter', 'all');
  const f = (FILTER_KEYS.includes(params.filter ?? '') ? params.filter : FILTER_KEYS.includes(saved) ? saved : 'all') as FilterKey;
  const maybes = useChecklist('maybes');
  const list = ACTIVITIES.filter((a) => matches(a, f, maybes.has));
  const groups = AREA_KEYS.map((k) => ({ k, items: list.filter((a) => a.area === k) })).filter((g) => g.items.length);

  const first = useFirstVisit('explore');
  const calm = useCalm();
  const pick = (k: FilterKey) => {
    setSaved(k);
    navigate(k === 'all' ? '/explore' : `/explore/${k}`, { replace: true });
  };

  return (
    <Page title="Activities" subtitle="Nothing here is required. Star what sounds good and decide on the day." sky="day" width="wide">
      <div className="ac-filters gutter" role="group" aria-label="Show">
        {FILTERS.map(([k, label]) => (
          <Chip key={k} size="md" selected={f === k} onClick={() => pick(k)} icon={k === 'maybe' ? Star : undefined}>
            {k === 'maybe' && maybes.count ? `${label} ${maybes.count}` : label}
          </Chip>
        ))}
      </div>

      {f === 'all' && (
        <div className="ac-shortcuts">
          <Card href="/color" className="ac-shortcut" inset={false}>
            <span className="t-headline">Color report</span>
            <Spectrum level={TOP.level} />
            <span className="t-footnote ac-dim">
              <b>{TOP.name}</b> {TOP.proj.toLowerCase()}
            </span>
          </Card>
          <Card href="/food" className="ac-shortcut" inset={false}>
            <span className="ac-shortcut-head">
              <Coffee size={18} aria-hidden="true" />
              <span className="t-headline">Food & coffee</span>
            </span>
            <span className="t-footnote ac-dim">Cocoa, lattes, caramel apples, and October hours</span>
          </Card>
        </div>
      )}

      <LayoutGroup>
        <motion.div initial={first ? 'hidden' : false} animate="show" variants={stagger(groups.length)}>
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.length ? (
              groups.map((g) => (
                <motion.div key={g.k} layout={!calm} variants={fadeUp} exit={{ opacity: 0 }} transition={spring.glide}>
                  <Section title={areas[g.k].name} note={areas[g.k].drive}>
                    <div className="ac-grid">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {g.items.map((a) => (
                          <motion.div
                            key={a.id}
                            layout={!calm}
                            initial={calm ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={calm ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                            transition={spring.glide}
                          >
                            <ActivityCard a={a} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </Section>
                </motion.div>
              ))
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState icon={Star} title="Nothing starred yet">
                  Tap the star on anything that sounds good. Starred things show up here.
                </EmptyState>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </Page>
  );
}

function ActivityCard({ a }: { a: Activity }) {
  return (
    <Card pad="none" inset={false} className="ac-card">
      <Pressable href={`/do/${a.id}`} className="ac-card-link" aria-label={a.name}>
        <PlaceThumb id={a.id} size={76} className="ac-card-thumb" />
        <span className="ac-card-body">
          <span className="t-headline ac-card-name">{a.name}</span>
          <span className="t-callout ac-dim ac-clamp">{a.text}</span>
          <span className="ac-meta t-footnote">
            <span className="ac-meta-item">
              <Clock size={14} aria-hidden="true" />
              <span className="num">{a.time}</span>
            </span>
            {!isFood(a) && <Effort n={a.energy} />}
            {isFood(a) && a.hours && <span className="ac-dim ac-clamp-1">{a.hours}</span>}
          </span>
        </span>
        <CaretRight size={16} className="ac-chev" aria-hidden="true" />
      </Pressable>
      <div className="ac-card-star">
        <StarButton id={a.id} name={a.name} size="sm" />
      </div>
    </Card>
  );
}
