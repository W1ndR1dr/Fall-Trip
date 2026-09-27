// Shared imagery. Screens import from '@/art'.
export { Terrain, Relief, RouteLine, StopDot, MapLabel, WaterLabel, useTerrain, reliefTiles, cameraFor, useCamera, type Camera, type CameraValues, type TerrainProps, type MapLabelProps, type RouteLineProps } from './Terrain';
export {
  REGIONS,
  EAST_TO_ROUTE,
  EAST_TO_ROUTE_TRANSFORM,
  EASTSIDE_IN_ROUTE,
  STOP_NAMES,
  FRIDAY_DRIVE,
  FRIDAY_DRIVE_EAST,
  project,
  unproject,
  stop,
  stopElevation,
  stopFeet,
  eastToRoute,
  routeToEast,
  cropAround,
  splinePath,
  feet,
  fmtFeet,
  type Region,
  type Pt,
  type Crop,
  type StopKey,
} from './geo';
export { Specimen, Leaf, specimenSilhouette, SPECIMEN_IDS, type SpecimenId, type SpecimenProps } from './specimens';
export { LeafMark, LeafPip, MapsDiamond, Car } from '@/ui/glyphs';
