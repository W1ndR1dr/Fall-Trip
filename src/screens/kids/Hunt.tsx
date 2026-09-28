// Leaf hunt: one list per kid. Tap a picture when you find it; tap again to
// undo. Each kid's finds are saved on this device under hunt:0 / hunt:1 /
// hunt:2 (ids from src/content/kids.js), and the chosen kid under huntKid.
import { motion } from 'motion/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { Specimen } from '@/art';
import { hunt } from '@/content/kids.js';
import { useKids } from '@/lib/family';
import { chime, haptic } from '@/lib/feedback';
import { useChecklist, useStored } from '@/lib/store';
import { Button, Card, IconButton, KidPicker, NumberRoller, Page, Pips, Section, Sheet, Tag, announce, fadeUp, stagger, useCalm, useFirstVisit } from '@/ui';
import { ArrowDown, Check, Question } from '@/ui/icons';
import { burst, leafFall } from './HuntFx';
import { HuntTile, type TileFx } from './HuntTile';
import './Hunt.css';

type Item = { id: string; name: string; hint: string; bonus?: boolean };

const ITEMS = hunt as Item[];
const REGULAR = ITEMS.filter((h) => !h.bonus);
const BONUS = ITEMS.filter((h) => h.bonus);
const TOTAL = REGULAR.length;

/** Short tile labels a 6-year-old can read. The full name is in the hint. */
const SHORT: Record<string, string> = {
  aspen: 'Aspen leaf',
  cottonwood: 'Cottonwood leaf',
  willow: 'Willow leaf',
  birch: 'Birch leaf',
  red: 'A red leaf',
  big: 'Biggest leaf',
  heart: 'Heart\u2011shaped leaf',
  cone: 'A pinecone',
  granite: 'Granite sparkle',
  dam: 'Beaver dam',
  tufa: 'Tufa tower',
  eyes: 'Aspen eyes',
  track: 'Animal track',
  obsidian: 'Obsidian',
};
const short = (h: Item) => SHORT[h.id] ?? h.name;
/** Typographer's quotes for content written with straight ones. */
const curly = (t: string) => t.replace(/"([^"]*)"/g, '“$1”').replace(/'/g, '’');
const count = (ids: readonly string[], of: Item[]) => of.reduce((n, h) => n + (ids.includes(h.id) ? 1 : 0), 0);

