import type { ScreenProps } from '@/app/routes';
import { stopFeet } from '@/art';
import { useStored } from '@/lib/store';
import { haptic } from '@/lib/feedback';
import { Button, Card, EmptyState, MapsButton, Page, Section, Tag, announce } from '@/ui';
import { Check, GasPump, RoadHorizon, Warning } from '@/ui/icons';
import { ROUTES, choiceKey, routeChoiceItem, routeName, routeSteps, type RouteStep } from './data';
import { RouteMap } from './RouteMap';
import { Stat } from './parts';
import './plan.css';

// Side-by-side facts, restated from trip.js (the routes' summaries and legs,
// and Sunday's "Choose the route home" item).
const FACTS: Record<string, { curves: string; fuel: string; stops: string; warn: { icon: typeof Warning; text: string } }> = {
  'route-tioga': {
    curves: 'Gentler curves',
    fuel: 'Fill up in Lee Vining: last gas for 59 mi',
    stops: 'Tenaya Lake picnic, Oakdale farm stop',
    warn: { icon: GasPump, text: 'Last gas for 59 miles. Fill the tank in Lee Vining.' },
  },
  'route-sonora': {
    curves: 'Grades up to 26% and hairpins',
    fuel: 'Lee Vining or Bridgeport. No gas on the pass',
    stops: "Columbia's Harvest Festifall (10–5)",
    warn: { icon: Warning, text: 'Grades up to 26% and hairpins. Give car-sickness meds 30 minutes before CA-108.' },
  },
};

const DIRECTIONS: Record<string, { daddr: string; label: string; place: string }> = {
  'route-tioga': { daddr: 'Tenaya Lake, Yosemite', label: 'Directions to Tenaya Lake', place: 'Tenaya Lake' },
  'route-sonora': { daddr: 'Columbia State Historic Park, Columbia, CA', label: 'Directions to Columbia', place: 'Columbia State Historic Park' },
};

function summit(id: string): string {
  if (id === 'route-tioga') return `${stopFeet('tioga').toLocaleString('en-US')} ft`;
  const m = /([\d,]+) ft/.exec(ROUTES[id]?.legs.map((l) => l[1]).join(' ') ?? '');
  return m ? `${m[1]} ft` : '—';
}
const summitName = (id: string) => (id === 'route-tioga' ? 'Tioga Pass' : 'Sonora Pass');
const total = (id: string) => /Realistic total:\s*(.+?)\s+with stops/i.exec(ROUTES[id]?.note ?? '')?.[1]?.replace(/hours?/, 'hr') ?? '';

function ends(id: string) {
  const steps = routeSteps(id).filter((s) => s.time);
  const first = steps[0];
  const last = steps[steps.length - 1];
  const fmt = (s: RouteStep | undefined) => (s ? { time: s.time!.replace('~', ''), period: s.period, about: s.time!.startsWith('~') } : null);
  return { leave: fmt(first), home: fmt(last) };
}

