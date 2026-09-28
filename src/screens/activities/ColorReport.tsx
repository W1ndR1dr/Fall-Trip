import type { ScreenProps } from '@/app/routes';
import { colorReport } from '@/content/trip.js';
import { Card, ListGroup, ListRow, Page, Section, Tag } from '@/ui';
import { MapLabel, Terrain, WaterLabel, project, stop, type Pt } from '@/art';
import { Spectrum } from './parts';
import './activities.css';

type Spot = (typeof colorReport.spots)[number] & { warn?: string; far?: boolean };
const SPOTS = colorReport.spots as Spot[];
const SCALE = colorReport.scale;

// Approximate points for the spots that fall inside the Eastside map.
const LL: Record<string, [number, number]> = {
  'Conway Summit': [38.087, -119.185],
  'Lundy Canyon': [38.03, -119.24],
  'June Lake Loop': [37.781, -119.075],
  'McGee Creek': [37.563, -118.795],
  'Convict Lake': [37.593, -118.853],
  'Virginia Lakes': [38.047, -119.262],
  'Sagehen Summit': [37.86, -118.93],
};
const SIDE: Record<string, 'left' | 'right' | 'above' | 'below'> = { 'McGee Creek': 'below', 'Virginia Lakes': 'left', 'Convict Lake': 'left', 'Lundy Canyon': 'right', 'Conway Summit': 'left' };
const ON_MAP = SPOTS.filter((s) => LL[s.name]).map((s) => ({ s, at: project('eastside', ...LL[s.name]) as Pt }));
const OFF_MAP = SPOTS.filter((s) => !LL[s.name]);

const stageOf = (level: number) => Math.max(0, Math.min(4, Math.round(level) - 1));
const stageName = (level: number) => SCALE[stageOf(level)];

export default function ColorReport(_props: ScreenProps) {
  return (
    <Page title="Color report" eyebrow={`Checked ${colorReport.retrieved}`} back={{ href: '/explore', label: 'Activities' }} sky="day" width="wide">
      <p className="t-reading gutter-text ac-lede">{colorReport.summary}</p>

      <Section title="Where the color is">
        <Card pad="none" className="ac-map-card">
          <div className="ac-map">
            <Terrain region="eastside" label="Map of the Eastern Sierra with the fall color spots" fade="edges" style={{ width: '100%', height: '100%' }}>
              <WaterLabel at={stop('eastside', 'monolake')!}>Mono Lake</WaterLabel>
              {ON_MAP.map(({ s, at }) => (
                <g key={s.name}>
                  <circle cx={at[0]} cy={at[1]} r={7} className={`ac-dot ac-dot-${stageOf(s.level)}`} />
                  <MapLabel at={at} title={`${s.rank}. ${s.name}`} sub={stageName(s.level)} side={SIDE[s.name] ?? (at[0] > 380 ? 'left' : 'right')} size="sm" />
                </g>
              ))}
              {(() => {
                const m = stop('eastside', 'mammoth')!;
                return <MapLabel at={m} title="Mammoth" side="below" size="sm" />;
              })()}
            </Terrain>
          </div>
          <span className="ac-compass t-caption" aria-hidden="true">
            <span className="ac-compass-arrow">↑</span> East is up, like the drive
          </span>
          <Legend />
          {OFF_MAP.length > 0 && <p className="t-footnote ac-dim ac-map-note">Off this map: {OFF_MAP.map((s) => s.name).join(', ')}.</p>}
        </Card>
      </Section>

      <Section title="Higher is further along" note="This weekend's band: 7,600–8,600 ft">
        <Card>
          <ElevationChart />
        </Card>
      </Section>

      <Section title="All 12 spots" note={colorReport.asOf}>
        <div className="ac-grid ac-spots">
          {SPOTS.map((s) => (
            <Card key={s.name} inset={false} className="ac-spot">
              <div className="ac-spot-head">
                <span className="ac-rank num" aria-label={`Rank ${s.rank}`}>
                  {s.rank}
                </span>
                <span className="ac-spot-title">
                  <span className="t-headline">{s.name}</span>
                  <span className="t-footnote ac-dim num">{s.elev.toLocaleString('en-US')} ft</span>
                </span>
                {s.warn && <Tag tone="ember">{s.warn}</Tag>}
                {!s.warn && s.far && <Tag tone="fixed">Far drive</Tag>}
              </div>
              <Spectrum level={s.level} label={`Projected for Oct 9–11: ${s.proj}`} />
              <div className="ac-scale-legend t-caption" aria-hidden="true">
                <span>Starting</span>
                <span>Peak</span>
                <span>Past</span>
              </div>
              <dl className="ac-facts t-callout">
                <dt>Latest</dt>
                <dd>{s.now}</dd>
                <dt>Oct 9–11</dt>
                <dd>
                  <b>{s.proj}</b>
                </dd>
              </dl>
            </Card>
          ))}
        </div>
        <p className="t-footnote ac-dim gutter-text ac-foot">Projections for Oct 9–11 are estimates from those reports and the 2024–2025 timing.</p>
      </Section>

      <Section title="Latest reports">
        <ListGroup>
          {colorReport.links.map((l) => (
            <ListRow key={l.url} href={l.url} title={l.name} subtitle="Opens outside the app" />
          ))}
        </ListGroup>
      </Section>
    </Page>
  );
}

function Legend() {
  return (
    <div className="ac-legend t-caption" role="list" aria-label="Legend">
      {SCALE.map((name, i) => (
        <span key={name} className="ac-legend-item" role="listitem">
          <i className={`ac-dot-swatch ac-dot-${i}`} aria-hidden="true" />
          {name}
        </span>
      ))}
    </div>
  );
}

/** Elevation (y) against how far along the color is (x): the higher spots are further along. */
function ElevationChart() {
  const W = 340, H = 210, L = 44, R = 12, T = 12, B = 30;
  const lo = 7400, hi = 10000;
  const y = (e: number) => T + (1 - (e - lo) / (hi - lo)) * (H - T - B);
  const x = (lvl: number) => L + ((lvl - 1) / 4) * (W - L - R);
  const ticks = [7500, 8000, 8500, 9000, 9500, 10000];
  return (
    <figure className="ac-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Chart: spots above about 9,000 feet are projected past peak for Oct 9–11; spots between 7,600 and 8,600 feet are projected near peak to peak.">
        <rect x={L} y={y(8600)} width={W - L - R} height={y(7600) - y(8600)} className="ac-band" />
        <text x={W - R - 4} y={y(8600) + 12} textAnchor="end" className="ac-band-label">
          This weekend
        </text>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="ac-grid-line" />
            <text x={L - 6} y={y(t) + 3.5} textAnchor="end" className="ac-axis num">
              {t.toLocaleString('en-US')}
            </text>
          </g>
        ))}
        {['Start', 'Patchy', 'Near', 'Peak', 'Past'].map((s, i) => (
          <text key={s} x={x(i + 1)} y={H - 10} textAnchor="middle" className="ac-axis">
            {s}
          </text>
        ))}
        {SPOTS.map((s) => (
          <circle key={s.name} cx={x(s.level)} cy={y(s.elev)} r={5.5} className={`ac-dot ac-dot-${stageOf(s.level)}`}>
            <title>{`${s.name}, ${s.elev.toLocaleString('en-US')} ft: ${s.proj}`}</title>
          </circle>
        ))}
      </svg>
      <figcaption className="t-footnote ac-dim">Each dot is one spot, by elevation and projected color for our weekend.</figcaption>
    </figure>
  );
}

