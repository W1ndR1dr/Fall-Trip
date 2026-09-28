import { useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { useChecklist } from '@/lib/store';
import { chime } from '@/lib/feedback';
import { Button, Card, CheckRow, ListGroup, Page, ProgressBar, Section, Sheet, announce, toast, useSettledOrder } from '@/ui';
import { ArrowCounterClockwise, Check, Thermometer } from '@/ui/icons';
import { PACK_TOTAL, WEATHER, packGroups, type PackGroup } from './data';
import { CountHead } from './Checklist';
import './plan.css';

const GROUPS = packGroups();
const VALID = new Set(GROUPS.flatMap((g) => g.items.map((i) => i.id)));

export default function Packing(_props: ScreenProps) {
  const list = useChecklist('pack');
  const packed = list.ids.filter((id) => VALID.has(id)).length;
  const [confirm, setConfirm] = useState(false);

  const toggle = (id: string) => {
    const on = list.toggle(id);
    const n = packed + (on ? 1 : -1);
    announce(`${n} of ${PACK_TOTAL} packed`);
    if (on && n === PACK_TOTAL) {
      chime();
      toast({ title: 'All packed', body: `All ${PACK_TOTAL} things are checked off.`, icon: Check });
    }
  };

  return (
    <Page title="Packing" back={{ href: '/plan', label: 'Plan' }} subtitle="Mornings can be in the 20s up high and afternoons in the 60s or 70s. Pack layers." sky="plain" width="wide">
      <div className="pl-pack-top">
        <Card className="pl-progress-card">
          <CountHead done={packed} total={PACK_TOTAL} word="packed" />
          <ProgressBar className="mt-3" value={packed / PACK_TOTAL} tone="neutral" label="Packed" valueText={`${packed} of ${PACK_TOTAL} packed`} />
        </Card>
        <Card className="pl-temps">
          <div className="pl-temps-head">
            <Thermometer size={16} weight="bold" aria-hidden="true" />
            <span>Normal highs and lows, Oct 9–11</span>
          </div>
          <ul className="pl-temps-list">
            {WEATHER.places.map((p) => (
              <li key={p.name}>
                <span className="pl-temps-place">{p.name}</span>
                <span className="pl-temps-val num" aria-label={`High ${p.hi}, low ${p.lo}`}>
                  <b>{p.hi}°</b> <span>{p.lo}°</span>
                </span>
                <span className="pl-temps-elev num">{p.elev}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="pl-groups">
        {GROUPS.map((g) => (
          <Group key={g.group} group={g} has={list.has} toggle={toggle} />
        ))}
      </div>

      <div className="pl-reset gutter">
        <Button variant="ghost" icon={ArrowCounterClockwise} onClick={() => setConfirm(true)} disabled={packed === 0}>
          Uncheck all
        </Button>
      </div>

      <Sheet
        open={confirm}
        onOpenChange={setConfirm}
        title="Uncheck the whole list?"
        description={`This clears all ${packed} checks on this device. It can't be undone.`}
        footer={
          <div className="pl-sheet-actions">
            <Button
              size="lg"
              block
              className="pl-danger"
              icon={ArrowCounterClockwise}
              onClick={() => {
                list.clear();
                setConfirm(false);
                announce('Packing list cleared');
              }}
            >
              Uncheck all
            </Button>
            <Button size="lg" variant="ghost" block onClick={() => setConfirm(false)}>
              Keep my checks
            </Button>
          </div>
        }
      />
    </Page>
  );
}

function Group({ group, has, toggle }: { group: PackGroup; has: (id: string) => boolean; toggle: (id: string) => void }) {
  const order = useSettledOrder(group.items, (i) => i.id, (i) => has(i.id));
  const done = group.items.filter((i) => has(i.id)).length;
  return (
    <Section
      className="pl-group"
      title={group.group}
      note={group.note}
      action={
        <span className="pl-group-count num" aria-label={`${done} of ${group.items.length} packed`}>
          {done === group.items.length ? <Check size={14} weight="bold" aria-hidden="true" /> : null}
          {done}/{group.items.length}
        </span>
      }
    >
      <ListGroup label={group.group}>
        {order.map((i) => (
          <CheckRow key={i.id} checked={has(i.id)} onChange={() => toggle(i.id)} title={i.title} subtitle={i.sub ?? undefined} detail={i.qty ?? undefined} />
        ))}
      </ListGroup>
    </Section>
  );
}
