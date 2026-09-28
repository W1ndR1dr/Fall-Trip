import type { ScreenProps } from '@/app/routes';
import { useChecklist } from '@/lib/store';
import { haptic } from '@/lib/feedback';
import { fmtTime } from '@/lib/time';
import { areas, days, RETRIEVED } from '@/content/trip.js';
import { hunt } from '@/content/kids.js';
import { Button, Card, Chip, EmptyState, ListGroup, ListRow, MapsButton, NavRow, Page, Section } from '@/ui';
import { CalendarDots, Clock, CurrencyDollar, Footprints, Info, Leaf, MapTrifold, Star, Toilet, Timer } from '@/ui/icons';
import { Specimen, type SpecimenId } from '@/art';
import { ENERGY, byId, isFood } from './data';
import { Effort, PlaceThumb } from './parts';
import './activities.css';

export default function Activity({ params }: ScreenProps) {
  const a = byId(params.id);
  const maybes = useChecklist('maybes');
  if (!a) {
    return (
      <Page title="Not found" back={{ href: '/explore', label: 'Activities' }} sky="plain">
        <EmptyState icon={MapTrifold} title="That activity isn't in the list" action={<Button href="/explore">All activities</Button>} />
      </Page>
    );
  }
  const starred = maybes.has(a.id);
  const finds = (a.hunt ?? []).map((h) => hunt.find((x) => x.id === h)).filter(Boolean) as (typeof hunt)[number][];
  const onPlan = days.flatMap((d) => d.items.filter((it) => (it as { menu?: string[] }).menu?.includes(a.id)).map((it) => ({ d, it })));

  const facts: [typeof Clock, string, string | undefined][] = [
    [Timer, 'Time', a.time],
    [Footprints, 'Walk', a.walk],
    [Toilet, 'Restrooms', a.wc],
    [CurrencyDollar, 'Fee', a.fee],
    [Clock, 'Hours', a.hours],
    [Info, 'Status', a.status],
  ];

  return (
    <Page title={a.name} eyebrow={areas[a.area as keyof typeof areas]?.name} back={{ href: '/explore', label: 'Activities' }} sky="day">
      <div className="gutter ac-hero-wrap">
        <PlaceThumb id={a.id} size="100%" km={16} aspect={16 / 9} className="ac-hero" label={a.name.replace(/ \(.*\)$/, "").split(",")[0]} />
      </div>

      <p className="t-reading gutter-text ac-lede">{a.text}</p>

      <div className="gutter ac-actions">
        {a.maps && Object.keys(a.maps).length > 0 && <MapsButton {...a.maps} place={a.name} label="Open in Maps" variant="primary" />}
        <Button
          icon={Star}
          aria-pressed={starred}
          className={starred ? 'ac-starred' : ''}
          onClick={() => {
            maybes.toggle(a.id);
            haptic();
          }}
        >
          {starred ? 'Starred' : 'Star'}
        </Button>
      </div>

      <Section title="Details">
        <ListGroup>
          {facts
            .filter(([, , v]) => v)
            .map(([I, k, v]) => (
              <ListRow key={k} icon={I} title={k} subtitle={v} />
            ))}
          {!isFood(a) && <ListRow icon={Footprints} title="Effort" subtitle={ENERGY[a.energy]} trailing={<Effort n={a.energy} />} />}
        </ListGroup>
      </Section>

      {onPlan.length > 0 && (
        <Section title="On the plan">
          <ListGroup>
            {onPlan.map(({ d, it }) => (
              <NavRow key={it.t} href={`/plan/${d.id}`} icon={CalendarDots} title={it.title} subtitle={`${d.label} ${fmtTime(it.t)}`} />
            ))}
          </ListGroup>
        </Section>
      )}

      {finds.length > 0 && (
        <Section title="Leaf hunt here">
          <Card>
            <div className="ac-finds">
              {finds.map((h) => (
                <Chip key={h.id} href="/kids/hunt" size="md" className="ac-find">
                  <span className="ac-find-art" aria-hidden="true">
                    <Specimen id={h.id as SpecimenId} found />
                  </span>
                  {h.name}
                </Chip>
              ))}
            </div>
          </Card>
        </Section>
      )}

      <p className="t-footnote ac-dim gutter-text ac-foot">
        <Leaf size={13} aria-hidden="true" /> Checked {RETRIEVED}. Hours change, so call ahead when it matters.
      </p>
    </Page>
  );
}
