// Both Sunday routes on the lit terrain: the one you're looking at drawn as
// the route, the other one muted, so the difference is visible at a glance.
// Sonora Pass lies north of the terrain data, so that stretch runs off the
// relief; a feather in the card color softens the edge.
import type { CSSProperties } from 'react';
import { FRIDAY_DRIVE, MapLabel, RouteLine, StopDot, Terrain, project, stop, stopFeet, useTerrain, type Crop, type MapLabelProps, type Pt } from '@/art';

const R = (k: Parameters<typeof stop>[1]) => stop('route', k)!;

/** Home over Tioga: Friday's drive, reversed. */
const TIOGA: readonly Pt[] = [...FRIDAY_DRIVE].reverse();

/** Home over Sonora Pass: US-395 north, CA-108 west, Columbia, Oakdale (approximate road geometry). */
const P = {
  bridgeport: project('route', 38.2557, -119.2313),
  sonoraJct: project('route', 38.3535, -119.4468),
  sonoraPass: project('route', 38.3281, -119.6364),
  dardanelle: project('route', 38.3408, -119.8325),
  strawberry: project('route', 38.1966, -119.9923),
  twainHarte: project('route', 38.0396, -120.2327),
  columbia: project('route', 38.0363, -120.401),
  jamestown: project('route', 37.953, -120.4227),
};
const SONORA: readonly Pt[] = [
  R('mammoth'),
  project('route', 37.655, -118.935),
  project('route', 37.807, -119.071),
  R('leevining'),
  R('conway'),
  P.bridgeport,
  P.sonoraJct,
  P.sonoraPass,
  P.dardanelle,
  P.strawberry,
  P.twainHarte,
  P.columbia,
  P.jamestown,
  R('oakdale'),
  R('bayarea'),
];

type Stop = { at: Pt; major?: boolean } & Omit<MapLabelProps, 'at'>;

const STOPS: Record<string, Stop[]> = {
  'route-tioga': [
    { at: R('mammoth'), major: true, title: 'Mammoth Lakes', sub: '9:30 am', side: 'below' },
    { at: R('leevining'), title: 'Lee Vining', sub: 'Last gas', side: 'above' },
    { at: R('tioga'), major: true, title: 'Tioga Pass', subAccent: `${stopFeet('tioga').toLocaleString('en-US')} ft`, side: 'left' },
    { at: R('tenaya'), title: 'Tenaya Lake', sub: 'Lunch', side: 'right' },
    { at: R('craneflat'), title: 'Crane Flat', side: 'right' },
    { at: R('groveland'), title: 'Groveland', side: 'left' },
  ],
  'route-sonora': [
    { at: R('mammoth'), major: true, title: 'Mammoth Lakes', sub: '9:00 am', side: 'below' },
    { at: P.bridgeport, title: 'Bridgeport', side: 'left' },
    { at: P.sonoraPass, major: true, title: 'Sonora Pass', subAccent: '9,623 ft', side: 'right' },
    { at: P.columbia, title: 'Columbia', sub: 'Festival', side: 'left' },
  ],
};

// Mammoth (top) to Groveland and Columbia (bottom); north runs left, past the relief's edge.
const CROP: Crop = [-105, 68, 410, 545];

/**
 * The relief stops at its north edge (x = 0); Sonora Pass lies beyond it.
 * Fade the relief out into the card over a wide, eased band so there's no seam.
 */
function NorthFeather() {
  const { uid } = useTerrain();
  const id = `${uid}-north`;
  const x0 = CROP[0] - 20;
  const x1 = 80;
  const at = (x: number) => (x - x0) / (x1 - x0);
  const stops: [number, number][] = [
    [0, 1],
    [at(-2), 1],
    [at(14), 0.86],
    [at(34), 0.55],
    [at(56), 0.22],
    [1, 0],
  ];
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          {stops.map(([o, a]) => (
            <stop key={o} offset={o} stopColor="var(--bg-2)" stopOpacity={a} />
          ))}
        </linearGradient>
      </defs>
      <rect x={x0} y={CROP[1] - 40} width={x1 - x0} height={CROP[3] + 80} fill={`url(#${id})`} />
    </>
  );
}

export function RouteMap({ id, style }: { id: string; style?: CSSProperties }) {
  const tioga = id === 'route-tioga';
  const stops = STOPS[id] ?? [];
  return (
    <Terrain region="route" crop={CROP} fade="bottom" style={style} label={tioga ? 'Map: the Tioga route home, with the Sonora Pass route faded' : 'Map: the Sonora Pass route home, with the Tioga route faded'}>
      <NorthFeather />
      <RouteLine points={tioga ? SONORA : TIOGA} variant="muted" />
      <RouteLine points={tioga ? TIOGA : SONORA} />
      {stops.map((s) => (
        <StopDot key={s.title} at={s.at} kind={s.major ? 'major' : 'minor'} />
      ))}
      {stops.map(({ at, major: _m, ...l }) => (
        <MapLabel key={l.title} at={at} {...l} />
      ))}
    </Terrain>
  );
}