export default function Hunt(_props: ScreenProps) {
  const kids = useKids();
  const calm = useCalm();
  const lists = [useChecklist('hunt:0'), useChecklist('hunt:1'), useChecklist('hunt:2')];
  const [storedKid, setKid] = useStored<number>('huntKid', 0);
  const kid = Math.min(2, Math.max(0, Number(storedKid) || 0));
  const list = lists[kid];
  const k = kid + 1;
  const color = `var(--kid-${k})`;

  const counts = lists.map((l) => count(l.ids, REGULAR));
  const found = counts[kid];
  const bonusFound = count(list.ids, BONUS);

  // Per-tile toggle signal: bumps only on this screen's own taps, so a tile
  // floods for a tap and cross-fades for a kid switch.
  const [fx, setFx] = useState<Record<string, TileFx>>({});
  const seq = useRef(0);

  const [hint, setHint] = useState<{ id: string; open: boolean }>({ id: 'aspen', open: false });
  const [how, setHow] = useState(false);
  const [done, setDone] = useState<{ kid: number; open: boolean }>({ kid: 0, open: false });
  const bonusRef = useRef<HTMLElement>(null);

  const toggle = useCallback(
    (id: string, at: [number, number] | null, from: HTMLElement | null) => {
      const item = ITEMS.find((h) => h.id === id);
      if (!item) return;
      const on = list.toggle(id);
      const ids = on ? [...list.ids, id] : list.ids.filter((x) => x !== id);
      const n = count(ids, REGULAR);
      setFx((f) => ({ ...f, [id]: { n: ++seq.current, at } }));
      haptic(on ? 12 : 8);
      if (on) {
        if (!calm && from) {
          const b = from.getBoundingClientRect();
          const art = from.classList.contains('hunt-tile');
          burst(b.left + b.width / 2, b.top + (art ? b.height * 0.42 : b.height / 2), id, color);
        }
        chime();
      }
      announce(item.bonus ? `${count(ids, BONUS)} of ${BONUS.length} bonus found` : `${n} of ${TOTAL} found`);
      if (on && !item.bonus && n === TOTAL) {
        // Everything on the list: a gentle leaf fall, then the sheet.
        window.setTimeout(() => {
          chime([523, 659, 784, 1047]);
          if (!calm) leafFall([color, 'var(--pig-gold)', 'var(--accent-mark)', color, 'var(--pig-red)']);
        }, 420);
        window.setTimeout(() => setDone({ kid, open: true }), calm ? 300 : 1100);
      }
    },
    [list, calm, color, kid],
  );

  const first = useFirstVisit('hunt-grid');
  const hintItem = ITEMS.find((h) => h.id === hint.id) ?? ITEMS[0];
  const hintFound = list.has(hintItem.id);
  const left = TOTAL - found;
  const bonusLeft = BONUS.filter((b) => !lists[done.kid].has(b.id));

  const tiles = (items: Item[], key: string) => (
    <motion.ul className="hunt-grid" initial={first ? 'hidden' : false} animate="show" variants={stagger(items.length)} aria-label={key}>
      {items.map((h) => (
        <motion.li key={h.id} variants={fadeUp} className="hunt-li">
          <HuntTile id={h.id} label={short(h)} found={list.has(h.id)} kid={kid} fx={fx[h.id]} onToggle={toggle} onHint={(id) => setHint({ id, open: true })} />
        </motion.li>
      ))}
    </motion.ul>
  );

  const summary = useMemo(() => {
    const parts: string[] = [];
    parts.push(left === 0 ? 'All found' : `${left} to go`);
    if (bonusFound) parts.push(`+${bonusFound} bonus`);
    return parts.join(' · ');
  }, [left, bonusFound]);

  return (
    <Page
      title="Leaf hunt"
      back={{ href: '/kids', label: 'Kids' }}
      subtitle="Tap a picture when you find it."
      actions={<IconButton icon={Question} label="How to play" onClick={() => setHow(true)} />}
      sky="dawn"
      width="wide"
    >
      <div className="hunt-top">
        <KidPicker
          className="hunt-picker"
          label="Whose hunt"
          value={kid}
          onChange={setKid}
          names={kids}
          details={counts.map((c) => `${c} found`)}
          progress={counts.map((c) => c / TOTAL)}
        />

        <div role="progressbar" aria-label={`${kids[kid]}'s hunt`} aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={found} aria-valuetext={`${found} of ${TOTAL} found`}>
          <Card className="hunt-progress" inset={false}>
            <div className="hunt-progress-row">
              <span className="hunt-count" style={{ color: found ? undefined : 'var(--text-3)' }}>
                <NumberRoller value={found} />
              </span>
              <span className="hunt-progress-text">
                <span className="hunt-of num">of {TOTAL} found</span>
                <span className="hunt-left num">{summary}</span>
              </span>
            </div>
            <div className="hunt-pips">
              <Pips total={TOTAL} filled={found} variant="leaf" color={color} size={17} label={`${found} of ${TOTAL} found`} />
            </div>
          </Card>
        </div>
      </div>

      <Section title="Things to find" className="hunt-section">
        {tiles(REGULAR, 'Things to find')}
      </Section>

      {BONUS.length > 0 && (
        <section className="section hunt-section" ref={bonusRef} aria-labelledby="hunt-bonus">
          <div className="section-head">
            <div className="section-head-row">
              <h2 id="hunt-bonus" className="t-eyebrow section-title">
                Bonus
              </h2>
            </div>
            <p className="t-footnote section-note">Extra finds. They don’t count toward the {TOTAL}.</p>
          </div>
          {tiles(BONUS, 'Bonus finds')}
        </section>
      )}

      {/* Hint: the full name and what to look for. */}
      <Sheet
        open={hint.open}
        onOpenChange={(open) => setHint((h) => ({ ...h, open }))}
        title={curly(hintItem.name)}
        footer={
          hintFound ? (
            <Button
              size="lg"
              block
              onClick={(e) => {
                toggle(hintItem.id, null, e.currentTarget as HTMLElement);
                setHint((h) => ({ ...h, open: false }));
              }}
            >
              Not found yet
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              block
              icon={Check}
              onClick={(e) => {
                toggle(hintItem.id, null, e.currentTarget as HTMLElement);
                setHint((h) => ({ ...h, open: false }));
              }}
            >
              {kids[kid]} found it
            </Button>
          )
        }
      >
        <div className="hunt-hint-art" style={{ ['--kid' as string]: color }}>
          <div className={hintItem.id === 'big' ? 'hunt-hint-svg hunt-hint-svg-big' : 'hunt-hint-svg'}>
            <Specimen id={hintItem.id} found />
          </div>
          {hintFound && (
            <span className="hunt-hint-found t-footnote">
              <Check size={13} weight="bold" aria-hidden="true" /> {kids[kid]} found it
            </span>
          )}
        </div>
        {hintItem.bonus && (
          <div className="mb-2">
            <Tag>Bonus</Tag>
          </div>
        )}
        <p className="t-reading">{curly(hintItem.hint)}</p>
      </Sheet>

      {/* How to play */}
      <Sheet open={how} onOpenChange={setHow} title="How to play">
        <ol className="hunt-how">
          <li>
            <b>Pick your name</b> at the top. Everyone has their own list.
          </li>
          <li>
            <b>Tap a picture</b> when you find that thing. Tap it again if you made a mistake.
          </li>
          <li>
            <b>Need help?</b> Tap the light bulb on a picture, or press and hold it, to read a hint.
          </li>
          <li>
            <b>Find all {TOTAL}.</b> Then try the {BONUS.length} bonus finds.
          </li>
        </ol>
      </Sheet>

      {/* All found */}
      <Sheet
        open={done.open}
        onOpenChange={(open) => setDone((d) => ({ ...d, open }))}
        title={`All ${TOTAL} found`}
        footer={
          bonusLeft.length ? (
            <Button
              size="lg"
              block
              iconEnd={ArrowDown}
              onClick={() => {
                setDone((d) => ({ ...d, open: false }));
                window.setTimeout(() => {
                  const el = bonusRef.current;
                  const sc = el?.closest<HTMLElement>('.page');
                  if (el && sc) sc.scrollTo({ top: el.offsetTop - 64, behavior: calm ? 'auto' : 'smooth' });
                }, 350);
              }}
            >
              Try the bonus finds
            </Button>
          ) : (
            <Button size="lg" block onClick={() => setDone((d) => ({ ...d, open: false }))}>
              Done
            </Button>
          )
        }
      >
        <p className="t-body mb-4">
          {kids[done.kid]} found everything on the list.
          {bonusLeft.length ? ` ${bonusLeft.length === 1 ? 'One bonus find is' : `${bonusLeft.length} bonus finds are`} still out there.` : ' Even the bonus finds!'}
        </p>
        <ul className="hunt-trophy" aria-label="Found">
          {REGULAR.map((h) => (
            <li key={h.id} title={short(h)}>
              <Specimen id={h.id} found label={short(h)} />
            </li>
          ))}
        </ul>
      </Sheet>
    </Page>
  );
}
