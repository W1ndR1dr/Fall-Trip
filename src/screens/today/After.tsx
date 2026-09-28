// Home after the trip: a quiet look back (finds per kid, devotions, journal
// lines) that leads to the family look-back, and a gentle close.
import { useSyncExternalStore } from 'react';
import { daily, moments } from '@/content/devotions.js';
import { hunt } from '@/content/kids.js';
import { useKids } from '@/lib/family';
import { subscribe, useChecklist, useStored } from '@/lib/store';
import { Button, Card, IconButton, KidAvatar, ListGroup, NavRow, Page, Pips, Section } from '@/ui';
import { BookOpenText, Camera, GearSix, Leaf, NotePencil } from '@/ui/icons';
import { HUNT_MAIN, journalCount } from './data';

const MAIN_IDS = new Set(hunt.filter((h) => !(h as { bonus?: boolean }).bonus).map((h) => h.id));
const DEVOTIONS = [...daily, ...moments];

function KidHunt({ index, name }: { index: number; name: string }) {
  const { ids } = useChecklist(`hunt:${index}`);
  const main = ids.filter((id) => MAIN_IDS.has(id)).length;
  const bonus = ids.length - main;
  return (
    <li className="td-after-kid">
      <KidAvatar index={index} size={30} />
      <span className="td-after-kid-text">
        <b>{name}</b>
        <span className="t-footnote num">
          {main} of {HUNT_MAIN}
          {bonus > 0 ? ` · ${bonus} bonus` : ''}
        </span>
      </span>
      <Pips total={HUNT_MAIN} filled={main} variant="leaf" color={`var(--kid-${index + 1})`} size={11} label={`${name}: ${main} of ${HUNT_MAIN} found`} />
    </li>
  );
}

export function After() {
  const kids = useKids();
  const done = DEVOTIONS.map((d) => useStored<boolean>('done:' + d.id, false)[0]).filter(Boolean).length; // eslint-disable-line react-hooks/rules-of-hooks
  const lines = useSyncExternalStore(subscribe, journalCount, journalCount);
  return (
    <Page title="Welcome home" eyebrow="Eastern Sierra · Oct 9–11" subtitle="The weekend, in a few numbers." docTitle="Fall Trip" actions={<IconButton href="/settings" icon={GearSix} label="Settings" />} sky="dawn">
      <Section title="Leaf hunt">
        <Card>
          <ul className="td-after-kids">
            {kids.map((n, i) => (
              <KidHunt key={i} index={i} name={n} />
            ))}
          </ul>
        </Card>
      </Section>

      <div className="td-after-stats gutter">
        <Card inset={false} className="td-after-stat">
          <b className="td-big num">{done}</b>
          <span className="t-footnote">
            of {DEVOTIONS.length} devotions done
          </span>
        </Card>
        <Card inset={false} className="td-after-stat">
          <b className="td-big num">{lines}</b>
          <span className="t-footnote">{lines === 1 ? 'journal line' : 'journal lines'}</span>
        </Card>
      </div>

      <div className="section gutter">
        <Button href="/faith/lookback" block size="lg" icon={BookOpenText}>
          Look back together
        </Button>
      </div>

      <Section title="This week">
        <Card>
          <p className="t-reading">Press the best leaves between napkins inside a heavy book. They are ready in a week or two.</p>
        </Card>
        <div className="mt-3">
          <ListGroup>
            <NavRow href="/faith/journal" icon={NotePencil} title="Journal" subtitle="One line each, from every evening" />
            <NavRow href="/kids/photos" icon={Camera} title="Photo challenges" subtitle="Which ones did you get?" />
            <NavRow href="/kids/hunt" icon={Leaf} title="Leaf hunt" subtitle="Everything each kid found" />
          </ListGroup>
        </div>
      </Section>
    </Page>
  );
}
