// The small lit-terrain tile beside each day's title: where that day happens.
// Decorative (the timeline carries the facts), so it is hidden from screen readers.
import { FRIDAY_DRIVE, RouteLine, StopDot, Terrain, cropAround, project, stop, type Crop, type Pt, type Region } from '@/art';
import type { TripDayId } from '@/lib/time';

type Thumb = { region: Region; crop: Crop; line: readonly Pt[]; major: Pt[]; minor: Pt[] };

const E = (k: Parameters<typeof stop>[1]) => stop('eastside', k)!;
const R = (k: Parameters<typeof stop>[1]) => stop('route', k)!;

const THUMBS: Record<TripDayId, Thumb> = {
  // Friday: Crane Flat over Tioga Pass to Mammoth.
  fri: { region: 'route', crop: cropAround('route', [196, 245], 330, 1), line: FRIDAY_DRIVE, major: [R('tioga'), R('mammoth')], minor: [R('craneflat'), R('leevining')] },
  // Saturday: the Mono Basin loop from Mammoth up to Lundy and Conway.
  sat: {
    region: 'eastside',
    crop: cropAround('eastside', [252, 212], 430, 1),
    line: [E('mammoth'), project('eastside', 37.655, -118.935), project('eastside', 37.807, -119.071), E('leevining'), E('lundy'), E('conway')],
    major: [E('mammoth')],
    minor: [E('southtufa'), E('junelake'), E('conway')],
  },
  // Sunday: down the west slope toward home.
  sun: { region: 'route', crop: cropAround('route', [188, 575], 420, 1), line: FRIDAY_DRIVE, major: [R('oakdale')], minor: [R('groveland'), R('craneflat')] },
};

export function DayThumb({ day, size = 84 }: { day: TripDayId; size?: number }) {
  const t = THUMBS[day];
  return (
    <div className="pl-thumb" style={{ width: size, height: size }} aria-hidden="true">
      <Terrain region={t.region} crop={t.crop} style={{ width: size, height: size }}>
        <RouteLine points={t.line} width={2.4} />
        {t.minor.map((p, i) => (
          <StopDot key={`m${i}`} at={p} />
        ))}
        {t.major.map((p, i) => (
          <StopDot key={`M${i}`} at={p} kind="major" />
        ))}
      </Terrain>
    </div>
  );
}
