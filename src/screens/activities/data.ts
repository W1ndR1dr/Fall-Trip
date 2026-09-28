// Activities: the optional menu. Places are located on the real terrain so
// each card can show where it is. Coordinates are approximate trailhead or
// town points (lat, lon), used only for small illustrative crops.
import { menu, areas } from '@/content/trip.js';
import { project, REGIONS, type Pt, type Region } from '@/art';

export type Activity = (typeof menu)[number] & {
  kind?: string;
  hours?: string;
  walk?: string;
  wc?: string;
  fee?: string;
  status?: string;
  hunt?: string[];
  maps?: { q?: string; ll?: string; daddr?: string };
};
export type AreaKey = keyof typeof areas;

export const ACTIVITIES = menu as Activity[];
export const AREA_KEYS = Object.keys(areas) as AreaKey[];
export const byId = (id?: string) => ACTIVITIES.find((a) => a.id === id);
export const isFood = (a: Activity) => a.kind === 'food';

const LL: Record<string, [number, number]> = {
  lundy: [38.03, -119.24], conway: [38.087, -119.185], southtufa: [37.938, -119.027], panum: [37.925, -119.047],
  monovc: [37.968, -119.121], basincafe: [37.957, -119.122], monomarket: [37.957, -119.12], whoanellie: [37.951, -119.117],
  lattede: [37.957, -119.121], virginia: [38.047, -119.26], leavesloop: [37.775, -119.08], juneloop: [37.784, -119.126],
  junebrew: [37.778, -119.075], silverlakecafe: [37.784, -119.126], convict: [37.593, -118.853], hotcreek: [37.661, -118.826],
  quake: [37.627, -119.012], obsidiandome: [37.756, -119.02], lakesbasin: [37.615, -119.007], postpile: [37.651, -119.037],
  woollys: [37.651, -119.037], bookyjoint: [37.646, -118.967], rmcf: [37.646, -118.967], blackvelvet: [37.648, -118.972],
  stellar: [37.648, -118.973], goodlife: [37.648, -118.972], schatsmammoth: [37.648, -118.972], johnspizza: [37.645, -118.965],
  eatery: [37.646, -118.966], burgers: [37.651, -118.985], library: [37.643, -118.965], stars: [37.648, -118.972],
  mcgee: [37.56, -118.79], rockcreek: [37.49, -118.72], oakdalecheese: [37.767, -120.847], bloomingcamp: [37.767, -120.83],
  sonsfarm: [37.766, -120.84], aroundthehorn: [37.839, -120.232], prieststation: [37.824, -120.25], olmsted: [37.811, -119.486],
  tenaya: [37.829, -119.456], sodasprings: [37.877, -119.37], columbia: [38.036, -120.4], railtown: [37.953, -120.421],
  joansfarm: [37.62, -121.72],
};

function inside(region: Region, lat: number, lon: number) {
  const b = REGIONS[region].bounds;
  return lat >= b.south && lat <= b.north && lon >= b.west && lon <= b.east;
}

/** Where an activity sits on the terrain: the detailed Eastside map when it fits, else the whole drive. */
export function placeOf(id: string): { region: Region; at: Pt } | null {
  const ll = LL[id];
  if (!ll) return null;
  const region: Region = inside('eastside', ll[0], ll[1]) ? 'eastside' : inside('route', ll[0], ll[1]) ? 'route' : (null as never);
  if (!region) return null;
  return { region, at: project(region, ll[0], ll[1]) };
}

/** Map-units wide for a crop showing roughly `km` kilometres. */
export const spanFor = (region: Region, km: number) => (region === 'eastside' ? 7.7 : 4) * km;

export const FILTERS = [
  ['all', 'All'],
  ['maybe', 'Starred'],
  ['color', 'Fall color'],
  ['animals', 'Animals'],
  ['rocks', 'Rocks & volcanoes'],
  ['stars', 'Stars'],
  ['crafts', 'Crafts'],
  ['cozy', 'Cozy'],
  ['easy', 'Low energy'],
  ['food', 'Food & coffee'],
] as const;
export type FilterKey = (typeof FILTERS)[number][0];
export const FILTER_KEYS = FILTERS.map(([k]) => k) as readonly string[];

export function matches(a: Activity, f: FilterKey, starred: (id: string) => boolean) {
  if (f === 'all') return !isFood(a);
  if (f === 'maybe') return starred(a.id);
  if (f === 'easy') return a.energy === 1 && !isFood(a);
  if (f === 'food') return isFood(a);
  return (a.tags as string[] | undefined)?.includes(f) ?? false;
}

export const ENERGY = ['', 'Easy', 'Some walking', 'Hard work'];
