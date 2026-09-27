// Every hash route → its screen (lazily loaded). Owned by the foundation.
// Paths must match src/routes.ts (the offline test and deep links use them).
// Screen files live in src/screens/<area>/ and are owned by that area's
// builder; each default-exports a component that receives `params`.
import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { matchRoute } from 'wouter';
import { ROUTE_PATHS } from '../routes';
import { setPreloader } from './nav';
// Today is the landing screen: bundled with the shell so the first paint
// never waits for a chunk.
import Today from '../screens/today/Today';

export type ScreenProps = { params: Record<string, string | undefined> };
type Loader = () => Promise<{ default: ComponentType<ScreenProps> }>;

export type RouteDef = {
  path: string;
  load: Loader;
  Component: LazyExoticComponent<ComponentType<ScreenProps>> | ComponentType<ScreenProps>;
  /**
   * Pages with the same key are one page: moving between them re-renders in
   * place instead of transitioning (the Plan day switcher, Explore filters).
   */
  key?: (params: Record<string, string | undefined>) => string;
};

type Mod = { default: ComponentType<ScreenProps> };
const loaded = new Map<Loader, Promise<Mod> & { mod?: Mod }>();

function route(path: string, load: Loader, key?: RouteDef['key']): RouteDef {
  const once: Loader = () => {
    let p = loaded.get(load);
    if (!p) {
      p = load().then((m) => ((p!.mod = m), m)) as Promise<Mod> & { mod?: Mod };
      loaded.set(load, p);
    }
    return p;
  };
  // Once the chunk is in memory, hand React a thenable that resolves
  // synchronously, so the page renders on its first frame (no Suspense flash).
  const Component = lazy(() => {
    const done = loaded.get(load)?.mod;
    return done ? ({ then: (res: (m: Mod) => void) => res(done) } as unknown as Promise<Mod>) : once();
  });
  return { path, load: once, Component, key };
}

const plan = () => import('../screens/plan/PlanDay');
const explore = () => import('../screens/activities/Explore');

export const ROUTES: RouteDef[] = [
  { path: '/', load: async () => ({ default: Today }), Component: Today },

  route('/plan', plan, () => 'plan'),
  route('/plan/:day', plan, () => 'plan'),
  route('/route/:id', () => import('../screens/plan/RouteOption')),
  route('/pack', () => import('../screens/plan/Packing')),
  route('/before', () => import('../screens/plan/BeforeYouGo')),

  route('/explore', explore, () => 'explore'),
  route('/explore/:filter', explore, () => 'explore'),
  route('/do/:id', () => import('../screens/activities/Activity')),
  route('/color', () => import('../screens/activities/ColorReport')),
  route('/food', () => import('../screens/activities/Food')),

  route('/kids', () => import('../screens/kids/KidsHome')),
  route('/kids/hunt', () => import('../screens/kids/Hunt')),
  route('/kids/leaves', () => import('../screens/kids/Leaves')),
  route('/kids/tracks', () => import('../screens/kids/Tracks')),
  route('/kids/rocks', () => import('../screens/kids/Rocks')),
  route('/kids/sky', () => import('../screens/kids/Sky')),
  route('/kids/games', () => import('../screens/kids/Games')),
  route('/kids/draw', () => import('../screens/kids/Draw')),
  route('/kids/photos', () => import('../screens/kids/Photos')),
  route('/kids/cozy', () => import('../screens/kids/Cozy')),

  route('/faith', () => import('../screens/faith/FaithHome')),
  route('/faith/verse', () => import('../screens/faith/VerseGame')),
  route('/faith/journal', () => import('../screens/faith/Journal')),
  route('/faith/lookback', () => import('../screens/faith/Lookback')),
  route('/faith/:id', () => import('../screens/faith/Devotion')),

  route('/settings', () => import('../screens/more/Settings')),
  route('/about', () => import('../screens/more/About')),
  route('/install', () => import('../screens/more/Install')),

  // Review only: every primitive in every state. Not in the tab bar or the offline list.
  route('/_kit', () => import('../screens/_kit/Kit')),
];

// Guard: the contract in src/routes.ts and this table must agree.
if (import.meta.env.DEV) {
  const here = new Set(ROUTES.map((r) => r.path));
  const missing = ROUTE_PATHS.filter((p) => !here.has(p));
  if (missing.length) console.warn('routes.tsx is missing', missing);
}

// Route-pattern matching mirrors wouter's (regexparam-style ":param" segments).
function toRegex(pattern: string) {
  const keys: string[] = [];
  const src = pattern.replace(/\/:(\w+)/g, (_, k) => {
    keys.push(k);
    return '/([^/]+)';
  });
  return { pattern: new RegExp(`^${src}/?$`, 'i'), keys };
}
setPreloader((path) => {
  const r = ROUTES.find((x) => matchRoute(toRegex, x.path, path)[0]);
  return r ? r.load() : Promise.resolve();
});

/** Warm every screen chunk once the app is idle (they are precached anyway). */
export function preloadScreens() {
  const go = () => ROUTES.forEach((r) => r.load().catch(() => {}));
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 3000 });
  else setTimeout(go, 1500);
}
