import { useState } from 'react';
import type { ScreenProps } from '@/app/routes';
import { useChecklist } from '@/lib/store';
import { chime } from '@/lib/feedback';
import { Card, CheckRow, Fold, ListGroup, ListRow, NavRow, Page, ProgressBar, Section, Tag, announce, toast, useSettledOrder } from '@/ui';
import { Check, CloudSun, Fire, GearSix, Leaf, MapTrifold, Mountains, RoadHorizon, Signpost, TrafficCone, Tree, Warning, type Icon } from '@/ui/icons';
import { BEFORE, CONDITIONS, RETRIEVED, ROAD_NAMES, WEATHER, asOf, asOfDate, beforeItems, parseRoad, parseTioga } from './data';
import { CountHead } from './Checklist';
import './plan.css';

const ITEMS = beforeItems();
const VALID = new Set(ITEMS.map((i) => i.id));

// One icon per live link, in content order (NPS, QuickMap, CA-120, NWS ×2, AirNow, Mono County, CaliforniaFallColor).
const LINK_ICONS: [RegExp, Icon][] = [
  [/nps\.gov/, Mountains],
  [/quickmap/, MapTrifold],
  [/roads\.dot/, TrafficCone],
  [/weather\.gov/, CloudSun],
  [/airnow/, Fire],
  [/monocounty/, Leaf],
  [/fallcolor/i, Tree],
];
const linkIcon = (url: string) => LINK_ICONS.find(([re]) => re.test(url))?.[1] ?? Signpost;

export default function BeforeYouGo(_props: ScreenProps) {
  const list = useChecklist('before');
  const done = list.ids.filter((id) => VALID.has(id)).length;
  const total = ITEMS.length;
  const order = useSettledOrder(ITEMS, (i) => i.id, (i) => list.has(i.id));

  const toggle = (id: string) => {
    const on = list.toggle(id);
    const n = done + (on ? 1 : -1);
    announce(`${n} of ${total} done`);
    if (on && n === total) {
      chime();
      toast({ title: 'All checked', body: 'Have a good drive.', icon: Check });
    }
  };

  return (
    <Page
      title="Before you go"
      back={{ href: '/plan', label: 'Plan' }}
      subtitle={`Check these Friday morning while you have signal. Everything else in this app was gathered ${asOfDate(RETRIEVED + 'T12:00:00-07:00')}.`}
      sky="plain"
    >
      <Card className="pl-progress-card">
        <CountHead done={done} total={total} word="done" />
        <ProgressBar className="mt-3" value={done / total} tone="neutral" label="Checklist" valueText={`${done} of ${total} done`} />
      </Card>

      <Section title="Checklist">
        <ListGroup label="Before you go">
          {order.map((i) => (
            <CheckRow key={i.id} checked={list.has(i.id)} onChange={() => toggle(i.id)} title={i.title} subtitle={i.sub ?? undefined} />
          ))}
        </ListGroup>
        <div className="mt-3">
          <ListGroup>
            <NavRow href="/settings" icon={GearSix} title="Settings" subtitle="Kids' names and the lodging address" />
          </ListGroup>
        </div>
      </Section>

      <Section title="Check live" note="These open outside the app and need signal.">
        <ListGroup label="Live conditions">
          {BEFORE.links.map((l) => (
            <ListRow key={l.url} href={l.url} icon={linkIcon(l.url)} title={l.name} subtitle={l.why} />
          ))}
        </ListGroup>
      </Section>

      <Snapshot />

      <Section title="If Tioga is closed">
        <Card>
          <p className="t-body">Storm closures are rare in early October. Check NPS and QuickMap before you leave.</p>
          <dl className="pl-alts">
            <div>
              <dt>Sonora Pass</dt>
              <dd>CA-108. The best backup, 7¼–8¼ hr with stops. Grades up to 26%, so plan for car sickness.</dd>
            </div>
            <div>
              <dt>Carson Pass</dt>
              <dd>CA-89 and CA-88 via Monitor Pass. 8–8¾ hr.</dd>
            </div>
            <div>
              <dt>I-80</dt>
              <dd>Via Reno. 9½–10½ hr.</dd>
            </div>
          </dl>
          <p className="t-footnote mt-3">When chain controls are on, every vehicle must carry chains, including 4WD.</p>
        </Card>
        <div className="mt-3">
          <ListGroup>
            <NavRow href="/route/route-sonora" icon={RoadHorizon} title="Sunday over Sonora Pass" subtitle="Stops and times for the backup route" />
          </ListGroup>
        </div>
      </Section>
    </Page>
  );
}