export default function RouteOption({ params }: ScreenProps) {
  const id = params.id ?? '';
  const route = ROUTES[id];
  const chooser = routeChoiceItem();
  const [chosen, setChosen] = useStored<string | null>(chooser ? choiceKey(chooser) : '__none', null);

  if (!route) {
    return (
      <Page title="Route" back={{ href: '/plan/sun', label: 'Plan' }} sky="plain">
        <EmptyState icon={RoadHorizon} title="No route by that name" action={<Button href="/plan/sun">Sunday plan</Button>}>
          The two Sunday routes are Tioga and Sonora Pass.
        </EmptyState>
      </Page>
    );
  }

  const other = Object.keys(ROUTES).find((k) => k !== id)!;
  const { name, recommended } = routeName(id);
  const facts = FACTS[id];
  const steps = routeSteps(id);
  const { leave, home } = ends(id);
  const dir = DIRECTIONS[id];
  const isChosen = chosen === id;

  const choose = () => {
    haptic(10);
    setChosen(isChosen ? null : id);
    announce(isChosen ? 'Route unchosen' : `${name} chosen for Sunday`);
  };

  return (
    <Page title={pageTitle(name)} eyebrow="Sunday · The drive home" subtitle={route.summary} back={{ href: '/plan/sun', label: 'Plan' }} sky="day" width="wide">
      <div className="pl-route">
        <div className="pl-route-top">
          <Card className="pl-route-stats">
            {(recommended || isChosen) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {recommended && <Tag>Recommended</Tag>}
                {isChosen && <Tag tone="neutral" icon={Check}>Chosen for Sunday</Tag>}
              </div>
            )}
            <div className="pl-stats">
              <Stat label="Leave Mammoth">
                {leave?.time}
                <span className="t-period">{leave?.period}</span>
              </Stat>
              <Stat label="Home">
                {home?.about ? <span className="pl-about">about </span> : null}
                {home?.time}
                <span className="t-period">{home?.period}</span>
              </Stat>
              <Stat label={`Top: ${summitName(id)}`} tone="accent">
                {summit(id)}
              </Stat>
              <Stat label="With stops">{total(id)}</Stat>
            </div>
            <div className="pl-warn" data-tone={id === 'route-tioga' ? 'ember' : 'neutral'}>
              <facts.warn.icon size={18} weight="bold" aria-hidden="true" />
              <p>{facts.warn.text}</p>
            </div>
            <div className="pl-route-actions">
              <MapsButton variant="primary" daddr={dir.daddr} place={dir.place} label={dir.label} />
              <Button icon={isChosen ? Check : undefined} onClick={choose} aria-pressed={isChosen} className={isChosen ? 'pl-chosen' : ''}>
                {isChosen ? 'Chosen' : 'Choose this route'}
              </Button>
            </div>
          </Card>
        </div>
        <div className="pl-route-map">
          <Card pad="none" inset={false} className="pl-map-card">
            <RouteMap id={id} />
            <div className="pl-map-key" aria-hidden="true">
              <span>
                <i className="pl-key-line" /> {name}
              </span>
              <span>
                <i className="pl-key-line" data-muted /> {routeName(other).name}
              </span>
            </div>
          </Card>
        </div>

        <div className="pl-route-main">
          <Section title="Stops and times" note="Sunday, Oct 11">
            <Card>
              <ol className="pl-steps pl-steps-lg" aria-label={`${name}: stops and times`}>
                {steps.map((s, k) => (
                  <li key={k} className="pl-step" data-alt={s.alt || undefined}>
                    <span className="pl-step-time num">
                      {s.alt ? 'or' : s.time?.replace('~', '')}
                      {!s.alt && <span className="t-period">{s.period}</span>}
                    </span>
                    <span className="pl-step-dot" aria-hidden="true" />
                    <span className="pl-step-text">
                      <span className="pl-step-title">
                        {s.optional && <Tag>Optional</Tag>} {s.title.replace(/^Or\s+/, '')}
                      </span>
                      {s.sub && (
                        <span className={`pl-step-sub ${s.fuel || s.sick ? 'pl-step-sub-warn' : ''}`}>
                          {s.fuel && <GasPump size={13} weight="bold" className="pl-step-warn" aria-hidden="true" />}
                          {!s.fuel && s.sick && <Warning size={13} weight="bold" className="pl-step-warn" aria-hidden="true" />}
                          {s.sub}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="t-footnote mt-4">{route.note}</p>
            </Card>
          </Section>

          <Section title="Compared with the other way">
            <Card className="pl-compare">
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">Fact</span>
                    </th>
                    <th scope="col">{shortName(id)}</th>
                    <th scope="col">{shortName(other)}</th>
                  </tr>
                </thead>
                <tbody>
                  <Row label="Leave" a={fmtEnd(ends(id).leave)} b={fmtEnd(ends(other).leave)} />
                  <Row label="Home" a={fmtEnd(ends(id).home)} b={fmtEnd(ends(other).home)} />
                  <Row label="Top" a={summit(id)} b={summit(other)} />
                  <Row label="Road" a={FACTS[id].curves} b={FACTS[other].curves} />
                  <Row label="Gas" a={FACTS[id].fuel} b={FACTS[other].fuel} />
                  <Row label="Stops" a={FACTS[id].stops} b={FACTS[other].stops} />
                </tbody>
              </table>
            </Card>
            <div className="mt-3">
              <Card href={`/route/${other}`} replace className="pl-other">
                <span className="pl-other-text">
                  <span className="pl-other-eyebrow">The other way</span>
                  <span className="t-headline">{routeName(other).name}</span>
                  <span className="t-callout">{ROUTES[other].summary}</span>
                </span>
                <span className="pl-other-go" aria-hidden="true">
                  <RoadHorizon size={20} />
                </span>
              </Card>
            </div>
          </Section>
        </div>
      </div>
    </Page>
  );
}

/** "Home over Sonora Pass + Columbia" → "Home over Sonora Pass", so the bar title fits beside the back button. */
const pageTitle = (name: string) => name.split(' + ')[0];
const shortName = (id: string) => (id === 'route-tioga' ? 'Tioga' : 'Sonora Pass');
const fmtEnd = (e: ReturnType<typeof ends>['leave']) => (e ? `${e.about ? 'About ' : ''}${e.time} ${e.period}` : '—');

function Row({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{a}</td>
      <td>{b}</td>
    </tr>
  );
}