/** A long Caltrans notice: three lines, with a toggle for the rest. */
function RoadText({ area, text }: { area: string; text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 160;
  return (
    <div className="pl-road-issue">
      <p className="pl-road-seg" data-clamp={long && !open ? '' : undefined}>
        <span className="pl-road-area">{area}</span> {text}
      </p>
      {long && (
        <button type="button" className="pl-more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Show less' : 'Show the full notice'}
        </button>
      )}
    </div>
  );
}

/** The conditions saved at the last update: forecasts, Tioga Road, Caltrans. */
function Snapshot() {
  const c = CONDITIONS;
  const tioga = parseTioga(c.tioga);
  const trip = c.forecasts.filter((f) => f.onTrip);
  const roads = Object.entries(c.roads);
  return (
    <Section title="Saved conditions" note={`As of ${asOf(c.retrieved)}. Recheck live before you leave.`}>
      <div className="pl-snap">
        <Card>
          <div className="pl-snap-head">
            <span className="pl-snap-title">Tioga Road</span>
            {tioga?.status && <Tag tone={tioga.status === 'Open' ? 'ok' : 'ember'}>{tioga.status}</Tag>}
          </div>
          <p className="t-callout mt-1.5">{tioga ? tioga.note : 'Not captured in this update. Check NPS directly.'}</p>
          <p className="t-caption mt-2">Yosemite National Park (NPS)</p>
        </Card>

        <Card>
          <div className="pl-snap-head">
            <span className="pl-snap-title">Roads</span>
            <span className="t-caption">Caltrans</span>
          </div>
          <ul className="pl-roads">
            {roads.map(([id, text]) => {
              // Drop the "call this number" filler; fold "no restrictions" areas into one line.
              const segs = parseRoad(text).filter((sg) => !/road information/i.test(sg.text));
              const issues = segs.filter((sg) => !/no traffic restrictions/i.test(sg.text));
              const clearAreas = segs.filter((sg) => /no traffic restrictions/i.test(sg.text)).map((sg) => sg.area);
              return (
                <li key={id} className="pl-road">
                  <div className="pl-snap-head">
                    <span className="pl-road-name num">{ROAD_NAMES[id] ?? id}</span>
                    {segs.length > 0 && <Tag tone={issues.length ? 'ember' : 'ok'}>{issues.length ? 'Restrictions' : 'No restrictions'}</Tag>}
                  </div>
                  {segs.length === 0 && <p className="pl-road-seg">{text}</p>}
                  {issues.map((sg, k) => (
                    <RoadText key={k} area={sg.area} text={sg.text} />
                  ))}
                  {clearAreas.length > 0 && issues.length > 0 && <p className="pl-road-seg">No restrictions reported for the {clearAreas.join(' or the ')}.</p>}
                </li>
              );
            })}
            {roads.length === 0 && <li className="pl-road-seg">Not captured in this update.</li>}
          </ul>
        </Card>

        <Card>
          <div className="pl-snap-head">
            <span className="pl-snap-title">Weather</span>
            <span className="t-caption">National Weather Service</span>
          </div>
          {trip.length > 0 ? (
            <ul className="pl-fc">
              {trip.map((f) => (
                <li key={f.place}>
                  <span className="pl-fc-place">{f.place}</span>
                  <ul className="pl-fc-periods">
                    {f.periods.map((p) => (
                      <li key={p.name}>
                        <span className="pl-fc-name">{p.name}</span>
                        <b className="num">{p.temp.replace('F', '')}</b>
                        <span className="pl-fc-text">
                          {p.text}. Wind {p.wind}.
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="t-callout mt-1.5">The trip days aren't in the forecast yet. Until they are, these are the normals.</p>
              <ul className="pl-wx pl-wx-flat" aria-label="Normal highs and lows">
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
              <p className="t-footnote">{WEATHER.outlook}</p>
              {c.forecasts.length > 0 && (
                <Fold className="mt-3" summary="Forecast at the last update" detail={asOfDate(c.retrieved)}>
                  <ul className="pl-fc">
                    {c.forecasts.map((f) => (
                      <li key={f.place}>
                        <span className="pl-fc-place">{f.place}</span>
                        <ul className="pl-fc-periods">
                          {f.periods.slice(0, 3).map((p) => (
                            <li key={p.name}>
                              <span className="pl-fc-name">{p.name}</span>
                              <b className="num">{p.temp.replace('F', '')}</b>
                              <span className="pl-fc-text">{p.text}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </Fold>
              )}
            </>
          )}
        </Card>

        {c.errors.length > 0 && (
          <Card className="pl-snap-errors">
            <div className="pl-snap-head">
              <Warning size={16} weight="bold" aria-hidden="true" />
              <span className="pl-snap-title">Not updated</span>
            </div>
            <ul>
              {c.errors.map((e) => (
                <li key={e} className="t-callout">
                  {e}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </Section>
  );
}
